import { fetchForm } from '@shared-lib-v2/DynamicForm/components/DynamicFormCallback';
import { API_ENDPOINTS } from './EndUrls';
import { post, patch } from './RestClient';
import { FormContext } from '@shared-lib-v2/DynamicForm/components/DynamicFormConstant';
import { getMissingFields, isUnderEighteen } from '../helper';
import { get } from '@shared-lib';
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
  username,
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
    } else if (username) {
      response = await post(apiUrl, { username });
    }

    return response?.data;
  } catch (error) {
    console.error('error in login', error);
    throw error;
  }
};
function setLocalStorageFromCustomFields(fields: any) {
  const getFieldId = (labelKey: any) => {
    const field = fields?.find?.((f: any) => f.label === labelKey);
    console.log("statename",field?.selectedValues?.[0]?.value )  
  //  localStorage.setItem("stateName", field?.selectedValues?.[0]?.value)
     return field?.selectedValues?.[0]?.id ?? null;
  };
   const getFieldLabel = (labelKey: any) => {
    const field = fields?.find?.((f: any) => f.label === labelKey);
    console.log("statename",field?.selectedValues?.[0]?.value )  
    // localStorage.setItem("stateName", field?.selectedValues?.[0]?.value)
     return field?.selectedValues?.[0]?.value ?? null;
  };

  const stateId = getFieldId('STATE');
  const stateName=getFieldLabel('STATE')
  const districtId = getFieldId('DISTRICT');
  const blockId = getFieldId('BLOCK');

  if (stateId) 
    {localStorage.setItem('mfe_state', String(stateId));
      localStorage.setItem('stateId', String(stateId));
    }
  if (districtId) localStorage.setItem('mfe_district', String(districtId));
  if(stateName)  localStorage.setItem("stateName", stateName)
  if (blockId) localStorage.setItem('mfe_block', String(blockId));
  localStorage.setItem('roleName' , "Learner")

}

export const profileComplitionCheck = async (): Promise<any> => {
  const userId = localStorage.getItem('userId');
  try {
    if (userId) {
      const apiUrl = API_ENDPOINTS.userRead(userId, true);
      const response = await get(apiUrl, {
        tenantId: localStorage.getItem('tenantId'),
      });
      const userData = response?.data?.result?.userData;
      const isVolunteerField = userData?.customFields?.find(
        (field: any) => field.label === 'IS_VOLUNTEER'
      );
      console.log(isVolunteerField);
      const isVolunteer = isVolunteerField?.selectedValues?.[0] === 'yes';
      localStorage.setItem('isVolunteer', JSON.stringify(isVolunteer));

      setLocalStorageFromCustomFields(userData?.customFields);

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
      console.log('userData', userData);
      if (!isUnderEighteen(userData?.dob)) {
        delete responseForm?.schema.properties.guardian_relation;
        delete responseForm?.schema.properties.guardian_name;
        delete responseForm?.schema.properties.parent_phone;
      } else {
        delete responseForm?.schema.properties.mobile;
      }
      const result = getMissingFields(responseForm?.schema, userData);
      console.log('result', result);
      delete result?.properties?.is_volunteer;

const isPropertiesEmpty = Object.keys(result?.properties || {}).length === 0;
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
