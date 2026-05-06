import type { Survey } from '../types/survey';
import type { SurveyFormsEntryConfig } from '../types/surveyEntryConfig';

/**
 * Resolves the next route after the user picks a survey from the list.
 *
 * - `self` / `none` → always direct fill (`/self`).
 * - Other context types → `hub` if host config says so, else manual ContextPicker.
 */
export function resolvePostSurveyListRoute(
  survey: Survey,
  entryConfig: SurveyFormsEntryConfig | null
): string {
  const id = survey.surveyId;
  if (!survey.contextType || survey.contextType === 'none' || survey.contextType === 'self') {
    return `/survey-fill/${id}/self`;
  }

  const mode = entryConfig?.contextEntry ?? 'manual';
  if (mode === 'hub') {
    return `/survey-fill/${id}/hub`;
  }
  return `/survey-fill/${id}`;
}

/**
 * Teacher-specific route resolution after picking a survey from the teacher list.
 * Self/none → direct fill; any contextual type → teacher hub.
 */
export function resolveTeacherPostListRoute(survey: Survey): string {
  const id = survey.surveyId;
  if (!survey.contextType || survey.contextType === 'none' || survey.contextType === 'self') {
    return `/survey-fill/${id}/self`;
  }
  return `/teacher-survey-fill/${id}/hub`;
}
