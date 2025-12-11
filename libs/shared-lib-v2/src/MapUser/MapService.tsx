import { post } from '@/services/RestClient';
import { API_ENDPOINTS } from '@shared-lib-v2/utils/API/EndUrls';

export const enrollUserTenant = async ({
  userId,
  tenantId,
  roleId,
  customField,
  userData,
}: any): Promise<any> => {
  const apiUrl = API_ENDPOINTS.enrollUserTenant;

  try {
    const response = await post(
      apiUrl,
      {
        userId,
        tenantId,
        roleId,
        customField,
        userData,
      },
      {
        'Content-Type': 'application/json',
        Accept: '*/*',
      }
    );

    return response?.data;
  } catch (error) {
    console.error('Error in enrolling user to tenant', error);
    throw error;
  }
};
