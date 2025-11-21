import API_ENDPOINTS from '../utils/API/APIEndpoints';
import { post } from '@shared-lib';

export interface ContentStatus {
  userId: string[];
  courseId: string[];
  unitId: string[];
  contentId: string[];
}

export interface ContentCreate {
  userId: string;
  contentId: string;
  courseId: string;
  unitId: string;
  contentType: string;
  contentMime: string;
  lastAccessOn: string;
  detailsObject: any[];
}

export const getContentTrackingStatus = async (reqBody: ContentStatus) => {
  const apiUrl: string = API_ENDPOINTS.contentSearchStatus || `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/tracking/content/search/status`;
  try {
    const response = await post(apiUrl, reqBody);
    return response?.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createContentTracking = async (reqBody: ContentCreate) => {
  const apiUrl: string = API_ENDPOINTS.contentCreate || `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/tracking/content/create`;
  try {
    const response = await post(apiUrl, reqBody);
    return response?.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const fetchUserCertificateStatus = async (userIds: string[], courseIds: string[]) => {
  try {
    const API_URL = `${API_ENDPOINTS.userCertificateStatusSearch}`;
    const data = {
      filters: {
        userId: userIds,
        courseId: courseIds
      }
    };

    const response = await post(API_URL, data);
    return response?.data?.result || response?.data;
  } catch (error) {
    console.error('Error fetching user certificate status:', error);
    throw error;
  }
};

