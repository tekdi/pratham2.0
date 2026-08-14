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

/** Formats an ISO date string as "13/08/2026" (DD/MM/YYYY, zero-padded). */
export function formatDDMMYYYY(dateString: string): string {
  const date = new Date(dateString);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/** Formats an ISO date string as "13/08/2026, 6:01:32 PM" (DD/MM/YYYY + locale time). */
export function formatDDMMYYYYWithTime(dateString: string): string {
  const date = new Date(dateString);
  return `${formatDDMMYYYY(dateString)}, ${date.toLocaleTimeString()}`;
}

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Full month name (e.g. "July") that an ISO date string falls in. */
export function monthNameFromDate(dateString: string): string {
  return MONTHS[new Date(dateString).getMonth()];
}
