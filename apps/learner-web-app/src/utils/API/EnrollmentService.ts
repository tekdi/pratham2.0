import { API_ENDPOINTS } from './EndUrls';
import axios from 'axios';

interface EnrollUserTenantParams {
  userId: string;
  tenantId: string;
  roleId: string;
  customField?: any;
  userData?: any;
  userTenantStatus?: string;
}

export const enrollUserTenant = async ({
  userId,
  tenantId,
  roleId,
  customField,
  userData,
  userTenantStatus,
}: EnrollUserTenantParams): Promise<any> => {
  const apiUrl = API_ENDPOINTS.enrollUserTenant;

  try {
    const requestBody: {
      userId: string;
      tenantId: string;
      roleId: string;
      userTenantStatus?: string;
      customField?: any;
      userData?: any;
    } = {
      userId,
      tenantId,
      roleId,
      customField,
      userData,
    };
    
    // Include userTenantStatus if provided
    if (userTenantStatus) {
      requestBody.userTenantStatus = userTenantStatus;
    }
    // Get token and other values from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const onboardAcademicYearId = typeof window !== 'undefined' 
      ? localStorage.getItem('onboardAcademicYearId') 
      : null;
    const onboardTenantId = typeof window !== 'undefined' 
      ? localStorage.getItem('onboardTenantId') 
      : null;

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: '*/*',
    };

    // Add Authorization header if token is available
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Add onboardAcademicYearId to headers if available
    if (onboardAcademicYearId) {
      headers.academicyearId = onboardAcademicYearId;
    }

    // Add onboardTenantId to headers if available
    if (onboardTenantId) {
      headers.tenantid = onboardTenantId;
    }

    const response = await axios.post(apiUrl, requestBody, { headers });
    
    return response?.data;
  } catch (error) {
    console.error('Error in enrolling user to tenant', error);
    throw error;
  }
};

