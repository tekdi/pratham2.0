import { post } from '@shared-lib';

export const getAcademicYear = async (): Promise<any> => {
  const interfaceUrl =
    process.env.NEXT_PUBLIC_MIDDLEWARE_URL; 
  const apiUrl: string = `${interfaceUrl}/academicyears/list`;
  try {
    const response = await post(apiUrl, {});
    return response?.data?.result;
  } catch (error) {
    console.error('error in getting academicYearId', error);
  }
};
