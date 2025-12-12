import API_ENDPOINTS from '../utils/API/APIEndpoints';
import { get } from './RestClient';
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
    console.error('error in fetching user details', error);
    return error;
  }
};
