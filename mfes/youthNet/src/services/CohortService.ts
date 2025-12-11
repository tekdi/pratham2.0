import { post } from '@shared-lib';
import API_ENDPOINTS from '../utils/API/APIEndpoints';

export const bulkCreateCohortMembers = async (payload: any): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.cohortMemberBulkCreate;
  try {
    const response = await post(apiUrl, payload);
    return response.data;
  } catch (error) {
    console.error('Error in bulk creating cohort members', error);
    return null;
  }
};
