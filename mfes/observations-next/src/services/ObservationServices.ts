import { get, post } from './RestClient';

const NEXT_PUBLIC_SURVEY_URL = `https://qa-survey.prathamdigital.org/survey/v1`;

export const targetSolution = async (): Promise<any> => {
  try {
    const apiUrl: string = `${NEXT_PUBLIC_SURVEY_URL}/solutions/targetedSolutions?type=observation&currentScopeOnly=true`;

    const headers = {
      'X-auth-token': localStorage.getItem('token'),
    };

    const response = await post(apiUrl, {}, headers);
    return response?.data;
  } catch (error) {
    console.error('Error in fetching attendance list', error);
  }
};

export const fetchEntities = async ({ solutionId }: any): Promise<any> => {
  try {
    const apiUrl: string = `${NEXT_PUBLIC_SURVEY_URL}/observations/entities?solutionId=${solutionId}`;

    const headers = {
      'X-auth-token': localStorage.getItem('token'),
    };

    const response = await get(apiUrl, headers);
    return response?.data;
  } catch (error) {
    console.error('Error in fetching attendance list', error);
  }
};

export const addEntities = async ({
  data,
  observationId,
}: any): Promise<any> => {
  try {
    const apiUrl: string = `${NEXT_PUBLIC_SURVEY_URL}/observations/updateEntities/${observationId}`;

    const headers = {
      'X-auth-token': localStorage.getItem('token'),
    };

    const response = await post(apiUrl, data, headers);
    return response?.data;
  } catch (error) {
    console.error('Error in fetching attendance list', error);
  }
};

export const checkEntityStatus = async ({
  observationId,
  entityId,
}: any): Promise<any> => {
  try {
    const apiUrl: string = `${NEXT_PUBLIC_SURVEY_URL}/observationSubmissions/list/${observationId}?entityId=${entityId}`;

    const headers = {
      'X-auth-token': localStorage.getItem('token'),
    };

    const response = await post(apiUrl, {}, headers);
    return response?.data;
  } catch (error) {
    console.error('Error in fetching attendance list', error);
  }
};

export const fetchQuestion = async ({
  observationId,
  entityId,
}: any): Promise<any> => {
  try {
    const apiUrl: string = `${NEXT_PUBLIC_SURVEY_URL}/observations/assessment/${observationId}?entityId=${entityId}`;
    const headers = {
      'X-auth-token': localStorage.getItem('token'),
    };
    // const headers = {
    //   'X-auth-token': `eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJha0d1WG1zVTVxMXhOczZxUkVTWWZkTkRyUWRiZ2ZGekRFMEswRkFDNUVzIn0.eyJleHAiOjE3NDE2ODc4NjAsImlhdCI6MTc0MTYwMTQ2MCwianRpIjoiOGFkYTI4Y2QtZjVkNi00Y2U4LTkyOGQtZDYzZTViNTNiNmJhIiwiaXNzIjoiaHR0cHM6Ly9xYS1rZXljbG9hay5wcmF0aGFtZGlnaXRhbC5vcmcvYXV0aC9yZWFsbXMvcHJhdGhhbSIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJiOGI4MmRmZS00YjllLTQ4ZjktOGQ3YS05MzFmOTA4MTdmMzYiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJwcmF0aGFtIiwic2Vzc2lvbl9zdGF0ZSI6ImE5ZmZlMmU1LTIxOTMtNDdmZi1iOTJjLWNkNzgzNjc3MjllMCIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiLyoiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLXByYXRoYW0iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6InByYXRoYW0tcm9sZSBlbWFpbCBwcm9maWxlIiwic2lkIjoiYTlmZmUyZTUtMjE5My00N2ZmLWI5MmMtY2Q3ODM2NzcyOWUwIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoiVmlzaGFsIG1hbmUiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ0bHNjcmoyMzcxMjYyIiwiZ2l2ZW5fbmFtZSI6IlZpc2hhbCIsImZhbWlseV9uYW1lIjoibWFuZSJ9.WW__AYzNq-IAGhL3DY0j3BH28pLGYF6UIUFFw8XKmfiMRpNe73BTYwLGcmymE-PH6miXLqaMozY-jBnfetWrtkrDxz6YXYeLFYuFTzSw7BSxk5nLJzmkLefvbPaR8W1ZUQAzuwwroRaUGERFgMBwHCRivjblU3BvMMhWDqCZ3_JOfc0Rn0KgB-cl9fG0-sDrBUsg4qL2zMTK3hN6wo0xb4laewm3EE4p75ZpiaHsJO0CvTS4q4n89VdWq170H2Qb4m5gJvvABnw864qeldxAh4aw9FJae8BgnNW5I66fhsbDFzMdTe406ulhzGdLrY1Oj3jePG6yrlrKNJqs_i-o0g`,
    // };

    const response = await post(apiUrl, {}, headers);
    return response?.data?.result;
  } catch (error) {
    console.error('Error in fetching attendance list', error);
  }
};

export const updateSubmission = async ({
  submissionId,
  submissionData,
}: any): Promise<any> => {
  try {
    const apiUrl: string = `${NEXT_PUBLIC_SURVEY_URL}/observationSubmissions/update/${submissionId}`;

    const headers = {
      'X-auth-token': localStorage.getItem('token'),
    };

    const response = await post(apiUrl, submissionData, headers);
    return response?.data?.result;
  } catch (error) {
    console.error('Error in fetching attendance list', error);
  }
};
