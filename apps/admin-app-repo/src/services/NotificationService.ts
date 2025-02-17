import { SendCredentialsRequest } from '@/utils/Interfaces';
import { post, get } from './RestClient';
import API_ENDPOINTS from '@/utils/API/APIEndpoints';

export const sendCredentialService = async ({
  isQueue,
  context,
  key,
  replacements,
  email,
  push
}: SendCredentialsRequest): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.notificationSend
  try {
    const response = await post(apiUrl, {
      isQueue,
      context,
      key,
      replacements,
      email,
      push
    });
    return response?.data;
  } catch (error) {
    console.error('error in getting Assesment List Service list', error);

    return error;
  }
};


