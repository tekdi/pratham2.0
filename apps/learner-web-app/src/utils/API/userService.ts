import { fetchForm } from '@shared-lib-v2/DynamicForm/components/DynamicFormCallback';
import { API_ENDPOINTS } from './EndUrls';
import { post, get, patch } from './RestClient';
import { FormContext } from '@shared-lib-v2/DynamicForm/components/DynamicFormConstant';
import { getMissingFields } from '../helper';
export interface UserDetailParam {
  userData?: object;

  customFields?: any;
}
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

export const profileComplitionCheck = async (): Promise<any> => {
  let userId = localStorage.getItem('userId');
  try {
    if (userId) {
      let apiUrl: string = API_ENDPOINTS.userRead(userId, true);

      const response = await get(apiUrl);
      console.log('response', response);
      let userData = response?.data?.result?.userData;
      const responseForm: any = await fetchForm([
        {
          fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.learner.context}&contextType=${FormContext.learner.contextType}`,
          header: {},
        },
        {
          fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.learner.context}&contextType=${FormContext.learner.contextType}`,
          header: {
            tenantid: localStorage.getItem('tenantId'),
          },
        },
      ]);
      console.log('responseForm', responseForm?.schema);

      const result = getMissingFields(responseForm?.schema, userData);
      console.log('result', result);
      const isPropertiesEmpty = Object.keys(result.properties).length === 0;
      return isPropertiesEmpty;
    }
  } catch (error) {
    console.error('error in login', error);
    throw error;
  }
};

export const updateUser = async (
  userId: string,
  { userData, customFields }: UserDetailParam
): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.userUpdate(userId);

  try {
    const response = await patch(apiUrl, { userData, customFields });
    return response;
  } catch (error) {
    console.error('error in fetching user details', error);
    return error;
  }
};
export const getUserDetails = async (
  userId: string | string[],
  fieldValue: boolean
): Promise<any> => {
  let apiUrl: string = API_ENDPOINTS.userRead(userId, fieldValue);
  // apiUrl = fieldValue ? `${apiUrl}?fieldvalue=true` : apiUrl;

  try {
    const response = await get(apiUrl);
    return response?.data;
  } catch (error) {
    console.error('error in fetching user details', error);
    return error;
  }
};
export const userNameExist = async (userData: any): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.suggestUsername;
  try {
    const response = await post(apiUrl, userData);
    return response?.data?.result;
  } catch (error) {
    console.error('error in getting in userNme exist', error);
    throw error;
  }
};
