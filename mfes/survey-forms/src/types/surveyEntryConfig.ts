/**
 * Host-driven entry configuration for the survey-forms MFE.
 *
 * The embedding app (e.g. scp-teacher-repo, YouthNet shell) should set JSON in
 * sessionStorage before navigating into this MFE — see `SURVEY_FORMS_ENTRY_STORAGE_KEY`
 * in `utils/surveyEntryConfig.ts`.
 *
 * Design goals:
 * - Self / none-context surveys always open the fill flow directly (no mid UI).
 * - Contextual surveys can open either the legacy manual ID page or a configurable hub.
 * - Hub rows can be supplied inline by the host (most flexible) or loaded later via
 *   built-in fetchers keyed by `rosterSource` / `hostFetcherKey` (extend over time).
 */

export type SurveyFormsEntryConfigVersion = 1;

/** Mid-page strategy for surveys that require an external context entity. */
export type SurveyContextEntryMode = 'manual' | 'hub';

/** Describes which hub variant to render (extend as products need). */
export type SurveyHubKind = 'learner' | 'center' | 'custom';

/** Where hub rows come from (host-controlled unless a fetcher is implemented). */
export type SurveyHubRosterSource = 'inline' | 'teacherCohort' | 'hostFetcherKey';

export interface SurveyHubRosterItem {
  /** Becomes `contextId` in `/survey-fill/[surveyId]/[contextId]` */
  id: string;
  /** Primary cell (e.g. learner name) */
  label: string;
  subtitle?: string;
  metadata?: Record<string, unknown>;
}

export type SurveyHubStatus = 'none' | 'draft' | 'submitted';

export interface SurveyFormsEntryConfigV1 {
  version: SurveyFormsEntryConfigVersion;
  /**
   * When set on a contextual survey, opens `/survey-fill/[id]/hub` instead of
   * the manual ContextPicker. Defaults to `manual` if omitted (backward compatible).
   */
  contextEntry?: SurveyContextEntryMode;
  /** Which hub layout / copy to prefer (table columns can still be generic). */
  hubKind?: SurveyHubKind;
  /** Opaque host data: cohortId, SDBV filter JSON, center ids, etc. */
  hubPayload?: Record<string, unknown>;
  rosterSource?: SurveyHubRosterSource;
  /**
   * When `rosterSource` is `inline`, host supplies rows (learners, centers, …).
   */
  rosterItems?: SurveyHubRosterItem[];
  /**
   * Optional registry key for a future built-in fetcher (e.g. YouthNet SDBV).
   * Not used until implemented server/client-side in this MFE.
   */
  hostFetcherKey?: string;
  /**
   * Optional status map keyed by same `id` as `rosterItems` (or fetched rows).
   * Lets the host merge survey API + roster without this MFE knowing domain rules.
   */
  statusByContextId?: Record<string, SurveyHubStatus>;
  /**
   * Optional map of submission timestamps keyed by context ID.
   * Used to display relative submission times for submitted surveys.
   */
  submittedAtByContextId?: Record<string, string>;
}

export type SurveyFormsEntryConfig = SurveyFormsEntryConfigV1;
