import { get, post } from '@shared-lib';
import axios from 'axios';
import API_ENDPOINTS from 'mfes/youthNet/src/utils/API/APIEndpoints';
import { Role, Status } from 'mfes/youthNet/src/utils/app.constant';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

const MENTOR_DETAILS = {
  MENTOR_NAME: 'Mentor',
  MENTOR_OPTIONS: ['Shivan Mathur', 'Vivek kasture', 'Rohan Nene', 'Sanket Jadhav'],
};
export interface userListParam {
  limit?: number;
  //  page: number;
  filters: {
    role?: string;
    status?: string[];
    states?: string;
    districts?: string;
    blocks?: string;
    fromDate?:string;
    toDate?:string;
    village?:string[]
  };
  fields?: any;
  sort?: object;
  offset?: number;
}
export const fetchUserData = async (): Promise<any> => {
  if (MENTOR_DETAILS) {
    return MENTOR_DETAILS;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/userList`);
    return response?.data?.surveyAvailable || false;
  } catch (error) {
    console.error('Error fetching survey data:', error);
    return false;
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
  const apiUrl: string = API_ENDPOINTS.userList
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
    console.error("error in getting user list", error);
    throw error;
  }
};
export const getUserDetails = async (
  userId: string | string[],
  fieldValue?: boolean
): Promise<any> => {
  let apiUrl: string = API_ENDPOINTS.userRead(userId)
  apiUrl = fieldValue ? `${apiUrl}?fieldvalue=true` : apiUrl;

  try {
    const response = await get(apiUrl);
    return response?.data?.result;
  } catch (error) {
    console.error('error in fetching user details', error);
    return error;
  }
};
export const getYouthDataByDate = async (fromDate: Date, toDate:Date) => {
  try{
    const filters={
      role:Role.LEARNER,
      status:[Status.ACTIVE],
      fromDate:fromDate.toLocaleDateString('en-CA').split('T')[0],
      toDate:toDate.toLocaleDateString('en-CA').split('T')[0]

    }
    const limit=100;
    const offset=0;
const response=await fetchUserList({limit, filters, offset})
return response;
  }catch(error){
  }
  }
