// ============================================================
// API ROUTE: /api/bulk-import/template
// Pratham 2.0 — Workspace MFE
//
// Generates a framework-aware Excel import template using exceljs.
// • Accepts ?framework=pos-framework | scp-framework
// • Different metadata columns per framework
// • All option columns have real Excel dropdown validations
//   (data validation referencing LookupData sheet ranges)
// • Outputs plain .xlsx — multi-select columns use comma-separated values
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
  fw: FrameworkId,
  templateType: 'all' | 'content' | 'questionset' = 'all'
): Record<keyof typeof LOOKUP, string> => {
  const lookupSheet = workbook.addWorksheet('LookupData');
  const lookupCols = getLookupColumns(fw, templateType);

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
// isMultiSelect = true → errorStyle 'warning' so user can still type pipe-separated values
const applyDropdown = (
  ws: ExcelJS.Worksheet,
  colLtr: string,
  rangeFormula: string,
  headerText: string,
  isMultiSelect = false,
  sampleValues: string[] = []
) => {
  const exampleComma = sampleValues.slice(0, 2).join(',');

  for (let row = 2; row <= DATA_ROWS; row++) {
    ws.getCell(`${colLtr}${row}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [rangeFormula],
      showErrorMessage: isMultiSelect, // hide stop-error for multi-select; show warning only
      errorStyle: isMultiSelect ? 'warning' : 'stop',
      errorTitle: isMultiSelect ? 'Multiple values allowed' : 'Invalid value',
      error: isMultiSelect
        ? `Use comma "," to separate multiple values. E.g.: ${exampleComma || 'Value1,Value2'}`
        : `Please select a valid ${headerText} from the dropdown list.`,
      showInputMessage: true,
      promptTitle: isMultiSelect ? `${headerText} — Multi-select` : headerText,
      prompt: isMultiSelect
        ? `Select one value from the dropdown, OR type multiple values separated by comma.\nExample: ${exampleComma || 'Value1,Value2'}`
        : `Select one value from the dropdown list`,
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
    // Pull sample values from LOOKUP for the input-message example
    const sampleVals: string[] = col.lookupKey ? (LOOKUP[col.lookupKey] as readonly string[]).slice(0, 3) as string[] : [];
    applyDropdown(
      ws, colLetter(i + 1), range,
      col.header.replace('*', '').trim(),
      col.multiSelect === true,
      sampleVals
    );
  });

  return ws;
};

// ─── Sample row factories ─────────────────────────────────────

// ── Content samples ───────────────────────────────────────────
// Columns (POS): TempID, Name, Desc, PrimaryCategory, Subject, Domain, SubDomain,
//   Medium, GradeLevel, TargetAgeGroup, PrimaryUser, ContentLanguage, Program,
//   Keywords, License, Copyright, CopyrightYear, Author, DriveURL, FileType

// POS Content columns (17): TempID, Name, Desc, PrimaryCategory, AppIconDriveURL,
//   Domain*(single), SubDomain*(multi|), Subject*(multi|), TargetAgeGroup(multi|),
//   PrimaryUser(multi|), ContentLanguage*(single), Program*(multi|),
//   Keywords, Author, Creator, File/ContentURL*, FileType*

const getPosContentSample = (): (string | number)[][] => [[
  'TEMP_CONTENT_1',
  'Introduction to Mathematics',
  'Introduction to Mathematics',  // English Name (optional)
  'Basic math concepts for students',
  'Learning Resource',
  'https://drive.google.com/file/d/SAMPLE_ICON_ID/view?usp=sharing', // App Icon Drive URL
  'Learning for School',    // Domain* (single)
  'Academics',              // Sub Domain* (pipe-sep for multi: Academics|Sports)
  'Math',                   // Subject* (pipe-sep for multi: Math|Science)
  '8-11 yrs',               // Target Age Group
  'Learners/Children',      // Primary User
  'English',                // Content Language* (single)
  'Elementary',             // Program* (pipe-sep for multi)
  'math, arithmetic',       // Keywords
  'Pratham Team',           // Author
  'Pratham Team',           // Creator
  'https://drive.google.com/file/d/SAMPLE_FILE_ID/view?usp=sharing', // File/Content URL*
  'pdf',                    // File Type*
]];

// SCP content also uses POS columns (content always uses pos-framework for all users)
const getScpContentSample = (): (string | number)[][] => [[
  'TEMP_CONTENT_1',
  'Science Study Material',
  'Science Study Material',       // English Name (optional)
  'Study material for Science',
  'Learning Resource',
  'https://drive.google.com/file/d/SAMPLE_ICON_ID/view?usp=sharing', // App Icon Drive URL
  'Learning for School',    // Domain* (single)
  'Academics',              // Sub Domain*
  'Science',                // Subject*
  '14-18 yrs',              // Target Age Group
  'Learners/Children',      // Primary User
  'Hindi',                  // Content Language* (single)
  'Second Chance',          // Program*
  'science',                // Keywords
  'Pratham Team',           // Author
  'Pratham Team',           // Creator
  'https://drive.google.com/file/d/SAMPLE_FILE_ID/view?usp=sharing', // File/Content URL*
  'pdf',                    // File Type*
]];

// ── QuestionSet samples ───────────────────────────────────────
// POS QS columns: TempID, Name, Desc, PrimaryCategory, Subject, Domain, SubDomain,
//   Medium, GradeLevel, Language, Program, AssessmentType, EvaluationType,
//   MaxAttempts, ShowFeedback, ShowSolutions
// AssessmentType allowed values: Pre Test | Post Test | Other | Unit Test | Mock Test | Eligibility Test

// POS QS columns (16): TempID, Name, Desc*, PrimaryCategory*, AppIconDriveURL,
//   Program(multi|), Domain*(single), SubDomain*(multi|), Subject*(multi|),
//   TargetAgeGroup(multi|), PrimaryUser(multi|), ContentLanguage(single),
//   AssessmentType, EvaluationType*, ShowFeedback, ShowSolutions
const getPosQsSample = (): (string | number)[][] => [
  [
    'TEMP_QS_1',
    'Mathematics Pre-Test',
    'Mathematics Pre-Test',         // English Name (optional)
    'Baseline assessment for Mathematics',
    'Practice Question Set',
    'https://drive.google.com/file/d/SAMPLE_ICON_ID/view?usp=sharing', // App Icon Drive URL
    'Elementary',             // Program
    'Learning for School',    // Domain* (single)
    'Academics',              // Sub Domain*
    'Math',                   // Subject*
    '8-11 yrs',               // Target Age Group
    'Learners/Children',      // Primary User
    'English',                // Content Language
    'Pre Test',               // Assessment Type
    'Auto-Graded',                 // Evaluation Type*
    'true',                   // Show Feedback
    'false',                  // Show Solutions
  ],
  [
    'TEMP_QS_2',
    'Mathematics Post-Test',
    'Mathematics Post-Test',        // English Name (optional)
    'End-of-unit assessment for Mathematics',
    'Practice Question Set',
    'https://drive.google.com/file/d/SAMPLE_ICON_ID/view?usp=sharing',
    'Elementary',
    'Learning for School',
    'Academics',
    'Math',
    '8-11 yrs',
    'Learners/Children',
    'English',
    'Post Test',
    'Auto-Graded',
    'true',
    'true',
  ],
];

// SCP QS columns (15): TempID, Name, Desc*, PrimaryCategory*,
//   Program(multi|), Board*(single), Medium*(multi|), GradeLevel*(multi|),
//   Subject*(multi|), CourseType*(multi|), ContentLanguage(single),
//   AssessmentType, EvaluationType*, ShowFeedback, ShowSolutions
const getScpQsSample = (): (string | number)[][] => [
  [
    'TEMP_QS_1',
    'Science Pre-Test — Grade 10',
    'Science Pre-Test — Grade 10',  // English Name (optional)
    'Baseline assessment for Grade 10 Science',
    'Practice Question Set',
    'Second Chance',                       // Program
    'Maharashtra State Education Board',   // Board* (single)
    'Marathi',                             // Medium* (pipe-sep for multi)
    'Grade 10',                            // Grade Level* (pipe-sep for multi)
    'Science',                             // Subject* (pipe-sep for multi)
    'Main Course',                         // Course Type* (pipe-sep for multi)
    'Hindi',                               // Content Language
    'Pre Test',                            // Assessment Type
    'Auto-Graded',                              // Evaluation Type*
    'true',                                // Show Feedback
    'false',                               // Show Solutions
  ],
  [
    'TEMP_QS_2',
    'Science Unit Test — Grade 10',
    'Science Unit Test — Grade 10', // English Name (optional)
    'Unit-level test for Grade 10 Science',
    'Practice Question Set',
    'Second Chance',
    'Maharashtra State Education Board',
    'Marathi',
    'Grade 10',
    'Science',
    'Main Course',
    'Hindi',
    'Unit Test',
    'Auto-Graded',
    'true',
    'true',
  ],
];

// ── Course samples ────────────────────────────────────────────
// POS Course columns: TempID, Name, Desc, Subject, Domain, SubDomain,
//   Medium, GradeLevel, TargetAgeGroup, Language, Program,
//   Keywords, License, Copyright, CopyrightYear, Author

// POS Course columns (13): TempID, Name, Desc, AppIconDriveURL*,
//   Keywords, Program*(multi|), Domain*(single→targetDomainIds),
//   SubDomain*(multi|→targetSubDomainIds), Subject*(multi|→targetSubjectIds),
//   TargetAgeGroup*(multi|), PrimaryUser(multi|), ContentLanguage(single), Author
const getPosCoursesSample = (): (string | number)[][] => [[
  'TEMP_COURSE_1',
  'Math Fundamentals',
  'Math Fundamentals',            // English Name (optional)
  'Introductory mathematics course',
  'https://drive.google.com/file/d/SAMPLE_ICON_ID/view?usp=sharing', // App Icon Drive URL*
  'math, grade 5',          // Keywords
  'Elementary',             // Program*
  'Learning for School',    // Domain* (single → targetDomainIds identifier)
  'Academics',              // Sub Domain* (pipe-sep for multi → targetSubDomainIds)
  'Math',                   // Subject* (pipe-sep for multi → targetSubjectIds)
  '8-11 yrs',               // Target Age Group* (pipe-sep for multi)
  'Learners/Children',      // Primary User
  'English',                // Content Language
  'Pratham Team',           // Author
]];

// SCP Course columns (13): TempID, Name, Desc, AppIconDriveURL*,
//   Keywords, Program*, Board*(single→targetBoardIds),
//   Medium*(multi|→targetMediumIds), GradeLevel*(multi|→targetGradeLevelIds),
//   Subject*(multi|→targetSubjectIds), CourseType*(multi|→targetCourseTypeIds),
//   ContentLanguage(single), Author
const getScpCoursesSample = (): (string | number)[][] => [[
  'TEMP_COURSE_1',
  'Grade 10 Science Course',
  'Grade 10 Science Course',      // English Name (optional)
  'Complete Science course for Grade 10',
  'https://drive.google.com/file/d/SAMPLE_ICON_ID/view?usp=sharing', // App Icon Drive URL*
  'science, grade 10',      // Keywords
  'Second Chance',          // Program*
  'Maharashtra State Education Board', // Board* (single → targetBoardIds identifier)
  'Marathi',                // Medium* (pipe-sep for multi → targetMediumIds)
  'Grade 10',               // Grade Level* (pipe-sep for multi → targetGradeLevelIds)
  'Science',                // Subject* (pipe-sep for multi → targetSubjectIds)
  'Main Course',            // Course Type* (pipe-sep for multi → targetCourseTypeIds)
  'Hindi',                  // Content Language
  'Pratham Team',           // Author
]];

// ── Questions sample ──────────────────────────────────────────
// Columns: QuestionSetTempID, SectionName, SectionDescription, SectionInstructions,
//   QuestionType, Visibility, QuestionText,
//   Options, CorrectAnswer, MaxScore, Hint, Solution
// NOTE: Blooms Level and Difficulty removed — platform API rejects them.
//
// Visibility: Parent = question belongs to this QS only (not independently searchable)
//             Public = question is publicly accessible / independently discoverable
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
    'Questions testing basic science and math concepts', // Section Description
    'Answer each question carefully. Select the best option.',  // Section Instructions
    'MCQ',
    'Parent',   // Visibility — Parent: belongs to this QS only
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
    '',   // Section Description (blank — only fill for the first question in a section)
    '',   // Section Instructions (blank — only fill for the first question in a section)
    'MCQ',
    'Parent',
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
    '',
    '',
    'MCQ',
    'Parent',
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
    'Match each item on the left with the correct item on the right', // Section Description
    'Draw a line from each word to its correct match.',               // Section Instructions
    'Match',
    'Parent',
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
    'Put the items in the correct sequence', // Section Description
    'Drag the items into the correct order.', // Section Instructions
    'Arrange',
    'Parent',
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
    'Write your own answer in complete sentences', // Section Description
    'Think carefully and write 2-3 sentences.',    // Section Instructions
    'Subjective',
    'Parent',
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

// ExistingContentMapping columns (6): TempID, ExistingIdentifier, EntityType,
//   CourseTempID (optional), UnitName (optional), Sequence (optional)
// Fill Course Temp ID + Unit Name + Sequence to add directly to a course unit.
// Leave Course Temp ID blank if only using as a reference.
const getExistingMappingsSample = (): (string | number)[][] => [
  // Add existing content directly to a course unit (no CourseChildrenMapping needed)
  ['TEMP_EXISTING_1', 'do_abc1234567890', 'content',     'TEMP_COURSE_1', 'Unit 1: Introduction', 3],
  // Reference only — used in CourseChildrenMapping or as a QS reference
  ['TEMP_EXISTING_2', 'do_xyz0987654321', 'questionset', '', '', ''],
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



// ─── Template type ─────────────────────────────────────────────
// ?type=all       → all 8 sheets (default)
// ?type=content   → Instructions + Content + LookupData
// ?type=questionset → Instructions + QuestionSets + Questions + LookupData

type TemplateType = 'all' | 'content' | 'questionset';

const resolveTemplateType = (raw: unknown): TemplateType => {
  if (raw === 'content') return 'content';
  if (raw === 'questionset') return 'questionset';
  return 'all';
};

// ─── Main handler ─────────────────────────────────────────────

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const fw: FrameworkId =
      req.query.framework === 'scp-framework' ? 'scp-framework' : 'pos-framework';

    const templateType = resolveTemplateType(req.query.type);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Pratham Bulk Import';
    workbook.created = new Date();

    // ── 1. Build LookupData sheet FIRST (needed for range references)
    const rangeMap = buildLookupSheet(workbook, fw, templateType);

    // ── 2. Instructions sheet
    buildInstructionsSheet(workbook, fw);

    // ── 3. Get framework-specific column definitions
    const cols = getFrameworkColumns(fw);

    // ── 4–9. Conditionally add sheets based on templateType ────────
    if (templateType === 'all' || templateType === 'content') {
      buildEntitySheet(
        workbook, 'Content', cols.contentColumns,
        fw === 'scp-framework' ? getScpContentSample() : getPosContentSample(),
        rangeMap
      );
    }

    if (templateType === 'all' || templateType === 'questionset') {
      buildEntitySheet(
        workbook, 'QuestionSets', cols.qsColumns,
        fw === 'scp-framework' ? getScpQsSample() : getPosQsSample(),
        rangeMap
      );
      buildEntitySheet(
        workbook, 'Questions', cols.questionColumns,
        getQuestionsample(),
        rangeMap
      );
    }

    if (templateType === 'all') {
      buildEntitySheet(
        workbook, 'Courses', cols.courseColumns,
        fw === 'scp-framework' ? getScpCoursesSample() : getPosCoursesSample(),
        rangeMap
      );
      buildEntitySheet(
        workbook, 'CourseChildrenMapping', cols.mappingColumns,
        getCourseMappingsSample(),
        rangeMap
      );
      buildEntitySheet(
        workbook, 'ExistingContentMapping', cols.existingColumns,
        getExistingMappingsSample(),
        rangeMap
      );
    }

    // ── Reorder sheets: Instructions first, _MSConfig last ─────────
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

    // ── 11. Write xlsx buffer ──────────────────────────────────────
    const buffer = Buffer.from(await workbook.xlsx.writeBuffer());

    const fwLabel = fw === 'scp-framework' ? 'SCP' : 'POS';
    const typeSuffix = templateType === 'content' ? '_Content' : templateType === 'questionset' ? '_QuestionSet' : '';
    const fileName = `Bulk_Import_Template_${fwLabel}${typeSuffix}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', buffer.byteLength);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.status(200).send(buffer);
  } catch (err: any) {
    console.error('[bulk-import/template] Error generating template:', err);
    res.status(500).json({ error: 'Failed to generate template', details: err?.message });
  }
}
