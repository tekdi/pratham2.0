export function getLoggedInUserRole(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('role') || '';
  }
  return '';
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function toPascalCase(name: string): string {
  return name
    .split(/[\s_-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/** Reads `surveyCategory` from localStorage: JSON array, comma-separated string, or a single context type (e.g. learner, self, center). */
export function parseSurveyCategoriesFromLocalStorage(): string[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem('surveyCategory');
  if (raw == null || raw === '') return [];
  const trimmed = raw.trim();
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((item): item is string => typeof item === 'string')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (typeof parsed === 'string' && parsed.trim()) {
      return [parsed.trim()];
    }
  } catch {
    // not JSON
  }
  if (trimmed.includes(',')) {
    return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [trimmed];
}

/**
 * Returns true if endDate is set and is in the past relative to now.
 */
export function isExpired(endDate: string | null | undefined): boolean {
  if (!endDate) return false;
  return new Date() > new Date(endDate);
}

/**
 * Formats an ISO date string as "12 Jan 2026, 11:59 PM" (en-IN locale).
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}
