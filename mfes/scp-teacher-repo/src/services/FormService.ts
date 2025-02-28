import API_ENDPOINTS from '@/utils/API/APIEndpoints';
import { deleteApi } from './RestClient';

export const deleteFormFields = async (
  fieldValues: { fieldId: string; itemId: string }[]
): Promise<any> => {
  const apiUrl = API_ENDPOINTS.deleteFieldValues

  try {
    const response = await deleteApi(apiUrl, { fieldValues }, {});
    return response?.data?.result;
  } catch (error) {
    console.error('Error in deleting Form Fields', error);
    throw error;
  }
};
