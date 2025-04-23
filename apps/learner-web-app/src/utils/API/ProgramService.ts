import axios from 'axios';
import { API_ENDPOINTS } from './EndUrls';


export const getTenantInfo = async (): Promise<any> => {
  const apiUrl = API_ENDPOINTS.program;

  try {
    const response = await axios.get(apiUrl);

    return response?.data;
  } catch (error) {
    console.error('Error in fetching tenant info', error);
    throw null;
  }
};