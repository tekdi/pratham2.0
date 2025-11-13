import { API_ENDPOINTS } from '@/utils/API/APIEndpoints';
import { patch } from './RestClient';
export const deleteUser = async (
  userId: string,
  userData: object
): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.userUpdate(userId);
  try {
    const response = await patch(apiUrl, userData);
    return response?.data;
  } catch (error) {
    console.error('error in fetching user details', error);
    return error;
  }
};

export const editEditUser = async (
  userId: string,
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

export const updateUserTenantStatus = async (
  userId: string,
  tenantId: string,
  userDetails?: object
): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.userTenantStatus(userId, tenantId);
  try {
    const response = await patch(apiUrl, userDetails);
    return response?.data;
  } catch (error) {
    console.error('error in updating user tenant status', error);
    throw error;
  }
};
