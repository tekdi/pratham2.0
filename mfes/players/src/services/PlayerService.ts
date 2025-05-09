import { ContentCreate } from '../utils/Interface';
import { URL_CONFIG } from '../utils/url.config';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
export const fetchContent = async (identifier: any) => {
  try {
    const API_URL = `${URL_CONFIG.API.CONTENT_READ}${identifier}`;
    const FIELDS = URL_CONFIG.PARAMS.CONTENT_GET;
    const LICENSE_DETAILS = URL_CONFIG.PARAMS.LICENSE_DETAILS;
    const MODE = 'edit';
    const response = await axios.get(
      `${API_URL}?fields=${FIELDS}&mode=${MODE}&licenseDetails=${LICENSE_DETAILS}`
    );

    return response?.data?.result?.content;
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
};

export const fetchBulkContents = async (identifiers: string[]) => {
  try {
    const options = {
      request: {
        filters: {
          identifier: identifiers,
        },
        fields: [
          'name',
          'appIcon',
          'medium',
          'subject',
          'resourceType',
          'contentType',
          'organisation',
          'topic',
          'mimeType',
          'trackable',
          'gradeLevel',
        ],
      },
    };
    const response = await axios.post(URL_CONFIG.API.COMPOSITE_SEARCH, options);

    const result = response?.data?.result;
    if (response?.data?.result?.QuestionSet?.length) {
      const contents = result?.content
        ? [...result.content, ...result.QuestionSet]
        : [...result.QuestionSet];
      result.content = contents;
    }

    return result.content;
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
};

export const getHierarchy = async (identifier: any) => {
  try {
    const API_URL = `${URL_CONFIG.API.HIERARCHY_API}${identifier}`;
    const response = await axios.get(API_URL);

    return response?.data?.result?.content || response?.data?.result;
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
};

export const getQumlData = async (identifier: any) => {
  try {
    const API_URL = `${URL_CONFIG.API.QUESTIONSET_READ}${identifier}`;
    const FIELDS = URL_CONFIG.PARAMS.HIERARCHY_FEILDS;
    const response = await axios.get(`${API_URL}?fields=${FIELDS}`);

    return response?.data?.result?.content || response?.data?.result;
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
};

export const createContentTracking = async (reqBody: ContentCreate) => {
  const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/tracking/content/create`;
  try {
    const response = await axios.post(apiUrl, reqBody);
    return response?.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createAssessmentTracking = async ({
  identifierWithoutImg,
  scoreDetails,
  courseId,
  unitId,
  userId: propUserId,
  maxScore,
  seconds,
}: any) => {
  try {
    let userId = '';
    if (propUserId) {
      userId = propUserId;
    } else if (typeof window !== 'undefined' && window.localStorage) {
      userId = localStorage.getItem('userId') ?? '';
    }
    const attemptId = uuidv4();
    let totalScore = 0;
    if (Array.isArray(scoreDetails)) {
      totalScore = scoreDetails.reduce((sectionTotal, section) => {
        const sectionScore = section.data.reduce(
          (itemTotal: any, item: any) => {
            return itemTotal + (item.score || 0);
          },
          0
        );
        return sectionTotal + sectionScore;
      }, 0);
    } else {
      console.error('Parsed scoreDetails is not an array');
      throw new Error('Invalid scoreDetails format');
    }
    const lastAttemptedOn = new Date().toISOString();
    if (userId !== undefined || userId !== '') {
      const data: any = {
        userId: userId,
        contentId: identifierWithoutImg,
        courseId: courseId && unitId ? courseId : identifierWithoutImg,
        unitId: courseId && unitId ? unitId : identifierWithoutImg,
        attemptId,
        lastAttemptedOn,
        timeSpent: seconds ?? 0,
        totalMaxScore: maxScore ?? 0,
        totalScore,
        assessmentSummary: scoreDetails,
      };
      const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/tracking/assessment/create`;

      const response = await axios.post(apiUrl, data);
      console.log('Assessment tracking created:', response.data);
      return response.data;
    }
  } catch (error) {
    console.error('Error in contentWithTelemetryData:', error);
  }
};
