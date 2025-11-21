import { post, patch, put } from '@shared-lib';
import API_ENDPOINTS from '../utils/API/APIEndpoints';

export interface userListParam {
  limit?: number;
  //  page: number;
  filters: {
    role?: string;
    status?: string[];
    states?: string;
    district?: string[];
    block?: string[];
    fromDate?: string;
    toDate?: string;
    village?: string[];
    emp_manager?: string;
    name?: string;
  };
  fields?: any;
  sort?: object;
  offset?: number;
}

export interface UsersByManagerParam {
  limit?: number;
  filters: {
    emp_manager: string;
    [key: string]: any;
  };
  sort?: [string, string];
  offset?: number;
  fields?: any;
}

export const fetchUserList = async ({
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
    }
  }
};

