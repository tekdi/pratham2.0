import { API_ENDPOINTS } from './EndUrls';
import { post } from './RestClient';

interface EnrollUserTenantParams {
  userId: string;
  tenantId: string;
  roleId: string;
}

export const enrollUserTenant = async ({
  userId,
  tenantId,
  roleId,
}: EnrollUserTenantParams): Promise<any> => {
  const apiUrl = API_ENDPOINTS.enrollUserTenant;

  try {
    const response = await post(
      apiUrl,
      {
        userId,
        tenantId,
        roleId,
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

