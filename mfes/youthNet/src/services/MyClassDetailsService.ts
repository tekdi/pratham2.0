import { post } from '@shared-lib';
import API_ENDPOINTS from '../utils/API/APIEndpoints';
import { Role, Status } from '../utils/app.constant';
import {
  CohortMemberList,
 
} from '../utils/Interfaces';


export const getMyCohortMemberList = async ({
  limit,
  page,
  filters,
  includeArchived = false,
}: CohortMemberList & { includeArchived?: boolean }): Promise<any> => {
  const statusFilters = [Status.DROPOUT, Status.ACTIVE];
  if (includeArchived) {
    statusFilters.push(Status.ARCHIVED);
  }

  const studentFilters = {
    role: Role.STUDENT,
    status: statusFilters,
    ...filters,
  };
  return fetchCohortMemberList({ limit, page, filters: studentFilters });
};

export const fetchCohortMemberList = async ({
  limit,
  offset,
  filters,
}: CohortMemberList): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.cohortMemberList;
  try {
    const response = await post(apiUrl, {
      limit,
      offset,
      filters,
      // sort: ["username", "asc"],
    });
    return response?.data;
  } catch (error) {
    console.error('error in cohort member list API ', error);
    // throw error;
    return null;
  }
};

