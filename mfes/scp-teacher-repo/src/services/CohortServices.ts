import { CohortListParam, GetCohortSearchParams } from '@/utils/Interfaces';
import { Role, Status } from '@/utils/app.constant';
import { get, post } from './RestClient';
import API_ENDPOINTS from '@/utils/API/APIEndpoints';

const getUserRole = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('role');
  }
  return null; // Return a default value for SSR environments
};

const role = getUserRole();

export const cohortList = async ({
  limit,
  offset,
  filters,
}: CohortListParam): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.cohortSearch
  try {
    const response = await post(apiUrl, { limit, offset, filters });
    return response?.data?.result;
  } catch (error) {
    console.error('error in getting cohort list', error);
    throw error;
  }
};

export const getCohortDetails = async (cohortId: string): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.cohortHierarchy(cohortId)
  try {
    const response = await get(apiUrl);
    return response?.data?.result;
  } catch (error) {
    console.error('error in getting cohort details', error);
    // throw error;
  }
};

export const getCohortList = async (
  userId: string,
  filters: { [key: string]: string } = {},
  isCustomFields: boolean = false
): Promise<any> => {
  let apiUrl: string = API_ENDPOINTS.myCohorts(userId);
  filters = { ...filters, children: 'true' };
  const filterParams = new URLSearchParams(filters).toString();
  if (filterParams) {
    apiUrl += `?${filterParams}`;
  }
  try {
    const response = await get(apiUrl);

    if (isCustomFields) {
      return response?.data?.result;
    }
    if (response?.data?.result.length>0) {
      let res = response?.data?.result;

      res = res.filter((block: any) => {
        if (
            block?.cohortStatus === Status.ACTIVE &&  block?.childData.length>0
        ) {
          return block;
        }
      });

      return res;
    }

    return response?.data?.result;
  } catch (error) {
    console.error('Error in getting cohort details', error);
  }
};

export const bulkCreateCohortMembers = async (payload: any): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.cohortMemberBulkCreate
  try {
    const response = await post(apiUrl, payload);
    return response.data;
  } catch (error) {
    console.error('Error in bulk creating cohort members', error);
    throw error;
  }
};

export const getCohortSearch = async ({
  cohortId,
  limit = 20,
  offset = 0,
}: GetCohortSearchParams): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.cohortSearch

  const data = {
    filters: {
      cohortId,
    },
    limit,
    offset,
  };

  try {
    const response = await post(apiUrl, data);
    return response?.data;
  } catch (error) {
    console.error('Error in searching Cohorts', error);
    return error;
  }
};

export const getCentersByBlockId = async (blockId: string): Promise<any[]> => {
  if (!blockId) {
    throw new Error("blockId is required");
  }

  const apiUrl: string = API_ENDPOINTS.cohortSearch;

  const data = {
    limit: 20,
    offset: 0,
    filters: {
      block: [blockId],
      type: "COHORT",
      status: ["active"]
    },
  };

  try {
    const response = await post(apiUrl, data);
    const result = response?.data?.result?.results;

    if (!result || !result.cohortDetails) {
      return [];
    }
    return result.cohortDetails;
  } catch (error) {
    console.error("Error in searching Cohorts:", error);
    return [];
  }
};

export const getBlocksByCenterId = async (centerId: string): Promise<any[]> => {
  if (!centerId) {
    throw new Error("centerId is required");
  }

  const apiUrl: string = API_ENDPOINTS.cohortSearch;

  const data = {
    limit: 20,
    offset: 0,
    filters: {
      parentId: [centerId]
    }
  };

  try {
    const response = await post(apiUrl, data);

    const result = response?.data?.result?.results;

    console.log('result ===>', result)

    return result.cohortDetails;
  } catch (error) {
    console.error("Error in searching Cohorts:", error);
    return [];
  }
};


