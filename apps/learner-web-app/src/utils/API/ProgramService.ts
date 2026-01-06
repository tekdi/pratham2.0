import axios from 'axios';
import { API_ENDPOINTS } from './EndUrls';
import { post } from '@shared-lib';

export const getTenantInfo = async (): Promise<any> => {
  const apiUrl = API_ENDPOINTS.program;

  try {
    const response = await axios.get(apiUrl);
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    const matchingTenants =
      response?.data?.result?.filter((tenant: any) =>
        tenant?.params?.uiConfig?.enable_domain?.includes(currentOrigin)
      ) || [];
    const programsData =
      matchingTenants.flatMap((t: any) => t?.children || []) || [];
      console.log("programsData", programsData)
    return { result: programsData };
  } catch (error) {
    console.error('Error in fetching tenant info', error);
    throw null;
  }
};

export const FetchDoIds = async (userId: any[]): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.fetchCourseId;

  try {
    const response = await post(apiUrl, {
      userId: userId,
    });
    return response?.data;
  } catch (error) {
    console.error('error in login', error);
    throw error;
  }
};

export const getPrathamTenantId = async (): Promise<string | null> => {
  const apiUrl = API_ENDPOINTS.program;
  try {
    const response = await axios.get(apiUrl);
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    const matchingTenants =
      response?.data?.result?.filter((tenant: any) =>
        tenant?.params?.uiConfig?.enable_domain?.includes(currentOrigin)
      ) || [];
    return matchingTenants[0]?.tenantId || null;
  } catch (error) {
    console.error('Error in fetching tenant info', error);
    return null;
  }
};


export const getTenantIdByName = async (name: string): Promise<string | null> => {
  const apiUrl = API_ENDPOINTS.program;
  try {
    const response = await axios.get(apiUrl);
    let matchingTenants;
    if(name === 'Pratham') {
     matchingTenants =
      response?.data?.result?.filter((tenant: any) =>
        tenant?.name === name
      ) || [];
    }
    else{
      const PrathamTenant =
      response?.data?.result?.filter((tenant: any) =>
        tenant?.name === 'Pratham'
      ) || [];
      matchingTenants =
      PrathamTenant[0]?.children?.filter((tenant: any) =>
        tenant?.name === name
      ) || []; 
    }

    return matchingTenants[0]?.tenantId || null;


  } catch (error) {
    console.error('Error in fetching tenant info', error);
    return null;
  }
};