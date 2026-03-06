import { post, patch } from '@shared-lib';
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

export interface UpdateCohortStatusParam {
  cohortIds: string[];
  status: string;
}

export interface BulkUpdateUsersRolesParam {
  userIds: string[];
  roleId: string;
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

export const updateCohortStatus = async ({
  cohortIds,
  status,
}: UpdateCohortStatusParam): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.cohortUpdateStatus;
  try {
    const response = await patch(apiUrl, {
      cohortIds,
      status,
    });
    return response?.data?.result;
  } catch (error: any) {
    if (error.response) {
      console.error('API error:', error.response.status, error.response.data);
      throw error;
    } else {
      console.error('Network or unknown error:', error);
      throw error;
    }
  }
};

export const bulkUpdateUsersRoles = async ({
  userIds,
  roleId,
}: BulkUpdateUsersRolesParam): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.rbacUsersRolesBulkUpdate;
  try {
    const response = await patch(apiUrl, {
      userIds,
      roleId,
    });
    return response?.data?.result;
  } catch (error: any) {
    if (error.response) {
      console.error('API error:', error.response.status, error.response.data);
      throw error;
    } else {
      console.error('Network or unknown error:', error);
      throw error;
    }
  }
};
