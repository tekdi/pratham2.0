import { post } from '@shared-lib';
import { URL_CONFIG } from '../../utils/url.config';

export interface CourseNameResult {
  identifier: string;
  name: string;
}

// Resolves course identifiers -> display names for the L2 Interested Queue
// table's "Assigned Domain & Course" column. Modeled on admin-app-repo's
// getCourseName(), same composite-search endpoint, filtering by known ids
// (display-time lookup) rather than by domain (that's the schema-driven
// search field in L2QueueSearchSchema/L2QueueAssignSchema instead).
export const getCourseNames = async (
  courseIds: string[]
): Promise<CourseNameResult[]> => {
  if (courseIds.length === 0) return [];
  try {
    const response = await post(URL_CONFIG.API.COMPOSITE_SEARCH, {
      request: {
        filters: { identifier: [...courseIds] },
        fields: ['name'],
      },
    });
    return response?.data?.result?.content ?? [];
  } catch (error) {
    console.error('Error fetching course names:', error);
    return [];
  }
};
