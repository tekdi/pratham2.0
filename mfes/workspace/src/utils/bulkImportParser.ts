// ============================================================
// BULK IMPORT — EXCEL PARSER
// Pratham 2.0 — Workspace MFE
//
// Parses uploaded .xlsx into typed ParsedImportData.
// Uses frameworkConfig to resolve column headers dynamically
// so both POS and SCP templates parse correctly.
// ============================================================

import * as XLSX from 'xlsx';
import {
  ParsedImportData,
  ContentRow,
  QuestionSetRow,
  QuestionRow,
  CourseRow,
  CourseChildMappingRow,
  ExistingContentMappingRow,
  FrameworkId,
  QuestionType,
} from '../types/bulkImport.types';
import {
  getFrameworkColumns,
  buildHeaderToApiFieldMap,
  ColumnDef,
} from './frameworkConfig';

// ─── Sheet Names ──────────────────────────────────────────────
export const SHEET_NAMES = {
  CONTENT:          'Content',
  QUESTION_SETS:    'QuestionSets',
  QUESTIONS:        'Questions',
  COURSES:          'Courses',
  COURSE_CHILDREN:  'CourseChildrenMapping',
  EXISTING_MAPPING: 'ExistingContentMapping',
  LOOKUP:           'LookupData',
} as const;

// ─── Detect framework from the uploaded workbook ──────────────
// We try to infer from the LookupData sheet (has "Boards" col → SCP,
// has "Domains" col → POS). Falls back to localStorage.

const detectFrameworkFromWorkbook = (
  workbook: XLSX.WorkBook
): FrameworkId => {
  const lookupSheet = workbook.Sheets[SHEET_NAMES.LOOKUP];
  if (lookupSheet) {
    const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(lookupSheet, {
      header: 1,
      defval: '',
    });
    if (rows.length > 0) {
      const headers: string[] = (rows[0] as string[]).map((h) => String(h || '').toLowerCase());
      if (headers.some((h) => h.includes('board'))) return 'scp-framework';
      if (headers.some((h) => h.includes('domain'))) return 'pos-framework';
    }
  }
  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    return localStorage.getItem('collectionFramework') === 'scp-framework'
      ? 'scp-framework'
      : 'pos-framework';
  }
  return 'pos-framework';
};

// ─── Generic Row Parser ───────────────────────────────────────

function parseSheet<T>(
  worksheet: XLSX.WorkSheet | undefined,
  headerToApiField: Record<string, string>,
  rowTransform?: (raw: Record<string, any>, row: Partial<T>) => T
): T[] {
  if (!worksheet) return [];

  // Read all rows as raw arrays so we can auto-detect where the header row is.
  // This handles both template variants:
  //   API template  → row 1 = headers,  row 2 = sample, row 3+ = data
  //   Static template → row 1 = hints, row 2 = headers, row 3 = sample, row 4+ = data
  const allArrayRows: any[][] = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: '',
    raw: false,
  });

  if (allArrayRows.length === 0) return [];

  // Find the header row: first row (within the first 5) that contains at least
  // 3 of the expected column header strings.
  const expectedHeaders = new Set(Object.keys(headerToApiField));
  let headerRowIndex = -1;

  for (let i = 0; i < Math.min(allArrayRows.length, 5); i++) {
    const cellValues = allArrayRows[i].map((v: any) => String(v ?? '').trim());
    const matchCount = cellValues.filter((v: string) => expectedHeaders.has(v)).length;
    if (matchCount >= Math.min(3, expectedHeaders.size)) {
      headerRowIndex = i;
      break;
    }
  }

  if (headerRowIndex === -1) return []; // no recognisable header row found

  const headerRow = allArrayRows[headerRowIndex].map((v: any) => String(v ?? '').trim());

  // Skip only the header row (+1). Data rows start immediately after.
  // We do NOT auto-skip the sample row — users typically edit it in-place.
  const dataRows = allArrayRows.slice(headerRowIndex + 1);

  return dataRows
    .filter((row) =>
      // Skip blank rows (all cells empty or whitespace)
      row.some((v: any) => v !== '' && v !== undefined && v !== null)
    )
    .map((row) => {
      // Build a header-keyed object from the raw array row
      const raw: Record<string, any> = {};
      headerRow.forEach((header, ci) => {
        if (header) raw[header] = row[ci] ?? '';
      });

      // Map header names → api field names
      const rowObj: Partial<T> = {};
      for (const [header, apiField] of Object.entries(headerToApiField)) {
        const value = raw[header];
        if (value !== undefined && value !== null && value !== '') {
          (rowObj as any)[apiField] = typeof value === 'string' ? value.trim() : value;
        }
      }

      return rowTransform ? rowTransform(raw, rowObj) : (rowObj as T);
    });
}

// ─── Main Parser ──────────────────────────────────────────────

export const parseImportExcel = (file: File): Promise<ParsedImportData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });

        // ── Detect the framework this template was built for ──────
        const fw = detectFrameworkFromWorkbook(workbook);
        const cols = getFrameworkColumns(fw);

        const getSheet = (name: string) => workbook.Sheets[name];

        // ── Content Sheet ──────────────────────────────────────────
        const contentMap = buildHeaderToApiFieldMap(cols.contentColumns);
        const contents = parseSheet<ContentRow>(
          getSheet(SHEET_NAMES.CONTENT),
          contentMap,
          (_, row) => ({
            ...row,
            status: 'pending' as const,
            retryCount: 0,
            fileType: (row.fileType as string)?.toLowerCase().trim() as ContentRow['fileType'],
            framework: 'pos-framework' as const,  // content always uses pos-framework for all users
          } as ContentRow)
        );

        // ── QuestionSets Sheet ─────────────────────────────────────
        const qsMap = buildHeaderToApiFieldMap(cols.qsColumns);
        const questionSets = parseSheet<QuestionSetRow>(
          getSheet(SHEET_NAMES.QUESTION_SETS),
          qsMap,
          (_, row) => ({
            ...row,
            status: 'pending' as const,
            retryCount: 0,
            maxAttempts: row.maxAttempts ? Number(row.maxAttempts) : undefined,
            showFeedback:  parseBool(row.showFeedback),
            showSolutions: parseBool(row.showSolutions),
            framework: fw,
          } as QuestionSetRow)
        );

        // ── Questions Sheet ────────────────────────────────────────
        const questionMap = buildHeaderToApiFieldMap(cols.questionColumns);
        const questions = parseSheet<QuestionRow>(
          getSheet(SHEET_NAMES.QUESTIONS),
          questionMap,
          (_, row) => ({
            ...row,
            status: 'pending' as const,
            maxScore: row.maxScore ? Number(row.maxScore) : undefined,
            questionType: (row.questionType as string)?.trim() as QuestionType,
          } as QuestionRow)
        );

        // ── Courses Sheet ──────────────────────────────────────────
        const courseMap = buildHeaderToApiFieldMap(cols.courseColumns);
        const courses = parseSheet<CourseRow>(
          getSheet(SHEET_NAMES.COURSES),
          courseMap,
          (_, row) => ({
            ...row,
            status: 'pending' as const,
            retryCount: 0,
            framework: fw,
          } as CourseRow)
        );

        // ── CourseChildrenMapping Sheet ────────────────────────────
        const mappingMap = buildHeaderToApiFieldMap(cols.mappingColumns);
        const courseChildMappings = parseSheet<CourseChildMappingRow>(
          getSheet(SHEET_NAMES.COURSE_CHILDREN),
          mappingMap,
          (_, row) => ({
            ...row,
            sequence: Number(row.sequence) || 1,
            childType: (row.childType as string)?.toLowerCase().trim() as CourseChildMappingRow['childType'],
          } as CourseChildMappingRow)
        );

        // ── ExistingContentMapping Sheet ───────────────────────────
        const existingMap = buildHeaderToApiFieldMap(cols.existingColumns);
        const existingMappings = parseSheet<ExistingContentMappingRow>(
          getSheet(SHEET_NAMES.EXISTING_MAPPING),
          existingMap,
          (_, row) => ({
            ...row,
            entityType: (row.entityType as string)?.toLowerCase().trim() as ExistingContentMappingRow['entityType'],
          } as ExistingContentMappingRow)
        );

        resolve({
          contents,
          questionSets,
          questions,
          courses,
          courseChildMappings,
          existingMappings,
        });
      } catch (err: any) {
        reject(new Error(`Excel parsing failed: ${err.message}`));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read the uploaded file'));
    reader.readAsArrayBuffer(file);
  });
};

// ─── Helpers ──────────────────────────────────────────────────

const parseBool = (val: any): boolean | undefined => {
  if (val === undefined || val === '') return undefined;
  if (typeof val === 'boolean') return val;
  const s = String(val).toLowerCase().trim();
  return s === 'true' || s === '1' || s === 'yes';
};

// ─── Dependency Graph ─────────────────────────────────────────

export interface DependencyGraph {
  nodes: Set<string>;
  edges: Map<string, Set<string>>;
  order: string[];
}

export const buildDependencyGraph = (data: ParsedImportData): DependencyGraph => {
  const nodes = new Set<string>();
  const edges = new Map<string, Set<string>>();

  const addNode = (id: string) => {
    if (!nodes.has(id)) {
      nodes.add(id);
      edges.set(id, new Set());
    }
  };

  data.contents.forEach((c) => addNode(c.tempId));
  data.questionSets.forEach((q) => addNode(q.tempId));
  data.courses.forEach((c) => addNode(c.tempId));
  data.existingMappings.forEach((e) => addNode(e.tempId));

  data.courseChildMappings.forEach((m) => {
    addNode(m.courseTempId);
    addNode(m.childRef);
    edges.get(m.courseTempId)!.add(m.childRef);
  });

  const order = topologicalSort(nodes, edges);
  return { nodes, edges, order };
};

const topologicalSort = (
  nodes: Set<string>,
  edges: Map<string, Set<string>>
): string[] => {
  const inDegree = new Map<string, number>();
  const result: string[] = [];

  nodes.forEach((n) => inDegree.set(n, 0));
  edges.forEach((deps, node) => {
    deps.forEach(() => inDegree.set(node, (inDegree.get(node) || 0) + 1));
  });

  const queue = [...nodes].filter((n) => (inDegree.get(n) || 0) === 0);
  while (queue.length > 0) {
    const current = queue.shift()!;
    result.push(current);
    edges.forEach((deps, node) => {
      if (deps.has(current)) {
        const nd = (inDegree.get(node) || 0) - 1;
        inDegree.set(node, nd);
        if (nd === 0) queue.push(node);
      }
    });
  }

  // Cycle guard
  nodes.forEach((n) => { if (!result.includes(n)) result.push(n); });
  return result;
};
