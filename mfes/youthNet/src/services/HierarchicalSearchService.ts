import { post } from '@shared-lib';
import API_ENDPOINTS from '../utils/API/APIEndpoints';

export interface HierarchicalSearchParams {
  limit?: number;
  offset?: number;
  filters: {
    center?: string[];
    role?: string;
    status?: string[];
  };
  customfields?: string[];
  sort?: string[];
}

export const hierarchicalSearchUserList = async (
  params: HierarchicalSearchParams
): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.hierarchicalSearch;

  try {
    const response = await post(apiUrl, params);
    const result = response?.data?.result;
    return {
      totalCount: result?.totalCount,
      getUserDetails: result?.users || [],
    };
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 404) {
        return { totalCount: 0, getUserDetails: [] };
      }
      console.error('API error:', error.response.status, error.response.data);
    } else {
      console.error('Network or unknown error:', error);
      console.error('error in hierarchical search user list', error);
    }
    return { totalCount: 0, getUserDetails: [] };
  }
};
