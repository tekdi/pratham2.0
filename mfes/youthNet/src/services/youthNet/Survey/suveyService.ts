import { post, get } from '@shared-lib';

export const targetSolution = async ({
  state,
  district,
 // block,
}: any): Promise<any> => {
  try {
    const data = {
      state,
      district,
    //  block,
    };
    const apiUrl: string = `${process.env.NEXT_PUBLIC_SURVEY_URL}/solutions/targetedSolutions?type=observation&currentScopeOnly=true`;

    const headers = {
      'X-auth-token': localStorage.getItem('token'),
    };

    const response = await post(apiUrl, data, headers);
    return response?.data;
  } catch (error) {
    console.error('Error in fetching attendance list', error);
  }
};
export const fetchEntities = async ({ solutionId }: any): Promise<any> => {
  try {
    const apiUrl: string = `${process.env.NEXT_PUBLIC_SURVEY_URL}/observations/entities?solutionId=${solutionId}`;

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
    const apiUrl: string = `${process.env.NEXT_PUBLIC_SURVEY_URL}/observations/assessment/${observationId}?entityId=${entityId}`;

    const headers = {
      'X-auth-token': localStorage.getItem('token'),
    };

    const response = await post(apiUrl, {}, headers);
    return response?.data?.result;
  } catch (error) {
    console.error('Error in fetching attendance list', error);
  }
};

export const fetchObservSublist = async ({
  observationId,
  entityId,
}: any): Promise<any> => {
  try {
    const apiUrl: string = `${process.env.NEXT_PUBLIC_SURVEY_URL}/observationSubmissions/list/${observationId}?entityId=${entityId}`;

    const headers = {
      'X-auth-token': localStorage.getItem('token'),
    };

    const response = await get(apiUrl, headers);
    return response?.data?.result;
  } catch (error) {
    console.error('Error in fetching attendance list', error);
  }
};

export const createAnotherSubmission = async ({
  observationId,
  entityId,
}: any): Promise<any> => {
  try {
    const apiUrl: string = `${process.env.NEXT_PUBLIC_SURVEY_URL}/observationSubmissions/create/${observationId}?entityId=${entityId}`;

    const headers = {
      'X-auth-token': localStorage.getItem('token'),
    };

    const response = await post(apiUrl, {}, headers);
    return response?.data?.result;
  } catch (error) {
    console.error('Error in fetching attendance list', error);
  }
};