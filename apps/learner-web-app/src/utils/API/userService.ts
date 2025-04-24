import { API_ENDPOINTS } from './EndUrls';
import { post } from './RestClient';

interface UserCheckParams {
  username?: string;
  mobile?: string;
  email?: string;
  firstName?: string;
}

export const userCheck = async ({
  mobile,
  email,
  firstName,
}: UserCheckParams): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.userCheck;

  try {
    let response;
    // if (username) {
    //   response = await post(apiUrl, { username });
    // }
    if (email) {
      response = await post(apiUrl, { email });
    } else if (mobile && firstName) {
      response = await post(apiUrl, { mobile, email, firstName });
    }

    return response?.data;
  } catch (error) {
    console.error('error in login', error);
    throw error;
  }
};
