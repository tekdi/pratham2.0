/**
 * Survey Nest upstream URL (for documentation / tooling).
 *
 * Browser calls stay relative (`/api/v1/...`); `survey-forms` `next.config.js` rewrites to the upstream.
 * Configure with **SURVEY_API_UPSTREAM_URL** (preferred) or `NEXT_PUBLIC_SURVEY_API_BASE_URL`.
 */
export function getSurveyApiUpstreamUrl(): string {
  const raw =
    process.env.SURVEY_API_UPSTREAM_URL ||
    process.env.NEXT_PUBLIC_SURVEY_API_BASE_URL ||
    process.env.NEXT_PUBLIC_SURVEY_FORMS_API_URL ||
    '';
  return raw.replace(/\/+$/, '');
}
