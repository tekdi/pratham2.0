// Generic, framework-API-driven taxonomy engine for the Curriculum Planner.
// This module has no knowledge of specific category names (board/medium/grade/...);
// it only operates on framework.categories[].terms[].associations[] as data.

export const SUBJECT_CATEGORY_CODE = "subject";
const RETIRED_STATUS = "Retired";

export const isActive = (status?: string) => status !== RETIRED_STATUS;

export interface SelectionEntry {
  categoryCode: string;
  termCode: string;
}

const sortByIndex = (a: any, b: any) => (a?.index ?? 0) - (b?.index ?? 0);

// Active categories, excluding "subject", sorted by category.index.
export const getDropdownCategories = (framework: any): any[] => {
  if (!framework?.categories) return [];
  return framework.categories
    .filter((c: any) => isActive(c?.status) && c?.code !== SUBJECT_CATEGORY_CODE)
    .sort(sortByIndex);
};

export const getCategoryByCode = (framework: any, code: string): any =>
  framework?.categories?.find((c: any) => c?.code === code);

// Active terms for a category, sorted by term.index.
export const getActiveTerms = (framework: any, categoryCode: string): any[] => {
  const category = getCategoryByCode(framework, categoryCode);
  return (category?.terms || []).filter((t: any) => isActive(t?.status)).sort(sortByIndex);
};

export const findTermByCode = (framework: any, categoryCode: string, termCode: string): any =>
  getActiveTerms(framework, categoryCode).find((t: any) => t?.code === termCode);

/**
 * Given the framework and the selections made so far (in any order, any count,
 * excluding the target category), return the active terms of targetCategoryCode
 * that are valid given the intersection of associations pointing at that category
 * across all currently selected terms.
 *
 * Strictly association-driven: a selected term's own `associations` are the only
 * source of truth for what's valid downstream. If none of the currently selected
 * terms carry any association tagged with targetCategoryCode (e.g. the selected
 * term has no associations configured at all), the result is an empty list —
 * never a fallback to "show everything". The UI must never assume a relationship
 * that isn't explicitly present in the data.
 */
export const getValidTermsForCategory = (
  framework: any,
  selections: SelectionEntry[],
  targetCategoryCode: string
): any[] => {
  const activeTargetTerms = getActiveTerms(framework, targetCategoryCode);
  const relevantSelections = (selections || []).filter(
    (s) => s.categoryCode !== targetCategoryCode && s.termCode
  );

  if (relevantSelections.length === 0) return activeTargetTerms;

  const perSelectionCodeSets: Set<string>[] = relevantSelections.map((sel) => {
    const term = findTermByCode(framework, sel.categoryCode, sel.termCode);
    const codes = (term?.associations || [])
      .filter((a: any) => a?.category === targetCategoryCode)
      .map((a: any) => a?.code);
    return new Set<string>(codes);
  });

  const nonEmptySets = perSelectionCodeSets.filter((s) => s.size > 0);
  if (nonEmptySets.length === 0) return [];

  const [firstSet, ...restSets] = nonEmptySets;
  const intersection = restSets.reduce((acc, set) => {
    return new Set([...acc].filter((code) => set.has(code)));
  }, firstSet as Set<string>);

  return activeTargetTerms.filter((term: any) => intersection.has(term.code));
};

export const getValidSubjects = (framework: any, selections: SelectionEntry[]): any[] =>
  getValidTermsForCategory(framework, selections, SUBJECT_CATEGORY_CODE);
