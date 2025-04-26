import { post } from '@shared-lib';
import { get } from './RestClient';

export const fetchContent = async (identifier: any) => {
  try {
    const API_URL = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/api/content/v1/read/${identifier}`;
    const FIELDS = 'description,name,appIcon,posterImage';
    const LICENSE_DETAILS = 'name,description,url';
    const MODE = 'edit';
    const response = await get(
      `${API_URL}?fields=${FIELDS}&mode=${MODE}&licenseDetails=${LICENSE_DETAILS}`
    );
    console.log('response =====>', response);
    return response?.data?.result?.content;
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
};

export const ContentSearch = async ({
  query,
  filters,
  limit = 5,
  offset = 0,
}: {
  query?: string;
  filters?: object;
  limit?: number;
  offset?: number;
}) => {
  try {
    // Ensure the environment variable is defined
    const searchApiUrl = process.env.NEXT_PUBLIC_MIDDLEWARE_URL;
    if (!searchApiUrl) {
      throw new Error('Search API URL environment variable is not configured');
    }
    // Axios request configuration
    const data = {
      request: {
        filters: {
          ...filters,
          status: ['live'],
          primaryCategory: [
            'Course',
            'Learning Resource',
            'Practice Question Set',
          ],
          channel: localStorage.getItem('channelId'),
        },
        fields: [
          'name',
          'appIcon',
          'description',
          'posterImage',
          'mimeType',
          'identifier',
          'resourceType',
          'primaryCategory',
          'contentType',
          'trackable',
          'children',
          'leafNodes',
        ],
        query,
        limit,
        offset,
      },
    };

    // Execute the request
    const response = await post(
      `${searchApiUrl}/action/composite/v3/search`,
      data
    );
    const res = response?.data;

    return res;
  } catch (error) {
    console.error('Error in ContentSearch:', error);
    throw error;
  }
};
