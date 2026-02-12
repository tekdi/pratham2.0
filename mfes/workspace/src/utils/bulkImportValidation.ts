import Papa from 'papaparse';

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
  ansOption: string;
  maxScore: string;
  questionType: string;
  assessmentType: string;
  program: string;
  'Question Format': string;
}

export interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export interface ParsedQuestionSet {
  testName: string;
  description: string;
  domain: string;
  language: string;
  subDomain: string;
  subject: string;
  assessmentType: string;
  program: string;
  sections: ParsedSection[];
}

export interface ParsedSection {
  name: string;
  questions: ParsedQuestion[];
}

export interface ParsedQuestion {
  rowIndex: number;
  question: string;
  questionImage: string;
  options: { text: string; image: string }[];
  ansOption: number;
  maxScore: number;
  questionType: string;
  questionFormat: string;
}

const REQUIRED_HEADERS = [
  'domain',
  'language',
  'subDomain',
  'subject',
  'testName',
  'description',
  'sectionName',
  'question',
  'option0',
  'option1',
  'ansOption',
  'maxScore',
  'questionType',
];

const VALID_QUESTION_TYPES = ['MULTIPLE CHOICE'];

export function parseCSVFile(
  file: File
): Promise<{ data: CSVRow[]; errors: string[] }> {
  return new Promise((resolve, reject) => {
    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(),
      complete: (results) => {
        const parseErrors = results.errors
          .filter((e) => e.type !== 'FieldMismatch')
          .map((e) => `Row ${(e.row ?? 0) + 2}: ${e.message}`);
        resolve({ data: results.data, errors: parseErrors });
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

export function validateHeaders(headers: string[]): string[] {
  const trimmed = headers.map((h) => h.trim());
  const missing = REQUIRED_HEADERS.filter((rh) => !trimmed.includes(rh));
  return missing;
}

export function validateRows(rows: CSVRow[]): ValidationError[] {
  const errors: ValidationError[] = [];

  rows.forEach((row, index) => {
    const rowNum = index + 2; // +2 for header row + 0-index

    if (!row.testName?.trim()) {
      errors.push({
        row: rowNum,
        field: 'testName',
        message: 'Test name is required',
      });
    }

    if (!row.sectionName?.trim()) {
      errors.push({
        row: rowNum,
        field: 'sectionName',
        message: 'Section name is required',
      });
    }

    if (!row.question?.trim()) {
      errors.push({
        row: rowNum,
        field: 'question',
        message: 'Question text is required',
      });
    }

    if (!row.option0?.trim()) {
      errors.push({
        row: rowNum,
        field: 'option0',
        message: 'Option 0 is required',
      });
    }

    if (!row.option1?.trim()) {
      errors.push({
        row: rowNum,
        field: 'option1',
        message: 'Option 1 is required',
      });
    }

    const ansOption = parseInt(row.ansOption, 10);
    if (isNaN(ansOption) || ansOption < 1 || ansOption > 4) {
      errors.push({
        row: rowNum,
        field: 'ansOption',
        message: 'Answer option must be between 1 and 4',
      });
    }

    // Validate that the selected answer option actually has content
    if (!isNaN(ansOption) && ansOption >= 1 && ansOption <= 4) {
      const optionKey = `option${ansOption - 1}` as keyof CSVRow;
      if (!row[optionKey]?.trim()) {
        errors.push({
          row: rowNum,
          field: 'ansOption',
          message: `Answer option ${ansOption} is selected but option${ansOption - 1} is empty`,
        });
      }
    }

    const maxScore = parseInt(row.maxScore, 10);
    if (isNaN(maxScore) || maxScore < 1) {
      errors.push({
        row: rowNum,
        field: 'maxScore',
        message: 'Max score must be a positive number',
      });
    }

    if (!row.questionType?.trim()) {
      errors.push({
        row: rowNum,
        field: 'questionType',
        message: 'Question type is required',
      });
    } else if (
      !VALID_QUESTION_TYPES.includes(row.questionType.trim().toUpperCase())
    ) {
      errors.push({
        row: rowNum,
        field: 'questionType',
        message: `Invalid question type: "${row.questionType}". Supported: ${VALID_QUESTION_TYPES.join(', ')}`,
      });
    }

    if (!row.domain?.trim()) {
      errors.push({
        row: rowNum,
        field: 'domain',
        message: 'Domain is required',
      });
    }

    if (!row.language?.trim()) {
      errors.push({
        row: rowNum,
        field: 'language',
        message: 'Language is required',
      });
    }

    if (!row.subject?.trim()) {
      errors.push({
        row: rowNum,
        field: 'subject',
        message: 'Subject is required',
      });
    }
  });

  return errors;
}

export function groupByQuestionSet(rows: CSVRow[]): ParsedQuestionSet[] {
  const questionSetMap = new Map<string, ParsedQuestionSet>();

  rows.forEach((row, index) => {
    const testName = row.testName?.trim();
    if (!testName) return;

    if (!questionSetMap.has(testName)) {
      questionSetMap.set(testName, {
        testName,
        description: row.description?.trim() || '',
        domain: row.domain?.trim() || '',
        language: row.language?.trim() || '',
        subDomain: row.subDomain?.trim() || '',
        subject: row.subject?.trim() || '',
        assessmentType: row.assessmentType?.trim() || '',
        program: row.program?.trim() || '',
        sections: [],
      });
    }

    const qs = questionSetMap.get(testName)!;
    const sectionName = row.sectionName?.trim() || 'Default Section';

    let section = qs.sections.find((s) => s.name === sectionName);
    if (!section) {
      section = { name: sectionName, questions: [] };
      qs.sections.push(section);
    }

    const options = [
      { text: row.option0?.trim() || '', image: row.option0_image?.trim() || '' },
      { text: row.option1?.trim() || '', image: row.option1_image?.trim() || '' },
      { text: row.option2?.trim() || '', image: row.option2_image?.trim() || '' },
      { text: row.option3?.trim() || '', image: row.option3_image?.trim() || '' },
    ];

    section.questions.push({
      rowIndex: index + 2,
      question: row.question?.trim() || '',
      questionImage: row.question_image?.trim() || '',
      options,
      ansOption: parseInt(row.ansOption, 10) || 1,
      maxScore: parseInt(row.maxScore, 10) || 1,
      questionType: row.questionType?.trim() || 'MULTIPLE CHOICE',
      questionFormat: row['Question Format']?.trim() || '',
    });
  });

  return Array.from(questionSetMap.values());
}

export function getCSVSummary(questionSets: ParsedQuestionSet[]) {
  return {
    totalQuestionSets: questionSets.length,
    totalSections: questionSets.reduce(
      (acc, qs) => acc + qs.sections.length,
      0
    ),
    totalQuestions: questionSets.reduce(
      (acc, qs) =>
        acc + qs.sections.reduce((a, s) => a + s.questions.length, 0),
      0
    ),
    questionSets: questionSets.map((qs) => ({
      name: qs.testName,
      language: qs.language,
      sections: qs.sections.length,
      questions: qs.sections.reduce((a, s) => a + s.questions.length, 0),
    })),
  };
}
