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

/**
 * FIX: Re-enrollment support for admin-deleted users.
 *
 * Problem: enrollUserTenant() uses POST /user-tenant to CREATE a new user-tenant mapping.
 * When an admin deletes a user from a program, the existing mapping is set to
 * tenantStatus = 'archived' (not removed). If the user tries to re-enroll, the POST fails
 * silently because a mapping already exists — the tenantStatus stays 'archived' and
 * the user is never actually re-enrolled.
 *
 * Solution: This function uses PATCH /user-tenant/status to UPDATE the existing archived
 * mapping's status back to 'pending' (or 'active'). It must be called as a fallback inside
 * a catch block whenever enrollUserTenant() throws, which indicates an existing mapping.
 *
 * Usage: See handleAssessmentModalClose and onAssessmentUnavailableOk in
 *        enroll-profile-completion/page.tsx
 */
export const reactivateUserTenant = async (
  userId: string,
  tenantId: string,
  status: string = 'pending'
): Promise<any> => {
  const apiUrl = API_ENDPOINTS.reactivateUserTenant(userId, tenantId);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const onboardTenantId = typeof window !== 'undefined' ? localStorage.getItem('onboardTenantId') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: '*/*',
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (onboardTenantId) headers.tenantid = onboardTenantId;

  const response = await axios.patch(apiUrl, { status }, { headers });
  return response?.data;
};

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

