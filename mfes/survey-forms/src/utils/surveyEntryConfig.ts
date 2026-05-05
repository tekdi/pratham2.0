import type { SurveyFormsEntryConfig, SurveyFormsEntryConfigV1 } from '../types/surveyEntryConfig';

/** Global default entry config (any survey). */
export const SURVEY_FORMS_ENTRY_STORAGE_KEY = 'surveyFormsEntryConfig';

/** Per-survey override: `surveyFormsEntryConfig:<surveyId>` */
export function surveyEntryStorageKeyForSurvey(surveyId: string): string {
  return `${SURVEY_FORMS_ENTRY_STORAGE_KEY}:${surveyId}`;
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function parseConfigJson(raw: string | null): SurveyFormsEntryConfig | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isObject(parsed)) return null;
    if (parsed.version !== 1) return null;
    return parsed as unknown as SurveyFormsEntryConfigV1;
  } catch {
    return null;
  }
}

/**
 * Reads merged entry config: per-survey override wins over global.
 */
export function readSurveyEntryConfig(surveyId: string): SurveyFormsEntryConfig | null {
  if (typeof window === 'undefined') return null;
  const globalCfg = parseConfigJson(
    window.sessionStorage.getItem(SURVEY_FORMS_ENTRY_STORAGE_KEY)
  );
  const scoped = parseConfigJson(
    window.sessionStorage.getItem(surveyEntryStorageKeyForSurvey(surveyId))
  );
  if (!globalCfg && !scoped) return null;
  if (!scoped) return globalCfg;
  if (!globalCfg) return scoped;
  return {
    ...globalCfg,
    ...scoped,
    hubPayload: {
      ...(globalCfg.hubPayload ?? {}),
      ...(scoped.hubPayload ?? {}),
    },
    rosterItems: scoped.rosterItems ?? globalCfg.rosterItems,
    statusByContextId: {
      ...(globalCfg.statusByContextId ?? {}),
      ...(scoped.statusByContextId ?? {}),
    },
  };
}

/**
 * Shallow URL overrides for local/dev: `?sf_contextEntry=hub&sf_hubKind=learner`
 * (does not replace rosterItems — use sessionStorage for data).
 */
export function readSurveyEntryConfigFromSearchParams(
  searchParams: URLSearchParams
): Partial<SurveyFormsEntryConfigV1> | null {
  const contextEntry = searchParams.get('sf_contextEntry');
  const hubKind = searchParams.get('sf_hubKind');
  const rosterSource = searchParams.get('sf_rosterSource');
  if (!contextEntry && !hubKind && !rosterSource) return null;
  const out: Partial<SurveyFormsEntryConfigV1> = { version: 1 };
  if (contextEntry === 'hub' || contextEntry === 'manual') {
    out.contextEntry = contextEntry;
  }
  if (hubKind === 'learner' || hubKind === 'center' || hubKind === 'custom') {
    out.hubKind = hubKind;
  }
  if (
    rosterSource === 'inline' ||
    rosterSource === 'teacherCohort' ||
    rosterSource === 'hostFetcherKey'
  ) {
    out.rosterSource = rosterSource;
  }
  return out;
}

/** Persist config from the host shell (call before navigating into survey-forms). */
export function writeSurveyEntryConfig(
  config: SurveyFormsEntryConfigV1,
  options?: { surveyId?: string }
): void {
  if (typeof window === 'undefined') return;
  const key = options?.surveyId
    ? surveyEntryStorageKeyForSurvey(options.surveyId)
    : SURVEY_FORMS_ENTRY_STORAGE_KEY;
  window.sessionStorage.setItem(key, JSON.stringify(config));
}

export function mergeEntryConfig(
  base: SurveyFormsEntryConfig | null,
  override: Partial<SurveyFormsEntryConfigV1> | null
): SurveyFormsEntryConfig | null {
  if (!base && !override) return null;
  if (!override) return base;
  if (!base) return { version: 1, ...override } as SurveyFormsEntryConfigV1;
  return {
    ...base,
    ...override,
    hubPayload: { ...(base.hubPayload ?? {}), ...(override.hubPayload ?? {}) },
    rosterItems: override.rosterItems ?? base.rosterItems,
    statusByContextId: {
      ...(base.statusByContextId ?? {}),
      ...(override.statusByContextId ?? {}),
    },
  };
}
