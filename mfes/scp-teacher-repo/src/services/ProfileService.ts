import axios from 'axios';
import { get, patch } from './RestClient';
import API_ENDPOINTS from '@/utils/API/APIEndpoints';

export const getUserId = async (): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.userAuth

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
  const apiUrl: string = API_ENDPOINTS.userUpdate(userId)
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
  let apiUrl: string = API_ENDPOINTS.userRead(userId, fieldValue)
  // apiUrl = fieldValue ? `${apiUrl}` : apiUrl;

  try {
    const response = await get(apiUrl);
    return response?.data;
  } catch (error) {
    console.error('error in fetching user details', error);
    return error;
  }
};

export const profileComplitionCheck = async (): Promise<any> => {
  const userId = localStorage.getItem('userId');
  try {
    if (userId) {
      const apiUrl = API_ENDPOINTS.userRead(userId, true);
      const response = await get(apiUrl);
      const userData = response?.data?.result?.userData;
      const isVolunteerField = userData?.customFields?.find(
        (field: any) => field.label === 'IS_VOLUNTEER'
      );
      console.log(isVolunteerField);
      const isVolunteer = isVolunteerField?.selectedValues?.[0] === 'yes';
      localStorage.setItem('isVolunteer', JSON.stringify(isVolunteer));

      // Store custom fields in localStorage
      if (userData?.customFields) {
        const getFieldId = (labelKey: any) => {
          const field = userData.customFields?.find?.((f: any) => f.label === labelKey);
          return field?.selectedValues?.[0]?.id ?? null;
        };
        const getFieldLabel = (labelKey: any) => {
          const field = userData.customFields?.find?.((f: any) => f.label === labelKey);
          return field?.selectedValues?.[0]?.value ?? null;
        };

        const stateId = getFieldId('STATE');
        const stateName = getFieldLabel('STATE');
        const districtId = getFieldId('DISTRICT');
        const blockId = getFieldId('BLOCK');

        if (stateId) {
          localStorage.setItem('mfe_state', String(stateId));
          localStorage.setItem('stateId', String(stateId));
        }
        if (districtId) localStorage.setItem('mfe_district', String(districtId));
        if (stateName) localStorage.setItem('stateName', stateName);
        if (blockId) localStorage.setItem('mfe_block', String(blockId));
        localStorage.setItem('roleName', 'Learner');
      }

      return true;
    }
  } catch (error) {
    console.error('error in profile completion check', error);
    throw error;
  }
};
