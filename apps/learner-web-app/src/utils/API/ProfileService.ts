import axios from 'axios';
import { get, patch } from './RestClient';
import API_ENDPOINTS from './EndUrls';

export const getUserId = async (): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/auth`;

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
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/update/${userId}`;
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
  let apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/read/${userId}`;
  apiUrl = fieldValue ? `${apiUrl}?fieldValue=true` : apiUrl;

  try {
    const response = await get(apiUrl);
    return response?.data;
  } catch (error) {
    console.error('error in fetching user details', error);
    return error;
  }
};

