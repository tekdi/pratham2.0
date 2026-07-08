// ============================================================
// BULK IMPORT — VALIDATOR
// Pratham 2.0 — Workspace MFE
//
// Client-side validation for parsed import data.
// Reads required fields from frameworkConfig so validation
// stays in sync with whichever framework template was uploaded.
// ============================================================

import {
  ParsedImportData,
  ContentRow,
  QuestionSetRow,
  QuestionRow,
  CourseRow,
  CourseChildMappingRow,
  ExistingContentMappingRow,
  ValidationError,
  ValidationResult,
  FrameworkId,
} from '../types/bulkImport.types';
import {
  getFrameworkColumns,
  POS_CONTENT_COLUMNS,
  SCP_CONTENT_COLUMNS,
  LOOKUP,
  ColumnDef,
  POS_DOMAIN_TO_SUBDOMAINS,
  POS_SUBDOMAIN_TO_SUBJECTS,
  splitMultiValue,
} from './frameworkConfig';
import { extractDriveFileId } from '../services/BulkImportService';

// ─── Constants ────────────────────────────────────────────────

const VALID_FILE_TYPES      = LOOKUP.FILE_TYPES      as readonly string[];
const VALID_QT_TYPES        = LOOKUP.QUESTION_TYPES  as readonly string[];
const VALID_CHILD_TYPES     = LOOKUP.CHILD_TYPES     as readonly string[];
const VALID_ASSESSMENT_TYPES = LOOKUP.ASSESSMENT_TYPES as readonly string[];
const VALID_EVALUATION_TYPES = LOOKUP.EVALUATION_TYPES as readonly string[];

const TEMP_ID_PATTERN        = /^TEMP_(CONTENT|QS|COURSE|EXISTING)_\d+$/i;
const EXISTING_DO_PATTERN    = /^do_/;

// ─── Error factory ────────────────────────────────────────────

const err = (
  sheet: ValidationError['sheet'],
  row: number,
  column: string,
  message: string,
  tempId?: string,
  severity: ValidationError['severity'] = 'error'
): ValidationError => ({ sheet, row, column, message, tempId, severity });

// ─── Detect framework from parsed rows ────────────────────────
// The parser already stamps framework on each row. We just pick the
// first content / QS / course row's framework field.

const detectFramework = (data: ParsedImportData): FrameworkId => {
  return (
    (data.contents[0]?.framework as FrameworkId) ||
    (data.questionSets[0]?.framework as FrameworkId) ||
    (data.courses[0]?.framework as FrameworkId) ||
    'pos-framework'
  );
};

// ─── Generic required-field checker ───────────────────────────

const checkRequired = <T extends object>(
  rows: T[],
  sheet: ValidationError['sheet'],
  requiredApiFields: { apiField: string; header: string }[],
  getTempId: (row: T) => string | undefined,
  errors: ValidationError[]
) => {
  rows.forEach((row, idx) => {
    const rowNum = idx + 2;
    requiredApiFields.forEach(({ apiField, header }) => {
      const val = (row as any)[apiField];
      if (val === undefined || val === null || String(val).trim() === '') {
        errors.push(err(sheet, rowNum, header,
          `"${header}" is required`, getTempId(row)));
      }
    });
  });
};

// ─── Dropdown value validator ────────────────────────────────────
// For every column that has a lookupKey, verify the entered value exists
// in the allowed list. Skips blank values (required check handles those).
// Multi-select columns accept pipe- or comma-separated values; each
// individual value is validated against the allowed list.

const checkDropdownValues = <T extends object>(
  rows: T[],
  sheet: ValidationError['sheet'],
  cols: ColumnDef[],
  getTempId: (row: T) => string | undefined,
  errors: ValidationError[]
) => {
  const dropdownCols = cols.filter((c) => c.lookupKey);

  rows.forEach((row, idx) => {
    const rowNum = idx + 2;
    dropdownCols.forEach(({ apiField, header, lookupKey, multiSelect }) => {
      const raw = (row as any)[apiField];
      if (raw === undefined || raw === null || String(raw).trim() === '') return;

      const allowed = LOOKUP[lookupKey!] as readonly string[];
      if (!allowed) return;

      const values = multiSelect ? splitMultiValue(String(raw)) : [String(raw).trim()];
      values.forEach((val) => {
        if (!allowed.includes(val)) {
          // Show at most 8 example values so the error message stays readable
          const examples = (allowed as readonly string[]).slice(0, 8).join(', ');
          const ellipsis = allowed.length > 8 ? ` … (${allowed.length} total)` : '';
          errors.push(err(
            sheet, rowNum, header,
            `"${val}" is not a valid value for "${header}". Examples: ${examples}${ellipsis}`,
            getTempId(row)
          ));
        }
      });
    });
  });
};

// ─── Validate Content Sheet ────────────────────────────────────

const validateContents = (
  contents: ContentRow[],
  fw: FrameworkId,
  errors: ValidationError[]
) => {
  const cols = fw === 'scp-framework' ? SCP_CONTENT_COLUMNS : POS_CONTENT_COLUMNS;
  const requiredCols = cols.filter((c) => c.required).map((c) => ({
    apiField: c.apiField,
    header: c.header,
  }));

  checkRequired(contents, 'Content', requiredCols, (r) => r.tempId, errors);
  checkDropdownValues(contents, 'Content', cols, (r) => r.tempId, errors);

  const seenIds = new Set<string>();

  contents.forEach((row, idx) => {
    const rowNum = idx + 2;

    // Temp ID format
    if (row.tempId && !TEMP_ID_PATTERN.test(row.tempId)) {
      errors.push(err('Content', rowNum, 'Temp ID*',
        `Temp ID "${row.tempId}" must follow pattern TEMP_CONTENT_N (e.g. TEMP_CONTENT_1)`, row.tempId));
    }

    // Duplicate Temp ID
    if (row.tempId) {
      if (seenIds.has(row.tempId)) {
        errors.push(err('Content', rowNum, 'Temp ID*',
          `Duplicate Temp ID "${row.tempId}"`, row.tempId));
      }
      seenIds.add(row.tempId);
    }

    // File type
    if (row.fileType && !VALID_FILE_TYPES.includes(row.fileType.toLowerCase())) {
      errors.push(err('Content', rowNum, 'File Type*',
        `File type "${row.fileType}" is not valid. Allowed: ${VALID_FILE_TYPES.join(', ')}`, row.tempId));
    }

    // File/Content URL — Drive URL or YouTube URL
    if (row.driveUrl) {
      const isYoutube = row.fileType === 'youtube';
      const isDrive = row.driveUrl.includes('drive.google.com') || row.driveUrl.includes('docs.google.com');
      const isYoutubeUrl = row.driveUrl.includes('youtube.com') || row.driveUrl.includes('youtu.be');

      if (isYoutube) {
        if (!isYoutubeUrl) {
          errors.push(err('Content', rowNum, 'File/Content URL*',
            'File Type is "youtube" but the URL is not a YouTube link (youtube.com or youtu.be)', row.tempId));
        }
      } else {
        if (!isDrive) {
          errors.push(err('Content', rowNum, 'File/Content URL*',
            'URL must be a Google Drive share link (drive.google.com) or YouTube URL for youtube file type', row.tempId));
        } else if (!extractDriveFileId(row.driveUrl)) {
          errors.push(err('Content', rowNum, 'File/Content URL*',
            'Could not extract file ID from Drive URL. Use format: https://drive.google.com/file/d/FILE_ID/view', row.tempId));
        }
      }
    }

    // Domain → Sub Domain → Subject association validation
    if (row.domain && row.subDomain) {
      const allowedSubDomains = POS_DOMAIN_TO_SUBDOMAINS[row.domain] ?? [];
      const selectedSubDomains = splitMultiValue(row.subDomain);
      const invalidSubs = selectedSubDomains.filter((sd) => allowedSubDomains.length > 0 && !allowedSubDomains.includes(sd));
      if (invalidSubs.length > 0) {
        errors.push(err('Content', rowNum, 'Sub Domain*',
          `Sub Domain(s) "${invalidSubs.join(', ')}" do not belong to domain "${row.domain}". Allowed: ${allowedSubDomains.join(', ')}`,
          row.tempId));
      }
    }
    if (row.subDomain && row.subject) {
      const selectedSubDomains = splitMultiValue(row.subDomain);
      const selectedSubjects = splitMultiValue(row.subject);
      selectedSubjects.forEach((subj) => {
        const validForAny = selectedSubDomains.some((sd) => {
          const allowed = POS_SUBDOMAIN_TO_SUBJECTS[sd] ?? [];
          return allowed.length === 0 || allowed.includes(subj);
        });
        if (!validForAny) {
          errors.push(err('Content', rowNum, 'Subject*',
            `Subject "${subj}" does not belong to any of the selected Sub Domain(s). Check the domain/sub-domain associations.`,
            row.tempId));
        }
      });
    }

    // Name length
    if (row.name && row.name.length > 250) {
      errors.push(err('Content', rowNum, 'Name*',
        'Name exceeds 250 characters', row.tempId, 'warning'));
    }
  });
};

// ─── Validate QuestionSets Sheet ──────────────────────────────

const validateQuestionSets = (
  questionSets: QuestionSetRow[],
  fw: FrameworkId,
  errors: ValidationError[]
) => {
  const cols = getFrameworkColumns(fw).qsColumns;
  const requiredCols = cols.filter((c) => c.required).map((c) => ({
    apiField: c.apiField,
    header: c.header,
  }));

  checkRequired(questionSets, 'QuestionSets', requiredCols, (r) => r.tempId, errors);
  checkDropdownValues(questionSets, 'QuestionSets', cols, (r) => r.tempId, errors);

  const seenIds = new Set<string>();

  questionSets.forEach((row, idx) => {
    const rowNum = idx + 2;

    if (row.tempId && !TEMP_ID_PATTERN.test(row.tempId)) {
      errors.push(err('QuestionSets', rowNum, 'Temp ID*',
        `Temp ID "${row.tempId}" must follow pattern TEMP_QS_N`, row.tempId));
    }

    if (row.tempId) {
      if (seenIds.has(row.tempId)) {
        errors.push(err('QuestionSets', rowNum, 'Temp ID*',
          `Duplicate Temp ID "${row.tempId}"`, row.tempId));
      }
      seenIds.add(row.tempId);
    }

    // Domain → Sub Domain → Subject association validation (POS QS)
    if (row.domain && row.subDomain) {
      const allowedSubDomains = POS_DOMAIN_TO_SUBDOMAINS[row.domain] ?? [];
      const selectedSubDomains = splitMultiValue(row.subDomain);
      const invalidSubs = selectedSubDomains.filter((sd) => allowedSubDomains.length > 0 && !allowedSubDomains.includes(sd));
      if (invalidSubs.length > 0) {
        errors.push(err('QuestionSets', rowNum, 'Sub Domain*',
          `Sub Domain(s) "${invalidSubs.join(', ')}" do not belong to domain "${row.domain}". Allowed: ${allowedSubDomains.join(', ')}`,
          row.tempId));
      }
    }

    if (row.assessmentType && !VALID_ASSESSMENT_TYPES.includes(row.assessmentType)) {
      errors.push(err('QuestionSets', rowNum, 'Assessment Type',
        `Assessment Type "${row.assessmentType}" is not valid. Allowed: ${VALID_ASSESSMENT_TYPES.join(', ')}`,
        row.tempId));
    }

    if (row.evaluationType && !VALID_EVALUATION_TYPES.includes(row.evaluationType)) {
      errors.push(err('QuestionSets', rowNum, 'Evaluation Type',
        `Evaluation Type "${row.evaluationType}" is not valid. Allowed: ${VALID_EVALUATION_TYPES.join(', ')}`,
        row.tempId));
    }
  });
};

// ─── Validate Questions Sheet ─────────────────────────────────

const validateQuestions = (
  questions: QuestionRow[],
  questionSets: QuestionSetRow[],
  existingMappings: ExistingContentMappingRow[],
  errors: ValidationError[]
) => {
  const knownQSIds = new Set([
    ...questionSets.map((q) => q.tempId),
    ...existingMappings
      .filter((e) => e.entityType === 'questionset')
      .map((e) => e.tempId),
  ]);

  questions.forEach((row, idx) => {
    const rowNum = idx + 2;

    // Required fields
    if (!row.questionSetTempId)
      errors.push(err('Questions', rowNum, 'QuestionSet Temp ID*', '"QuestionSet Temp ID*" is required'));
    if (!row.questionType)
      errors.push(err('Questions', rowNum, 'Question Type*', '"Question Type*" is required'));
    if (!row.questionText)
      errors.push(err('Questions', rowNum, 'Question Text*', '"Question Text*" is required'));

    // QS reference exists
    if (row.questionSetTempId && !knownQSIds.has(row.questionSetTempId)) {
      errors.push(err('Questions', rowNum, 'QuestionSet Temp ID*',
        `QuestionSet Temp ID "${row.questionSetTempId}" not found in QuestionSets or ExistingContentMapping sheet`));
    }

    // Question type valid
    if (row.questionType && !VALID_QT_TYPES.includes(row.questionType)) {
      errors.push(err('Questions', rowNum, 'Question Type*',
        `Question type "${row.questionType}" is not valid. Allowed: ${VALID_QT_TYPES.join(', ')}`));
    }

    // MCQ must have options
    if (row.questionType === 'MCQ' && !row.options) {
      errors.push(err('Questions', rowNum, 'Options',
        'MCQ questions must have options (pipe-separated: A|B|C|D)'));
    }

    // Match: options must be Key:Value format
    if (row.questionType === 'Match' && row.options) {
      const valid = row.options.split('|').every((p) => p.includes(':'));
      if (!valid) {
        errors.push(err('Questions', rowNum, 'Options',
          'Match options must be "Left:Right" pairs separated by | e.g. Term1:Def1|Term2:Def2'));
      }
    }

    // MCQ/Match should have correct answer
    if ((row.questionType === 'MCQ' || row.questionType === 'Match') && !row.correctAnswer) {
      errors.push(err('Questions', rowNum, 'Correct Answer',
        `${row.questionType} questions should have a Correct Answer`, undefined, 'warning'));
    }
  });

  // ── Section Description / Instructions — required per section ──
  // The hierarchy update takes them from the first filled row of each
  // section, so each (QS, section) group must have them on at least one row.
  const sectionGroups = new Map<string, {
    firstRowNum: number;
    sectionName: string;
    hasDescription: boolean;
    hasInstructions: boolean;
  }>();

  questions.forEach((row, idx) => {
    const rowNum = idx + 2;
    const sectionName = (row.sectionName || 'Section 1').trim();
    const key = `${row.questionSetTempId || ''}::${sectionName}`;

    let group = sectionGroups.get(key);
    if (!group) {
      group = { firstRowNum: rowNum, sectionName, hasDescription: false, hasInstructions: false };
      sectionGroups.set(key, group);
    }
    if (row.sectionDescription && String(row.sectionDescription).trim() !== '') {
      group.hasDescription = true;
    }
    if (row.sectionInstructions && String(row.sectionInstructions).trim() !== '') {
      group.hasInstructions = true;
    }
  });

  sectionGroups.forEach((group) => {
    if (!group.hasDescription) {
      errors.push(err('Questions', group.firstRowNum, 'Section Description*',
        `"Section Description*" is required for section "${group.sectionName}" — fill it on at least one row of the section`));
    }
    if (!group.hasInstructions) {
      errors.push(err('Questions', group.firstRowNum, 'Section Instructions*',
        `"Section Instructions*" is required for section "${group.sectionName}" — fill it on at least one row of the section`));
    }
  });
};

// ─── Validate Courses Sheet ───────────────────────────────────

const validateCourses = (
  courses: CourseRow[],
  fw: FrameworkId,
  errors: ValidationError[]
) => {
  const cols = getFrameworkColumns(fw).courseColumns;
  const requiredCols = cols.filter((c) => c.required).map((c) => ({
    apiField: c.apiField,
    header: c.header,
  }));

  checkRequired(courses, 'Courses', requiredCols, (r) => r.tempId, errors);
  checkDropdownValues(courses, 'Courses', cols, (r) => r.tempId, errors);

  const seenIds = new Set<string>();

  courses.forEach((row, idx) => {
    const rowNum = idx + 2;

    if (row.tempId && !TEMP_ID_PATTERN.test(row.tempId)) {
      errors.push(err('Courses', rowNum, 'Temp ID*',
        `Temp ID "${row.tempId}" must follow pattern TEMP_COURSE_N`, row.tempId));
    }

    if (row.tempId) {
      if (seenIds.has(row.tempId)) {
        errors.push(err('Courses', rowNum, 'Temp ID*',
          `Duplicate Temp ID "${row.tempId}"`, row.tempId));
      }
      seenIds.add(row.tempId);
    }
  });
};

// ─── Validate CourseChildrenMapping ───────────────────────────

const validateCourseMappings = (
  mappings: CourseChildMappingRow[],
  courses: CourseRow[],
  contents: ContentRow[],
  questionSets: QuestionSetRow[],
  existingMappings: ExistingContentMappingRow[],
  errors: ValidationError[]
) => {
  const courseTempIds  = new Set(courses.map((c) => c.tempId));
  const contentIds     = new Set(contents.map((c) => c.tempId));
  const qsIds          = new Set(questionSets.map((q) => q.tempId));
  const existingIds    = new Set(existingMappings.map((e) => e.tempId));
  const allChildRefs   = new Set([...contentIds, ...qsIds, ...existingIds]);

  mappings.forEach((row, idx) => {
    const rowNum = idx + 2;

    if (!row.courseTempId)
      errors.push(err('CourseChildrenMapping', rowNum, 'Course Temp ID*', '"Course Temp ID*" is required'));
    if (!row.unitName)
      errors.push(err('CourseChildrenMapping', rowNum, 'Unit Name*', '"Unit Name*" is required'));
    if (!row.childRef)
      errors.push(err('CourseChildrenMapping', rowNum, 'Child Ref*', '"Child Ref*" is required'));
    if (!row.childType)
      errors.push(err('CourseChildrenMapping', rowNum, 'Child Type*', '"Child Type*" is required'));
    if (!row.sequence)
      errors.push(err('CourseChildrenMapping', rowNum, 'Sequence*', '"Sequence*" is required'));

    if (row.courseTempId && !courseTempIds.has(row.courseTempId)) {
      errors.push(err('CourseChildrenMapping', rowNum, 'Course Temp ID*',
        `Course "${row.courseTempId}" not found in Courses sheet`));
    }

    if (row.childRef) {
      const isDirectDo = EXISTING_DO_PATTERN.test(row.childRef);
      if (!isDirectDo && !allChildRefs.has(row.childRef)) {
        errors.push(err('CourseChildrenMapping', rowNum, 'Child Ref*',
          `"${row.childRef}" not found in Content, QuestionSets, or ExistingContentMapping sheets`));
      }
    }

    if (row.childType && !VALID_CHILD_TYPES.includes(row.childType)) {
      errors.push(err('CourseChildrenMapping', rowNum, 'Child Type*',
        `Child type "${row.childType}" is not valid. Allowed: ${VALID_CHILD_TYPES.join(', ')}`));
    }

    if (row.sequence !== undefined && (isNaN(Number(row.sequence)) || Number(row.sequence) < 1)) {
      errors.push(err('CourseChildrenMapping', rowNum, 'Sequence*', 'Sequence must be a positive integer'));
    }
  });
};

// ─── Validate ExistingContentMapping ──────────────────────────

const validateExistingMappings = (
  mappings: ExistingContentMappingRow[],
  courses: CourseRow[],
  errors: ValidationError[]
) => {
  const seenIds = new Set<string>();
  const courseTempIds = new Set(courses.map((c) => c.tempId));

  mappings.forEach((row, idx) => {
    const rowNum = idx + 2;

    if (!row.tempId)
      errors.push(err('ExistingContentMapping', rowNum, 'Temp ID*', '"Temp ID*" is required'));
    if (!row.existingIdentifier)
      errors.push(err('ExistingContentMapping', rowNum, 'Existing Identifier*', '"Existing Identifier*" is required'));
    if (!row.entityType)
      errors.push(err('ExistingContentMapping', rowNum, 'Entity Type*', '"Entity Type*" is required'));

    if (row.tempId) {
      if (seenIds.has(row.tempId)) {
        errors.push(err('ExistingContentMapping', rowNum, 'Temp ID*',
          `Duplicate Temp ID "${row.tempId}"`));
      }
      seenIds.add(row.tempId);
    }

    if (row.existingIdentifier && !EXISTING_DO_PATTERN.test(row.existingIdentifier)) {
      errors.push(err('ExistingContentMapping', rowNum, 'Existing Identifier*',
        `Identifier "${row.existingIdentifier}" should start with "do_"`, undefined, 'warning'));
    }

    if (row.entityType && !VALID_CHILD_TYPES.includes(row.entityType)) {
      errors.push(err('ExistingContentMapping', rowNum, 'Entity Type*',
        `Entity type "${row.entityType}" must be: ${VALID_CHILD_TYPES.join(' or ')}`));
    }

    // Validate direct course mapping fields (if Course Temp ID is provided)
    if (row.courseTempId) {
      if (!courseTempIds.has(row.courseTempId)) {
        errors.push(err('ExistingContentMapping', rowNum, 'Course Temp ID',
          `Course "${row.courseTempId}" not found in the Courses sheet`));
      }
      if (!row.unitName) {
        errors.push(err('ExistingContentMapping', rowNum, 'Unit Name',
          '"Unit Name" is required when "Course Temp ID" is filled'));
      }
      if (row.sequence !== undefined && (isNaN(Number(row.sequence)) || Number(row.sequence) < 1)) {
        errors.push(err('ExistingContentMapping', rowNum, 'Sequence',
          'Sequence must be a positive integer'));
      }
    }
  });
};

// ─── Master Validator ─────────────────────────────────────────

export const validateImportData = (data: ParsedImportData): ValidationResult => {
  const errors: ValidationError[] = [];
  const fw = detectFramework(data);

  const totalRows =
    data.contents.length +
    data.questionSets.length +
    data.courses.length;

  if (totalRows === 0) {
    errors.push(err('General', 0, '-',
      'No data found. Please fill in at least one Content, QuestionSet, or Course row.'));
  }

  validateContents(data.contents, fw, errors);
  validateQuestionSets(data.questionSets, fw, errors);
  validateQuestions(data.questions, data.questionSets, data.existingMappings, errors);
  validateCourses(data.courses, fw, errors);
  validateCourseMappings(
    data.courseChildMappings,
    data.courses,
    data.contents,
    data.questionSets,
    data.existingMappings,
    errors
  );
  validateExistingMappings(data.existingMappings, data.courses, errors);

  const hardErrors = errors.filter((e) => e.severity === 'error');
  const warnings   = errors.filter((e) => e.severity === 'warning');

  // Count unique data rows that have at least one hard error.
  // We key by "sheet:row" so a row with 3 errors still counts as 1 invalid row.
  // Exclude row=0 (global/General errors that are not tied to a data row).
  const rowsWithErrors = new Set(
    hardErrors
      .filter((e) => e.row > 0)
      .map((e) => `${e.sheet}:${e.row}`)
  ).size;

  return {
    isValid: hardErrors.length === 0,
    errors: hardErrors,
    warnings,
    summary: {
      totalRows: totalRows + data.questions.length,
      validRows: Math.max(0, totalRows - rowsWithErrors),
      invalidRows: rowsWithErrors,
      contentCount: data.contents.length,
      questionSetCount: data.questionSets.length,
      courseCount: data.courses.length,
      questionCount: data.questions.length,
    },
  };
};
