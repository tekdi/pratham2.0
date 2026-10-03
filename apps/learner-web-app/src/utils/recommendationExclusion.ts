// Tracks content already seen during the current in-progress recommendation
// journey (Player -> open a Recommended card -> Player ...), so it is not
// suggested again. Persisted in sessionStorage so it survives the full page
// navigation triggered when opening a recommended content item.

const STORAGE_KEY = 'pratham_recommendation_exclude_ids';

export const getExcludeContentIds = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const addExcludeContentId = (identifier?: string | string[]): void => {
  if (typeof window === 'undefined' || !identifier) return;
  const id = Array.isArray(identifier) ? identifier[0] : identifier;
  if (!id) return;
  const existing = getExcludeContentIds();
  if (!existing.includes(id)) {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...existing, id])
    );
  }
};

export const resetExcludeContentIds = (): void => {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(STORAGE_KEY);
};
