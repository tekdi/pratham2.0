/** Optional external service. Survey list/read use relative /api/v1 (Next rewrites to upstream). */
const middlewareBaseUrl = process.env.NEXT_PUBLIC_MIDDLEWARE_URL;

export const API_ENDPOINTS = {
  SURVEY_LIST: `/api/v1/surveys/list`,
  SURVEY_READ: (surveyId: string) => `/api/v1/surveys/read/${surveyId}`,
  RESPONSE_CREATE: (surveyId: string) =>
    `/api/v1/responses/create/${surveyId}`,
  RESPONSE_LIST: (surveyId: string) => `/api/v1/responses/list/${surveyId}`,
  RESPONSE_UPDATE: (responseId: string) =>
    `/api/v1/responses/update/${responseId}`,
  RESPONSE_SUBMIT: (responseId: string) =>
    `/api/v1/responses/submit/${responseId}`,
  FIELD_OPTIONS_READ: `${middlewareBaseUrl}/fields/options/read`,
  TEACHER_MY_COHORTS: (userId: string) =>
    `${middlewareBaseUrl}/cohort/mycohorts/${userId}?customField=true&children=true`,
  TEACHER_COHORT_MEMBER_LIST: `${middlewareBaseUrl}/cohortmember/list`,
};
