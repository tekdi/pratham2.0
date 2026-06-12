// ============================================================
// API ROUTE: /api/bulk-import/template
// Pratham 2.0 — Workspace MFE
//
// Generates a framework-aware Excel import template using exceljs.
// • Accepts ?framework=pos-framework | scp-framework
// • Different metadata columns per framework
// • All option columns have real Excel dropdown validations
//   (data validation referencing LookupData sheet ranges)
// ============================================================

import type { NextApiRequest, NextApiResponse } from 'next';
import ExcelJS from 'exceljs';
import {
  FrameworkId,
  ColumnDef,
  LOOKUP,
  getFrameworkColumns,
  getLookupColumns,
} from '../../../utils/frameworkConfig';

// ─── Colour palette ───────────────────────────────────────────
const HEADER_BG   = 'FF2E1500';   // dark brown (primary brand)
const HEADER_FG   = 'FFFFFFFF';
const REQ_BG      = 'FFFFF3E0';   // light amber — required columns
const OPT_BG      = 'FFFAFAFA';   // near-white — optional columns
const LOOKUP_BG   = 'FFE8F5E9';   // light green — lookup sheet
const BORDER_COL  = 'FFBDBDBD';

const DATA_ROWS   = 1000;          // rows to receive dropdown validation

// ─── Helper: column letter from index (1-based) ───────────────
const colLetter = (idx: number): string => {
  let letter = '';
  while (idx > 0) {
    const mod = (idx - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    idx = Math.floor((idx - 1) / 26);
  }
  return letter;
};

// ─── Helper: apply header cell style ─────────────────────────
const styleHeader = (cell: ExcelJS.Cell, required: boolean) => {
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: HEADER_BG },
  };
  cell.font = { bold: true, color: { argb: HEADER_FG }, size: 11 };
  cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  cell.border = {
    top: { style: 'thin', color: { argb: BORDER_COL } },
    left: { style: 'thin', color: { argb: BORDER_COL } },
    bottom: { style: 'thin', color: { argb: BORDER_COL } },
    right: { style: 'thin', color: { argb: BORDER_COL } },
  };
};

// ─── Helper: style a data row cell ───────────────────────────
const styleDataCell = (cell: ExcelJS.Cell, required: boolean) => {
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: required ? REQ_BG : OPT_BG },
  };
  cell.alignment = { vertical: 'middle', wrapText: false };
  cell.border = {
    top: { style: 'hair', color: { argb: BORDER_COL } },
    left: { style: 'hair', color: { argb: BORDER_COL } },
    bottom: { style: 'hair', color: { argb: BORDER_COL } },
    right: { style: 'hair', color: { argb: BORDER_COL } },
  };
};

// ─── Build LookupData sheet and return column → range map ─────
const buildLookupSheet = (
  workbook: ExcelJS.Workbook,
  fw: FrameworkId
): Record<keyof typeof LOOKUP, string> => {
  const lookupSheet = workbook.addWorksheet('LookupData');
  const lookupCols = getLookupColumns(fw);

  // Set col widths
  lookupCols.forEach((_, i) => {
    lookupSheet.getColumn(i + 1).width = 32;
  });

  // ── Header row ──────────────────────────────────────────────
  const headerRow = lookupSheet.getRow(1);
  lookupCols.forEach((lc, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = lc.header;
    cell.font = { bold: true, color: { argb: HEADER_FG } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LOOKUP_BG.replace('FF', 'FF') } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF388E3C' } };
    cell.font = { bold: true, color: { argb: HEADER_FG }, size: 10 };
    cell.alignment = { horizontal: 'center' };
  });
  headerRow.height = 24;
  lookupSheet.views = [{ state: 'frozen', ySplit: 1 }];

  // ── Data rows ────────────────────────────────────────────────
  const rangeMap: Partial<Record<keyof typeof LOOKUP, string>> = {};

  lookupCols.forEach((lc, colIdx) => {
    const values = LOOKUP[lc.lookupKey] as readonly string[];
    const letter = colLetter(colIdx + 1);

    values.forEach((val, rowIdx) => {
      const cell = lookupSheet.getCell(`${letter}${rowIdx + 2}`);
      cell.value = val;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LOOKUP_BG } };
      cell.font = { size: 10 };
    });

    // Record the Excel range for this lookup list (e.g. "LookupData!$A$2:$A$16")
    rangeMap[lc.lookupKey] = `LookupData!$${letter}$2:$${letter}$${values.length + 1}`;
  });

  return rangeMap as Record<keyof typeof LOOKUP, string>;
};

// ─── Apply data validation to a range of cells ───────────────
const applyDropdown = (
  ws: ExcelJS.Worksheet,
  colLtr: string,
  rangeFormula: string,
  headerText: string
) => {
  for (let row = 2; row <= DATA_ROWS; row++) {
    ws.getCell(`${colLtr}${row}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [rangeFormula],
      showErrorMessage: true,
      errorStyle: 'stop',
      errorTitle: 'Invalid value',
      error: `Please select a valid ${headerText} from the dropdown list.`,
      showInputMessage: true,
      promptTitle: headerText,
      prompt: `Select from the list`,
    };
  }
};

// ─── Build a generic entity sheet ────────────────────────────
const buildEntitySheet = (
  workbook: ExcelJS.Workbook,
  sheetName: string,
  columns: ColumnDef[],
  sampleRows: (string | number)[][],
  rangeMap: Record<string, string>
) => {
  const ws = workbook.addWorksheet(sheetName);

  // Freeze header + add auto filter
  ws.views = [{ state: 'frozen', ySplit: 1 }];
  ws.autoFilter = { from: 'A1', to: `${colLetter(columns.length)}1` };

  // ── Set column widths ────────────────────────────────────────
  columns.forEach((col, i) => {
    ws.getColumn(i + 1).width = Math.max(col.header.length + 4, 20);
  });

  // ── Header row ───────────────────────────────────────────────
  const headerRow = ws.getRow(1);
  headerRow.height = 30;
  columns.forEach((col, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = col.header;
    styleHeader(cell, col.required);
  });

  // ── Sample data rows ─────────────────────────────────────────
  sampleRows.forEach((rowData, ri) => {
    const exRow = ws.getRow(ri + 2);
    exRow.height = 20;
    rowData.forEach((val, ci) => {
      const cell = exRow.getCell(ci + 1);
      cell.value = val;
      styleDataCell(cell, columns[ci]?.required ?? false);
    });
  });

  // ── Dropdowns for all data rows ──────────────────────────────
  columns.forEach((col, i) => {
    if (!col.lookupKey) return;
    const range = rangeMap[col.lookupKey];
    if (!range) return;
    applyDropdown(ws, colLetter(i + 1), range, col.header.replace('*', '').trim());
  });

  return ws;
};

// ─── Sample row factories ─────────────────────────────────────

// ── Content samples ───────────────────────────────────────────
// Columns (POS): TempID, Name, Desc, PrimaryCategory, Subject, Domain, SubDomain,
//   Medium, GradeLevel, TargetAgeGroup, PrimaryUser, ContentLanguage, Program,
//   Keywords, License, Copyright, CopyrightYear, Author, DriveURL, FileType

// NOTE: Medium and Grade Level columns REMOVED — pos-framework has no such taxonomy.
// Sending them causes API error: "medium/gradeLevel range data is empty from the given framework."
// Content columns: TempID, Name, Desc, PrimaryCategory, Subject, Domain, SubDomain,
//   TargetAgeGroup, PrimaryUser, ContentLanguage, Program,
//   Keywords, License, Copyright, CopyrightYear, Author, DriveURL, FileType

const getPosContentSample = (): (string | number)[][] => [[
  'TEMP_CONTENT_1',
  'Introduction to Mathematics',
  'Basic math concepts for Grade 5 students',
  'Learning Resource',
  'Math',                   // Subject
  'Learning for School',    // Domain
  'Academics',              // Sub Domain
  '8-11 yrs',               // Target Age Group
  'Learners/Children',      // Primary User
  'English',                // Content Language
  'Elementary',             // Program
  'math, arithmetic',       // Keywords
  'CC BY 4.0',              // License
  'Pratham',                // Copyright
  '2024',                   // Copyright Year
  'Pratham Team',           // Author
  'Pratham Team',           // Creator
  'https://drive.google.com/file/d/SAMPLE_FILE_ID/view?usp=sharing', // Google Drive URL
  'pdf',                    // File Type
]];

// SCP content also uses POS columns (content always uses pos-framework for all users)
const getScpContentSample = (): (string | number)[][] => [[
  'TEMP_CONTENT_1',
  'Science Study Material',
  'Study material for Science',
  'Learning Resource',
  'Science',                // Subject
  'Learning for School',    // Domain
  'Academics',              // Sub Domain
  '14-18 yrs',              // Target Age Group
  'Learners/Children',      // Primary User
  'Hindi',                  // Content Language
  'Second Chance',          // Program
  'science',                // Keywords
  'CC BY 4.0',              // License
  'Pratham',                // Copyright
  '2024',                   // Copyright Year
  'Pratham Team',           // Author
  'Pratham Team',           // Creator
  'https://drive.google.com/file/d/SAMPLE_FILE_ID/view?usp=sharing', // Google Drive URL
  'pdf',                    // File Type
]];

// ── QuestionSet samples ───────────────────────────────────────
// POS QS columns: TempID, Name, Desc, PrimaryCategory, Subject, Domain, SubDomain,
//   Medium, GradeLevel, Language, Program, AssessmentType, EvaluationType,
//   MaxAttempts, ShowFeedback, ShowSolutions
// AssessmentType allowed values: Pre Test | Post Test | Other | Unit Test | Mock Test | Eligibility Test

// POS QS columns (16): TempID, Name, Desc*, PrimaryCategory*,
//   Domain*, SubDomain*, Subject*,
//   TargetAgeGroup, PrimaryUser, ContentLanguage, Program,
//   AssessmentType, EvaluationType*, MaxAttempts, ShowFeedback, ShowSolutions
const getPosQsSample = (): (string | number)[][] => [
  [
    'TEMP_QS_1',
    'Mathematics Pre-Test',
    'Baseline assessment for Mathematics',     // Description* (required)
    'Practice Question Set',                   // Primary Category*
    'Learning for School',                     // Domain*
    'Academics',                               // Sub Domain*
    'Math',                                    // Subject*
    '8-11 yrs',                                // Target Age Group
    'Learners/Children',                       // Primary User
    'English',                                 // Content Language
    'Elementary',                              // Program
    'Pre Test',                                // Assessment Type
    'online',                                  // Evaluation Type*
    3,                                         // Max Attempts
    'true',                                    // Show Feedback
    'false',                                   // Show Solutions
  ],
  [
    'TEMP_QS_2',
    'Mathematics Post-Test',
    'End-of-unit assessment for Mathematics',  // Description*
    'Practice Question Set',
    'Learning for School',
    'Academics',
    'Math',
    '8-11 yrs',
    'Learners/Children',
    'English',
    'Elementary',
    'Post Test',
    'online',
    2,
    'true',
    'true',
  ],
];

// SCP QS columns: TempID, Name, Desc, PrimaryCategory, Subject, Board, Medium,
//   GradeLevel, CourseType, Program, Language, AssessmentType, EvaluationType,
//   MaxAttempts, ShowFeedback, ShowSolutions
// AssessmentType allowed values: Pre Test | Post Test | Other | Unit Test | Mock Test | Eligibility Test

const getScpQsSample = (): (string | number)[][] => [
  [
    'TEMP_QS_1',
    'Science Pre-Test — Grade 10',
    'Baseline assessment for Grade 10 Science',
    'Practice Question Set',
    'Science',
    'Maharashtra State Education Board',
    'Marathi',
    'Grade 10',
    'Main Course',
    'Second Chance',
    'Hindi',
    'Pre Test',            // allowed: Pre Test | Post Test | Other | Unit Test | Mock Test | Eligibility Test
    'online',
    3,
    'true',
    'false',
  ],
  [
    'TEMP_QS_2',
    'Science Unit Test — Grade 10',
    'Unit-level test for Grade 10 Science',
    'Practice Question Set',
    'Science',
    'Maharashtra State Education Board',
    'Marathi',
    'Grade 10',
    'Main Course',
    'Second Chance',
    'Hindi',
    'Unit Test',
    'online',
    2,
    'true',
    'true',
  ],
];

// ── Course samples ────────────────────────────────────────────
// POS Course columns: TempID, Name, Desc, Subject, Domain, SubDomain,
//   Medium, GradeLevel, TargetAgeGroup, Language, Program,
//   Keywords, License, Copyright, CopyrightYear, Author

// POS Course columns (15): TempID, Name, Desc,
//   Domain*(targetDomainIds), SubDomain*(targetSubDomainIds), Subject*(targetSubjectIds),
//   TargetAgeGroup*, PrimaryUser, ContentLanguage, Program*,
//   Keywords, License, Copyright, CopyrightYear, Author
const getPosCoursesSample = (): (string | number)[][] => [[
  'TEMP_COURSE_1',
  'Math Fundamentals',
  'Introductory mathematics course',
  'Learning for School',    // Domain* (→ targetDomainIds identifier)
  'Academics',              // Sub Domain* (→ targetSubDomainIds identifier)
  'Math',                   // Subject* (→ targetSubjectIds identifier)
  '8-11 yrs',               // Target Age Group*
  'Learners/Children',      // Primary User
  'English',                // Content Language
  'Elementary',             // Program*
  'math, grade 5',          // Keywords
  'CC BY 4.0',              // License
  'Pratham',                // Copyright
  '2024',                   // Copyright Year
  'Pratham Team',           // Author
]];

// SCP Course columns: TempID, Name, Desc, Subject, Board, Medium,
//   GradeLevel, CourseType, Program, Language,
//   Keywords, License, Copyright, CopyrightYear, Author

const getScpCoursesSample = (): (string | number)[][] => [[
  'TEMP_COURSE_1',
  'Grade 10 Science Course',
  'Complete Science course',
  'Science',                           // must match SCP_SUBJECTS exactly
  'Maharashtra State Education Board',  // must match SCP_BOARDS exactly
  'Marathi',                           // must match SCP_MEDIUMS exactly
  'Grade 10',                          // only grade in SCP framework
  'Main Course',                       // must match SCP_COURSE_TYPES exactly
  'Second Chance',
  'Hindi',
  'science, scp',
  'CC BY 4.0',
  'Pratham',
  '2024',
  'Pratham Team',
]];

// ── Questions sample ──────────────────────────────────────────
// Columns: QuestionSetTempID, SectionName, QuestionType, QuestionText,
//   Options, CorrectAnswer, MaxScore, Hint, Solution
// NOTE: Blooms Level and Difficulty removed — platform API rejects them.
//
// MCQ      Options: pipe-separated choices (A|B|C|D)
//          CorrectAnswer: exact text of the correct option
// Match    Options: Key:Value pairs separated by | e.g. Dog:Bark|Cat:Meow
//          CorrectAnswer: same Key:Value pairs in correct order
// Arrange  Options: items in any order, pipe-separated
//          CorrectAnswer: items in the correct sequence, pipe-separated
// Subjective  Options & CorrectAnswer: leave blank

const getQuestionsample = (): (string | number)[][] => [
  // ── MCQ questions ──────────────────────────────────────────────
  [
    'TEMP_QS_1',
    'Section 1: Basic Concepts',
    'MCQ',
    'Which planet in our solar system is known as the Red Planet?',
    'Venus|Mars|Jupiter|Saturn',
    'Mars',
    1,
    'Think about the colour of the planet surface',
    'Mars appears red due to iron oxide (rust) on its surface',
  ],
  [
    'TEMP_QS_1',
    'Section 1: Basic Concepts',
    'MCQ',
    'What is the chemical symbol for water?',
    'HO|H2O|CO2|NaCl',
    'H2O',
    1,
    'Water is made of Hydrogen and Oxygen',
    'Water (H2O) has 2 Hydrogen atoms and 1 Oxygen atom',
  ],
  [
    'TEMP_QS_1',
    'Section 1: Basic Concepts',
    'MCQ',
    'Which of the following is a prime number?',
    '4|6|7|9',
    '7',
    1,
    'A prime number has exactly two factors: 1 and itself',
    '7 is divisible only by 1 and 7, so it is prime',
  ],
  // ── Match question ─────────────────────────────────────────────
  [
    'TEMP_QS_1',
    'Section 2: Match the Following',
    'Match',
    'Match each animal with the sound it makes:',
    'Dog:Bark|Cat:Meow|Cow:Moo|Lion:Roar',
    'Dog:Bark|Cat:Meow|Cow:Moo|Lion:Roar',
    2,
    'Think about common animals you see or hear',
    'Dog → Bark, Cat → Meow, Cow → Moo, Lion → Roar',
  ],
  // ── Arrange question ───────────────────────────────────────────
  [
    'TEMP_QS_1',
    'Section 3: Arrange in Order',
    'Arrange',
    'Arrange the following stages of the water cycle in the correct order:',
    'Precipitation|Condensation|Evaporation|Collection',
    'Evaporation|Condensation|Precipitation|Collection',
    2,
    'Water starts its journey from the surface of the Earth',
    'Correct order: Evaporation → Condensation → Precipitation → Collection',
  ],
  // ── Subjective question ────────────────────────────────────────
  [
    'TEMP_QS_1',
    'Section 4: Short Answer',
    'Subjective',
    'In your own words, explain why trees are important for the environment.',
    '',
    '',
    3,
    'Think about what trees provide to humans, animals and the atmosphere',
    'Trees provide oxygen, absorb carbon dioxide, prevent soil erosion, provide habitat for animals and help regulate climate',
  ],
];

const getCourseMappingsSample = (): (string | number)[][] => [
  ['TEMP_COURSE_1', 'Unit 1: Introduction',  'TEMP_CONTENT_1', 'content',     1],
  ['TEMP_COURSE_1', 'Unit 1: Introduction',  'TEMP_QS_1',      'questionset', 2],
  ['TEMP_COURSE_1', 'Unit 2: Assessment',    'TEMP_QS_2',      'questionset', 1],
];

const getExistingMappingsSample = (): (string | number)[][] => [
  ['TEMP_EXISTING_1', 'do_abc1234567890', 'content'],
];

// ─── Instructions sheet ───────────────────────────────────────

const buildInstructionsSheet = (workbook: ExcelJS.Workbook, fw: FrameworkId) => {
  const ws = workbook.addWorksheet('Instructions');
  ws.getColumn(1).width = 30;
  ws.getColumn(2).width = 80;

  const title = ws.getCell('A1');
  title.value = `Bulk Import Template — ${fw === 'scp-framework' ? 'SCP Framework' : 'POS Framework'}`;
  title.font = { bold: true, size: 14, color: { argb: HEADER_BG } };
  ws.mergeCells('A1:B1');
  ws.getRow(1).height = 28;

  const rows = [
    ['', ''],
    ['SHEETS OVERVIEW', ''],
    ['Content',               'Create content (PDF/ZIP/MP4/H5P). Provide Google Drive public share URL.'],
    ['QuestionSets',          'Create question set containers with metadata.'],
    ['Questions',             'Add MCQ / Arrange / Match / Subjective questions linked to a QuestionSet.'],
    ['Courses',               'Create course containers.'],
    ['CourseChildrenMapping', 'Map content and question sets into course units.'],
    ['ExistingContentMapping','Reference existing platform items (do_xxx) using a Temp ID.'],
    ['LookupData',            'Reference sheet — all valid dropdown values. Do NOT edit this sheet.'],
    ['', ''],
    ['TEMP ID FORMAT', ''],
    ['Content',         'TEMP_CONTENT_1, TEMP_CONTENT_2, ...'],
    ['QuestionSet',     'TEMP_QS_1, TEMP_QS_2, ...'],
    ['Course',          'TEMP_COURSE_1, TEMP_COURSE_2, ...'],
    ['Existing (ref)',  'TEMP_EXISTING_1, TEMP_EXISTING_2, ...'],
    ['', ''],
    ['GOOGLE DRIVE URLS', ''],
    ['Format',          'https://drive.google.com/file/d/FILE_ID/view?usp=sharing'],
    ['Requirement',     'File must be shared as "Anyone with the link can view"'],
    ['', ''],
    ['COLUMN COLOURS', ''],
    ['Amber background', 'Required fields — must be filled'],
    ['White background', 'Optional fields'],
    ['', ''],
    ['FRAMEWORK', fw === 'scp-framework' ? 'SCP Framework (Board, Medium, Grade, Subject, CourseType, Program)' : 'POS Framework (Domain, SubDomain, Subject, Medium, Grade, TargetAge, Program)'],
  ];

  rows.forEach((row, i) => {
    const exRow = ws.getRow(i + 2);
    const c1 = exRow.getCell(1);
    const c2 = exRow.getCell(2);
    c1.value = row[0];
    c2.value = row[1];
    if (row[0] && !row[1]) {
      // section header
      c1.font = { bold: true, color: { argb: HEADER_BG } };
    }
    exRow.height = 18;
  });
};

// ─── Disable Next.js response body-size limit (Excel files can be large) ─────
export const config = {
  api: {
    responseLimit: false,
  },
};

// ─── Main handler ─────────────────────────────────────────────

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const fw: FrameworkId =
      req.query.framework === 'scp-framework' ? 'scp-framework' : 'pos-framework';

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Pratham Bulk Import';
    workbook.created = new Date();

    // ── 1. Build LookupData sheet FIRST (needed for range references)
    const rangeMap = buildLookupSheet(workbook, fw);

    // ── 2. Instructions sheet
    buildInstructionsSheet(workbook, fw);

    // ── 3. Get framework-specific column definitions
    const cols = getFrameworkColumns(fw);

    // ── 4. Content sheet
    buildEntitySheet(
      workbook, 'Content', cols.contentColumns,
      fw === 'scp-framework' ? getScpContentSample() : getPosContentSample(),
      rangeMap
    );

    // ── 5. QuestionSets sheet
    buildEntitySheet(
      workbook, 'QuestionSets', cols.qsColumns,
      fw === 'scp-framework' ? getScpQsSample() : getPosQsSample(),
      rangeMap
    );

    // ── 6. Questions sheet
    buildEntitySheet(
      workbook, 'Questions', cols.questionColumns,
      getQuestionsample(),
      rangeMap
    );

    // ── 7. Courses sheet
    buildEntitySheet(
      workbook, 'Courses', cols.courseColumns,
      fw === 'scp-framework' ? getScpCoursesSample() : getPosCoursesSample(),
      rangeMap
    );

    // ── 8. CourseChildrenMapping sheet
    buildEntitySheet(
      workbook, 'CourseChildrenMapping', cols.mappingColumns,
      getCourseMappingsSample(),
      rangeMap
    );

    // ── 9. ExistingContentMapping sheet
    buildEntitySheet(
      workbook, 'ExistingContentMapping', cols.existingColumns,
      getExistingMappingsSample(),
      rangeMap
    );

    // ── Reorder sheets: Instructions first ──────────────────────
    const desiredOrder = [
      'Instructions',
      'Content',
      'QuestionSets',
      'Questions',
      'Courses',
      'CourseChildrenMapping',
      'ExistingContentMapping',
      'LookupData',
    ];
    workbook.worksheets.sort((a, b) =>
      desiredOrder.indexOf(a.name) - desiredOrder.indexOf(b.name)
    );

    // ── Serialize to buffer then send ────────────────────────────
    // writeBuffer() is safer than write(res) with Next.js response objects.
    const buffer = await workbook.xlsx.writeBuffer();

    const fwLabel = fw === 'scp-framework' ? 'SCP' : 'POS';
    const fileName = `Bulk_Import_Template_${fwLabel}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', buffer.byteLength);
    // Prevent browser from caching the template — always serve a fresh copy
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.status(200).send(Buffer.from(buffer));
  } catch (err: any) {
    console.error('[bulk-import/template] Error generating template:', err);
    res.status(500).json({ error: 'Failed to generate template', details: err?.message });
  }
}
