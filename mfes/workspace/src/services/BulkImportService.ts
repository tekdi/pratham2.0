import { v4 as uuidv4 } from 'uuid';
import { post, patch } from './RestClient';
import { getLocalStoredUserId } from './LocalStorageService';

// ─────────────────────────────────────────────
// CSV Row type (matches the Excel format)
// ─────────────────────────────────────────────

export interface CSVRow {
  domain: string;
  language: string;
  subDomain: string;
  subject: string;
  testName: string;
  description: string;
  'Question count': string;
  sectionName: string;
  question: string;
  question_image: string;
  option0: string;
  option0_image: string;
  option1: string;
  option1_image: string;
  option2: string;
  option2_image: string;
  option3: string;
  option3_image: string;
  ansOption: string;   // 0-indexed correct option (0, 1, 2, or 3)
  maxScore: string;
  questionType: string;
  assessmentType: string;
  program: string;
  [key: string]: string; // extra columns are ignored
}

// ─────────────────────────────────────────────
// Parsed domain types
// ─────────────────────────────────────────────

export interface ParsedQuestion {
  text: string;
  options: string[];       // always 4 slots; empty string if not provided
  correctIndex: number;    // 0-based
  marks: number;
}

export interface ParsedSection {
  name: string;
  questions: ParsedQuestion[];
}

export interface QuestionSetMeta {
  domain: string;
  subDomain: string;
  subject: string;
  language: string;
  assessmentType: string;
  program: string;
  description: string;
}

export interface ParsedQuestionSet {
  name: string;
  meta: QuestionSetMeta;
  sections: ParsedSection[];
}

export interface ValidationError {
  row: number;
  column: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  questionSets: ParsedQuestionSet[];
}

export interface ImportProgress {
  questionSetName: string;
  status: 'pending' | 'creating' | 'adding_sections' | 'submitting_review' | 'done' | 'failed';
  identifier?: string;
  error?: string;
}

export interface ImportResult {
  questionSetName: string;
  success: boolean;
  identifier?: string;
  error?: string;
}

// ─────────────────────────────────────────────
// Required columns
// ─────────────────────────────────────────────

export const CSV_REQUIRED_COLUMNS = [
  'testName',
  'sectionName',
  'question',
  'option0',
  'option1',
  'ansOption',
  'maxScore',
] as const;

// ─────────────────────────────────────────────
// CSV Template download
// ─────────────────────────────────────────────

const TEMPLATE_HEADERS = [
  'domain', 'language', 'subDomain', 'subject',
  'testName', 'description', 'sectionName',
  'question', 'question_image',
  'option0', 'option0_image',
  'option1', 'option1_image',
  'option2', 'option2_image',
  'option3', 'option3_image',
  'ansOption', 'maxScore', 'questionType', 'assessmentType', 'program',
];

const TEMPLATE_ROWS = [
  [
    'Learning for Life', 'Hindi', 'Creative Arts', 'Art & Culture',
    'Sample Practice Set', 'A sample practice question set', 'Section 1',
    'What is 2 + 2?', '',
    '3', '', '4', '', '5', '', '6', '',
    '1', '1', 'MULTIPLE CHOICE', '', '',
  ],
  [
    'Learning for Life', 'Hindi', 'Creative Arts', 'Art & Culture',
    'Sample Practice Set', 'A sample practice question set', 'Section 1',
    'Which planet is the Red Planet?', '',
    'Earth', '', 'Venus', '', 'Mars', '', 'Jupiter', '',
    '2', '2', 'MULTIPLE CHOICE', '', '',
  ],
  [
    'Learning for Life', 'Hindi', 'Creative Arts', 'Art & Culture',
    'Sample Practice Set', 'A sample practice question set', 'Section 2',
    'Capital of France?', '',
    'London', '', 'Berlin', '', 'Paris', '', 'Madrid', '',
    '2', '1', 'MULTIPLE CHOICE', '', '',
  ],
];

export function downloadCSVTemplate(): void {
  const header = TEMPLATE_HEADERS.join(',');
  const rows = TEMPLATE_ROWS.map((row) =>
    row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'bulk_import_questionset_template.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────

const VALID_NAME_REGEX = /^[\p{L}\p{M}\p{N} &()_\-:;?,.]+$/u;
const MAX_QUESTIONS_PER_SET = 500;
const MAX_SECTIONS_PER_SET = 20;
const MAX_QUESTION_SETS = 10;

export function validateCSVData(
  rows: CSVRow[],
  headers: string[]
): ValidationResult {
  const errors: ValidationError[] = [];

  // Check required columns
  const missingCols = CSV_REQUIRED_COLUMNS.filter((c) => !headers.includes(c));
  if (missingCols.length > 0) {
    errors.push({
      row: 0,
      column: 'header',
      message: `Missing required columns: ${missingCols.join(', ')}`,
      severity: 'error',
    });
    return { valid: false, errors, questionSets: [] };
  }

  if (rows.length === 0) {
    errors.push({ row: 0, column: 'file', message: 'CSV file has no data rows.', severity: 'error' });
    return { valid: false, errors, questionSets: [] };
  }

  // Map: testName → { meta, sections: Map<sectionName, questions[]> }
  type QSAccum = {
    meta: QuestionSetMeta;
    sectionMap: Map<string, { row: number; q: ParsedQuestion }[]>;
  };
  const qsMap = new Map<string, QSAccum>();

  rows.forEach((raw, idx) => {
    const rowNum = idx + 2; // 1-indexed + header row

    const testName     = (raw.testName || '').trim();
    const sectionName  = (raw.sectionName || '').trim();
    const questionText = (raw.question || '').trim();
    const opt0 = (raw.option0 || '').trim();
    const opt1 = (raw.option1 || '').trim();
    const opt2 = (raw.option2 || '').trim();
    const opt3 = (raw.option3 || '').trim();
    const ansOptionStr = (raw.ansOption || '').trim();
    const maxScoreStr  = (raw.maxScore || '').trim();

    // Required fields
    if (!testName) {
      errors.push({ row: rowNum, column: 'testName', message: 'testName is required.', severity: 'error' });
      return;
    }
    if (!VALID_NAME_REGEX.test(testName)) {
      errors.push({
        row: rowNum,
        column: 'testName',
        message: `testName "${testName.slice(0, 60)}" contains invalid characters.`,
        severity: 'error',
      });
      return;
    }
    if (!sectionName) {
      errors.push({ row: rowNum, column: 'sectionName', message: 'sectionName is required.', severity: 'error' });
      return;
    }
    if (!questionText) {
      errors.push({ row: rowNum, column: 'question', message: 'question text is required.', severity: 'error' });
      return;
    }
    if (!opt0) {
      errors.push({ row: rowNum, column: 'option0', message: 'option0 is required.', severity: 'error' });
      return;
    }
    if (!opt1) {
      errors.push({ row: rowNum, column: 'option1', message: 'option1 is required.', severity: 'error' });
      return;
    }

    // ansOption validation (0-indexed: 0,1,2,3)
    const ansOption = parseInt(ansOptionStr, 10);
    if (isNaN(ansOption) || ansOption < 0 || ansOption > 3) {
      errors.push({
        row: rowNum,
        column: 'ansOption',
        message: `ansOption must be 0, 1, 2, or 3 (0-indexed). Got: "${ansOptionStr}".`,
        severity: 'error',
      });
      return;
    }

    // Ensure the selected answer option is not empty
    const opts = [opt0, opt1, opt2, opt3];
    if (!opts[ansOption]) {
      errors.push({
        row: rowNum,
        column: 'ansOption',
        message: `ansOption (${ansOption}) refers to an empty option. option${ansOption} is blank.`,
        severity: 'error',
      });
      return;
    }

    // maxScore validation
    const maxScore = parseFloat(maxScoreStr);
    if (isNaN(maxScore) || maxScore <= 0) {
      errors.push({
        row: rowNum,
        column: 'maxScore',
        message: `maxScore must be a positive number. Got: "${maxScoreStr}".`,
        severity: 'error',
      });
      return;
    }

    // Accumulate
    if (!qsMap.has(testName)) {
      qsMap.set(testName, {
        meta: {
          domain:        (raw.domain || '').trim(),
          subDomain:     (raw.subDomain || '').trim(),
          subject:       (raw.subject || '').trim(),
          language:      (raw.language || '').trim(),
          assessmentType:(raw.assessmentType || '').trim(),
          program:       (raw.program || '').trim(),
          description:   (raw.description || '').trim(),
        },
        sectionMap: new Map(),
      });
    }

    const qsEntry = qsMap.get(testName)!;
    if (!qsEntry.sectionMap.has(sectionName)) {
      qsEntry.sectionMap.set(sectionName, []);
    }
    qsEntry.sectionMap.get(sectionName)!.push({
      row: rowNum,
      q: {
        text: questionText,
        options: opts,
        correctIndex: ansOption,
        marks: maxScore,
      },
    });
  });

  // Limits
  if (qsMap.size > MAX_QUESTION_SETS) {
    errors.push({
      row: 0,
      column: 'testName',
      message: `Too many question sets in one file. Max ${MAX_QUESTION_SETS}, found ${qsMap.size}.`,
      severity: 'error',
    });
  }

  const questionSets: ParsedQuestionSet[] = [];

  qsMap.forEach((entry, testName) => {
    const sections: ParsedSection[] = [];
    let totalQ = 0;

    if (entry.sectionMap.size > MAX_SECTIONS_PER_SET) {
      errors.push({
        row: 0,
        column: 'sectionName',
        message: `"${testName}" has ${entry.sectionMap.size} sections (max ${MAX_SECTIONS_PER_SET}).`,
        severity: 'error',
      });
    }

    entry.sectionMap.forEach((items, sectionName) => {
      totalQ += items.length;
      sections.push({ name: sectionName, questions: items.map((i) => i.q) });
    });

    if (totalQ > MAX_QUESTIONS_PER_SET) {
      errors.push({
        row: 0,
        column: 'question',
        message: `"${testName}" has ${totalQ} questions (max ${MAX_QUESTIONS_PER_SET}).`,
        severity: 'error',
      });
    }

    questionSets.push({ name: testName, meta: entry.meta, sections });
  });

  const hasErrors = errors.some((e) => e.severity === 'error');
  return { valid: !hasErrors, errors, questionSets };
}

// ─────────────────────────────────────────────
// MCQ node builder for hierarchy update
// ─────────────────────────────────────────────

function buildMCQNodeMetadata(
  q: ParsedQuestion,
  meta: QuestionSetMeta,
  userId: string,
  frameworkId: string,
  channelId: string
): Record<string, unknown> {
  // Only include non-empty options in the interaction
  const optionObjects = q.options
    .map((opt, idx) => ({ label: `<p>${opt}</p>`, value: idx }))
    .filter((o) => (q.options[o.value] || '').trim() !== '');

  const editorOptions = optionObjects.map((o) => ({
    value: { body: o.label, value: o.value },
  }));

  const correctOption = q.options[q.correctIndex];

  return {
    mimeType: 'application/vnd.sunbird.question',
    primaryCategory: 'Multiple Choice Question',
    qType: 'MCQ',
    name: q.text.slice(0, 120),
    body: `<div class='question-body' tabindex='-1'><div class='mcq-title' tabindex='0'><p>${q.text}</p></div><div data-choice-interaction='response1' class='mcq-vertical'></div></div>`,
    interactionTypes: ['choice'],
    interactions: {
      response1: {
        type: 'choice',
        options: optionObjects,
        validation: { required: 'Yes' },
      },
    },
    responseDeclaration: {
      response1: {
        cardinality: 'single',
        type: 'integer',
        correctResponse: { value: q.correctIndex },
        mapping: [{ value: q.correctIndex, score: q.marks }],
      },
    },
    outcomeDeclaration: {
      maxScore: {
        cardinality: 'single',
        type: 'integer',
        defaultValue: q.marks,
      },
    },
    editorState: {
      options: editorOptions,
      question: `<p>${q.text}</p>`,
    },
    answer: `<div class='answer-container'><p>${correctOption}</p></div>`,
    maxScore: q.marks,
    media: [],
    visibility: 'Parent',
    createdBy: userId,
    framework: frameworkId,
    channel: channelId,
    license: 'CC BY 4.0',
    attributions: [],
    // Metadata from the CSV row
    ...(meta.domain ? { domain: meta.domain } : {}),
    ...(meta.subDomain ? { subDomain: [meta.subDomain] } : {}),
    ...(meta.subject ? { subject: [meta.subject] } : {}),
    ...(meta.language ? { language: [resolveLanguage(meta.language)] } : {}),
    ...(meta.program ? { program: [meta.program] } : {}),
  };
}

// ─────────────────────────────────────────────
// Language normalisation
// ─────────────────────────────────────────────

const LANGUAGE_MAP: Record<string, string> = {
  hindi:    'Hindi',
  marathi:  'Marathi',
  bengali:  'Bengali',
  telugu:   'Telugu',
  odia:     'Odia',
  kannada:  'Kannada',
  tamil:    'Tamil',
  punjabi:  'Punjabi',
  english:  'English',
};

function resolveLanguage(raw: string): string {
  return LANGUAGE_MAP[raw.toLowerCase()] ?? raw;
}

// ─────────────────────────────────────────────
// API calls
// ─────────────────────────────────────────────

export async function createQuestionSetAPI(
  frameworkId: string,
  name: string
): Promise<string> {
  const apiURL = '/action/questionset/v2/create';
  const reqBody = {
    request: {
      questionset: {
        name,
        mimeType: 'application/vnd.sunbird.questionset',
        primaryCategory: 'Practice Question Set',
        code: uuidv4(),
        createdBy: getLocalStoredUserId(),
        framework: frameworkId,
      },
    },
  };
  const response = await post(apiURL, reqBody);
  const identifier = response?.data?.result?.identifier;
  if (!identifier) {
    throw new Error('Failed to create question set: no identifier returned');
  }
  return identifier;
}

export async function updateHierarchyWithSectionsAndQuestions(
  questionSetId: string,
  qs: ParsedQuestionSet,
  frameworkId: string,
  channelId: string
): Promise<void> {
  const userId = getLocalStoredUserId() ?? '';
  const nodesModified: Record<string, unknown> = {};
  const hierarchy: Record<string, unknown> = {};

  // Total score = sum of all question marks
  const totalScore = qs.sections.reduce(
    (sum, sec) => sum + sec.questions.reduce((s, q) => s + q.marks, 0),
    0
  );

  // Root questionset node
  nodesModified[questionSetId] = {
    root: true,
    objectType: 'QuestionSet',
    isNew: false,
    metadata: {
      name: qs.name,
      description: qs.meta.description || qs.name,
      requiresSubmit: 'No',
      showTimer: false,
      primaryCategory: 'Practice Question Set',
      attributions: [],
      timeLimits: { questionSet: { max: 3600, min: 0 } },
      // Enrich with metadata fields from CSV
      ...(qs.meta.domain ? { domain: qs.meta.domain } : {}),
      ...(qs.meta.subDomain ? { subDomain: [qs.meta.subDomain] } : {}),
      ...(qs.meta.subject ? { subject: [qs.meta.subject] } : {}),
      ...(qs.meta.language ? { language: [resolveLanguage(qs.meta.language)] } : {}),
      ...(qs.meta.assessmentType ? { assessmentType: qs.meta.assessmentType } : {}),
      ...(qs.meta.program ? { program: [qs.meta.program] } : {}),
      outcomeDeclaration: {
        maxScore: {
          cardinality: 'single',
          type: 'integer',
          defaultValue: totalScore,
        },
      },
    },
  };

  const sectionUUIDs: string[] = [];

  qs.sections.forEach((section) => {
    const sectionUUID = uuidv4();
    sectionUUIDs.push(sectionUUID);

    const questionUUIDs: string[] = [];

    section.questions.forEach((q) => {
      const qUUID = uuidv4();
      questionUUIDs.push(qUUID);

      nodesModified[qUUID] = {
        root: false,
        objectType: 'Question',
        isNew: true,
        metadata: buildMCQNodeMetadata(q, qs.meta, userId, frameworkId, channelId),
      };
    });

    nodesModified[sectionUUID] = {
      root: false,
      objectType: 'QuestionSet',
      isNew: true,
      metadata: {
        mimeType: 'application/vnd.sunbird.questionset',
        code: sectionUUID,
        name: section.name,
        visibility: 'Parent',
        primaryCategory: 'Practice Question Set',
        shuffle: false,
        showFeedback: false,
        showSolutions: false,
        attributions: [],
        timeLimits: { questionSet: { max: 0, min: 0 } },
      },
    };

    hierarchy[sectionUUID] = {
      name: section.name,
      children: questionUUIDs,
      root: false,
    };
  });

  hierarchy[questionSetId] = {
    name: qs.name,
    children: sectionUUIDs,
    root: true,
  };

  const reqBody = {
    request: {
      data: {
        nodesModified,
        hierarchy,
        lastUpdatedBy: userId,
      },
    },
  };

  const response = await patch(
    '/mfe_workspace/action/questionset/v2/hierarchy/update',
    reqBody,
    { Accept: 'application/json, text/plain, */*', 'Content-Type': 'application/json' }
  );

  if (!response?.data?.result) {
    throw new Error('Hierarchy update failed');
  }
}

export async function sendQuestionSetForReview(identifier: string): Promise<void> {
  const apiURL = `/action/questionset/v2/review/${identifier}`;
  const response = await post(apiURL, { request: { questionset: {} } });
  if (response?.data?.responseCode !== 'OK') {
    throw new Error(
      `Send-for-review failed: ${response?.data?.params?.errmsg ?? 'Unknown error'}`
    );
  }
}

// ─────────────────────────────────────────────
// Orchestrator for a single question set
// ─────────────────────────────────────────────

export async function importSingleQuestionSet(
  qs: ParsedQuestionSet,
  frameworkId: string,
  channelId: string,
  onProgress: (status: ImportProgress['status']) => void
): Promise<ImportResult> {
  try {
    onProgress('creating');
    const identifier = await createQuestionSetAPI(frameworkId, qs.name);

    onProgress('adding_sections');
    await updateHierarchyWithSectionsAndQuestions(identifier, qs, frameworkId, channelId);

    onProgress('submitting_review');
    await sendQuestionSetForReview(identifier);

    onProgress('done');
    return { questionSetName: qs.name, success: true, identifier };
  } catch (err: any) {
    onProgress('failed');
    console.error(`[BulkImport] "${qs.name}" failed:`, err);
    return {
      questionSetName: qs.name,
      success: false,
      error: err?.message ?? String(err),
    };
  }
}
