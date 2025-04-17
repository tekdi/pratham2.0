import { API_ENDPOINTS } from './EndUrls';
import { post } from './RestClient';

export const resetPassword = async (newPassword: any): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.resetPassword;
  try {
    const response = await post(apiUrl, { newPassword });
    return response?.data;
  } catch (error) {
    console.error('error in reset', error);
    throw error;
  }
};
