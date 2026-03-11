import axios from 'axios';
import { get, patch, post } from '@shared-lib';
import API_ENDPOINTS from '../utils/API/APIEndpoints';
interface LoginParams {
  username: string;
  password: string;
}
export const getUserId = async (): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.userAuth;

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authorization token not found');
    }

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response?.data?.result;
  } catch (error) {
    console.error('Error in fetching user details', error);
    throw error;
  }
};

export const editEditUser = async (
  userId: string | string[],
  userDetails?: object
): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.userUpdate(userId);
  try {
    const response = await patch(apiUrl, userDetails);
    return response?.data;
  } catch (error) {
    console.error('error in fetching user details', error);
    throw error;
  }
};

export const getUserDetails = async (
  userId: string | string[],
  fieldValue?: boolean
): Promise<any> => {
  let apiUrl: string =  API_ENDPOINTS.userRead(userId)
  apiUrl = fieldValue ? `${apiUrl}?fieldvalue=true` : apiUrl;

  try {
    const response = await get(apiUrl);
    return response?.data;
  } catch (error) {
    console.error('error in fetching user details', error);
    return error;
  }
};
export const resetPassword = async (
  newPassword: any, username?:string): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.resetPassword
  try {
    const payload = username ? { newPassword, username } : { newPassword };
    const response = await post(apiUrl, payload);
    return response?.data;
  } catch (error) {
    console.error('error in reset', error);
   // throw error;
  }
};
export const login = async ({
  username,
  password,
}: LoginParams): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.accountLogin

  try {
    const response = await post(apiUrl, { username, password });
    return response?.data;
  } catch (error) {
    console.error('error in login', error);
    throw error;
  }
};