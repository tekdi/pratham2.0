import { API_ENDPOINTS } from '@/utils/API/APIEndpoints';
import { post, get } from './RestClient';

export interface userListParam {
  limit?: number;
  //  page: number;
  filters: {
    role?: string;
    status?: string;
    states?: string;
    districts?: string;
    blocks?: string;
  };
  fields?: any;
  sort?: object;
  offset?: number;
}

export const userList = async ({
  limit,
  //  page,
  filters,
  sort,
  offset,
  fields,
}: userListParam): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.userList;
  try {
    const response = await post(apiUrl, {
      limit,
      filters,
      sort,
      offset,
      fields,
    });
    return response?.data?.result;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 404) {
        return [];
      }
      console.error('API error:', error.response.status, error.response.data);
    } else {
      console.error('Network or unknown error:', error);
      console.error('error in getting user list', error);
    }
  }
};

export const cohortMemberList = async ({
  limit,
  //  page,
  filters,
  sort,
  offset,
  fields,
}: userListParam): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.cohortMemberList;
  try {
    const response = await post(apiUrl, {
      limit,
      filters,
      sort,
      offset,
      fields,
    });
    return response?.data?.result;
  } catch (error) {
    console.error('error in getting user list', error);
    throw error;
  }
};

export const getUserDetailsInfo = async (
  userId: string | string[],
  fieldValue: boolean = true
): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.userRead(userId, fieldValue);
  try {
    const response = await get(apiUrl);
    return response?.data?.result;
  } catch (error) {
    console.error('error in fetching user details', error);
    return error;
  }
};

export const userNameExist = async (userData: any): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.suggestUsername;
  try {
    const response = await post(apiUrl, userData);
    return response?.data?.result;
  } catch (error) {
    console.error('error in getting in userNme exist', error);
    throw error;
  }
};
