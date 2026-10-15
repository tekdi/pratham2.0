import { API_ENDPOINTS } from './EndUrls';
import { post } from './RestClient';
import { encryptPassword } from '@shared-lib-v2/utils/passwordEncryption';

export const resetPassword = async (newPassword: any): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.resetPassword;
  try {
    const response = await post(apiUrl, {
      newPassword: await encryptPassword(newPassword),
    });
    return response?.data;
  } catch (error) {
    console.error('error in reset', error);
    throw error;
  }
};

export const forgetPassword = async (
  newPassword: any,
  token: any
): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.forgetPassword;
  try {
    const response = await post(
      apiUrl,
      { newPassword: await encryptPassword(newPassword), token },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response?.data;
  } catch (error) {
    console.error('error in reset', error);
    throw error;
  }
};
