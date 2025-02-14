import { post } from './RestClient';
import API_ENDPOINTS from "./APIEndpoints";

export const getAcademicYear = async (): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}${API_ENDPOINTS.academicYearsList}`;
  try {
    const response = await post(apiUrl,{});
    return response?.data?.result;
  } catch (error) {
    console.error('error in getting academicYearId', error);
  }
};
