import { API_ENDPOINTS } from './EndUrls';
import { post } from './RestClient';

interface EnrollUserTenantParams {
  userId: string;
  tenantId: string;
  roleId: string;
  userTenantStatus?: string;
}

export const enrollUserTenant = async ({
  userId,
  tenantId,
  roleId,
  userTenantStatus,
}: EnrollUserTenantParams): Promise<any> => {
  const apiUrl = API_ENDPOINTS.enrollUserTenant;

  try {
    const requestBody: {
      userId: string;
      tenantId: string;
      roleId: string;
      userTenantStatus?: string;
    } = {
      userId,
      tenantId,
      roleId,
    };
    
    // Include userTenantStatus if provided
    if (userTenantStatus) {
      requestBody.userTenantStatus = userTenantStatus;
    }
    
    const response = await post(
      apiUrl,
      requestBody,
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

