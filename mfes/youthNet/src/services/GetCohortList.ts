import { get } from '@shared-lib';
import API_ENDPOINTS from '../utils/API/APIEndpoints';

export const getCohortList = async (
  userId: string | string[],
  children?: boolean,
  customField?: boolean
): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.myCohorts(userId, children, customField);
  try {
    const response = await get(apiUrl);
    return response?.data;
  } catch (error) {
    console.error('error in fetching cohort list', error);
    return error;
  }
};
