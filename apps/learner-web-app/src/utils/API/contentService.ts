import { post, get } from '@shared-lib';

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
          //   status: ['live'],
          //   primaryCategory: [
          //     'Course',
          //     'Learning Resource',
          //     'Practice Question Set',
          //   ],
          //   channel: localStorage.getItem('channelId'),
        },
        fields: [
          'name',
          'appIcon',
          'description',
          'posterImage',
          'mimeType',
          'identifier',
          'leafNodes',
          'se_subjects',
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

export const fetchUserCoursesWithContent = async (
  userId: string,
  tenantId: string
) => {
  try {
    // First API call to get course IDs
    const API_URL = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/tracking/user_certificate/status/search`;

    const response = await post(API_URL, {
      filters: {
        status: ['completed', 'viewCertificate'],
        tenantId,
        userId,
      },
      offset: 0,
    });

    const courseIds = response?.data?.result?.data || [];
    const resultCourses = await ContentSearch({
      filters: {
        identifier: courseIds.map((c: any) => c.courseId),
        status: ['live'],
        primaryCategory: [
          'Course',
          'Learning Resource',
          'Practice Question Set',
        ],
        channel: localStorage.getItem('channelId'),
        ...(JSON.parse(localStorage.getItem('filter') || '{}') || {}),
      },
    });

    const allCourses = resultCourses?.result?.content || [];
    console.log(allCourses, 'resultCourses');

    // Group courses by topic
    const topicGroups = allCourses.reduce(
      (
        acc: { topic: string; courses: { name: string; courseId: string }[] }[],
        course: {
          name: string;
          identifier: string;
          se_subjects: string[];
        }
      ) => {
        course.se_subjects.forEach((topic: string) => {
          const existingGroup = acc.find((group) => group.topic === topic);
          if (existingGroup) {
            if (
              !existingGroup.courses.some(
                (c) => c.courseId === course.identifier
              )
            ) {
              existingGroup.courses.push({
                name: course.name,
                courseId: course.identifier,
              });
            }
          } else {
            acc.push({
              topic,
              courses: [
                {
                  name: course.name,
                  courseId: course.identifier,
                },
              ],
            });
          }
        });
        return acc;
      },
      []
    );

    return topicGroups;
  } catch (error) {
    console.error('Error fetching user courses with content:', error);
    throw error;
  }
};

export const createL2Course = async (userData: {
  first_name: string;
  middle_name: string;
  last_name: string;
  mother_name: string;
  gender: string;
  email_address: string;
  dob: string;
  qualification: string;
  phone_number: string;
  state: string;
  district: string;
  block: string;
  village: string;
  blood_group: string;
  userId: string;
  courseId: string;
  courseName: string;
  topicName: string;
}) => {
  try {
    const API_URL = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/prathamservice/v1/save-user-salesforce`;

    const response = await post(API_URL, userData);
    return response?.data;
  } catch (error) {
    console.error('Error saving user to Salesforce:', error);
    throw error;
  }
};
