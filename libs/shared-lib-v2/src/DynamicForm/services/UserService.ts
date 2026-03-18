import API_ENDPOINTS from '../utils/API/APIEndpoints';
import { patch } from './RestClient';

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
