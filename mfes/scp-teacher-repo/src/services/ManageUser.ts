//@ts-nocheck
import {
  AssignCentersToFacilitatorListParam,
  FacilitatorDeleteUserData,
  FacilitatorListParam,
} from '@/utils/Interfaces';
import { patch, post, put } from './RestClient';
import API_ENDPOINTS from '@/utils/API/APIEndpoints';

export interface userListParam {
  limit?: number;
  //  page: number;
  filters: {
    role?: string;
    status?: string[];
    states?: string;
    district?: (string | number)[];
    block?: (string | number)[];
    fromDate?: string;
    toDate?: string;
    village?: (string | number)[];
    emp_manager?: string;
    name?: string;
    tenantId?: string;
    tenantStatus?: string[];
    interested_to_join?: string;
    state?: (string | number)[];
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

export const getFacilitatorList = async ({
  limit,
  page,
  filters,
}: FacilitatorListParam): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.userList;
  try {
    const response = await post(apiUrl, { limit, page, filters });
    return response?.data?.result;
  } catch (error) {
    console.error('error in getting cohort list', error);
    throw error;
  }
};

export const assignCentersToFacilitator = async ({
  userId,
  cohortId,
}: AssignCentersToFacilitatorListParam): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.cohortMemberBulkCreate;
  try {
    const response = await post(apiUrl, { userId, cohortId });
    return response?.data?.result;
  } catch (error) {
    console.error('error in getting cohort list', error);
    throw error;
  }
};

export const updateFacilitator = async (
  userId: string,
  userData: FacilitatorDeleteUserData
): Promise<any> => {
  const apiUrl = API_ENDPOINTS.userUpdate(userId);
  try {
    const response = await patch(apiUrl, { userData });
    return response.data.result;
  } catch (error) {
    console.error('Error in updating Facilitator', error);
    throw error;
  }
};

export const renameFacilitator = async (
  userId: string,
  name: string
): Promise<any> => {
  const apiUrl = API_ENDPOINTS.updateCohortUser(userId);
  try {
    const response = await put(apiUrl, { name });
    return response.data.result;
  } catch (error) {
    console.error('Error in updating Facilitator', error);
    throw error;
  }
};

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

export const updateUserTenantStatus = async (
  userId: string,
  tenantId: string,
  status: string
): Promise<any> => {
  // API endpoint was a function in some older bundles; handle both shapes
  const userTenantEndpoint = API_ENDPOINTS.userTenantStatus as
    | string
    | ((u: string, t: string) => string);

  const apiUrl =
    typeof userTenantEndpoint === 'function'
      ? userTenantEndpoint(userId, tenantId)
      : `${userTenantEndpoint}?userId=${userId}&tenantId=${tenantId}`;
  
  // Validate URL is a proper absolute URL, not JavaScript code or relative path
  if (!apiUrl || typeof apiUrl !== 'string' || !apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
    const errorMsg = `Invalid API URL: ${apiUrl}. Check NEXT_PUBLIC_MIDDLEWARE_URL environment variable.`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  
  try {
    const response = await patch(apiUrl, { status });
    return response?.data;
  } catch (error) {
    console.error('Error in updating user tenant status', error);
    throw error;
  }
};


