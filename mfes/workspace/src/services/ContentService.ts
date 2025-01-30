import {
  getLocalStoredUserId,
  getLocalStoredUserRole,
} from './LocalStorageService';
import { delApi, get, post } from './RestClient';
import axios from 'axios';
import {
  MIME_TYPE,
  CHANNEL_ID,
  TENANT_ID,
  FRAMEWORK_ID,
} from '../utils/app.config';
import { v4 as uuidv4 } from 'uuid';
import { PrimaryCategoryValue, Role } from '../utils/app.constant';

const userId = getLocalStoredUserId();
console.log('userId ==>', userId);

export const getPrimaryCategory = async () => {
  const apiURL = `/api/channel/v1/read/${CHANNEL_ID}`;
  try {
    const response = await get(apiURL);
    return response?.data?.result;
  } catch (error) {
    throw error;
  }
};

const defaultReqBody = {
  request: {
    filters: {
      createdBy: userId,
    },
    sort_by: {
      lastUpdatedOn: 'desc',
    },
  },
};
const upForReviewReqBody = {
  request: {
    filters: {
      //  createdBy: { userId},
    },
    sort_by: {
      lastUpdatedOn: 'desc',
    },
  },
};
const getReqBodyWithStatus = (
  status: string[],
  query: string,
  limit: number,
  offset: number,
  primaryCategory: any,
  sort_by: any,
  contentType?: string,
  state?: string
) => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    var PrimaryCategory =
      JSON.parse(localStorage.getItem('PrimaryCategory') as string) ||
      PrimaryCategoryValue;
  }
  primaryCategory =
    primaryCategory.length === 0 ? PrimaryCategory : primaryCategory;
  if (contentType === 'discover-contents') {
    const userRole = getLocalStoredUserRole();

    if (state) {
      return {
        ...upForReviewReqBody,
        request: {
          ...upForReviewReqBody.request,
          filters: {
            ...upForReviewReqBody.request.filters,
            status,
            primaryCategory,
            createdBy: { '!=': getLocalStoredUserId() },
            state: state,
          },

          query,
          limit,
          offset,
          sort_by,
        },
      };
    }

    return {
      ...upForReviewReqBody,
      request: {
        ...upForReviewReqBody.request,
        filters: {
          ...upForReviewReqBody.request.filters,
          status,
          primaryCategory,
          createdBy: { '!=': getLocalStoredUserId() },
        },

        query,
        limit,
        offset,
        sort_by,
      },
    };
  } else if (contentType === 'upReview') {
    return {
      ...upForReviewReqBody,
      request: {
        ...upForReviewReqBody.request,
        filters: {
          ...upForReviewReqBody.request.filters,
          status,
          primaryCategory,
        },
        query,
        limit,
        offset,
        sort_by,
      },
    };
  }

  return {
    ...defaultReqBody,
    request: {
      ...defaultReqBody.request,
      filters: {
        ...defaultReqBody.request.filters,
        status,
        primaryCategory,
      },
      query,
      limit,
      offset,
      sort_by,
    },
  };
};

export const getContent = async (
  status: string[],
  query: string,
  limit: number,
  offset: number,
  primaryCategory: string[],
  sort_by: any,
  contentType?: string,
  state?: string
) => {
  const apiURL = '/action/composite/v3/search';
  try {
    const reqBody = getReqBodyWithStatus(
      status,
      query,
      limit,
      offset,
      primaryCategory,
      sort_by,
      contentType,
      state
    );
    const response = await post(apiURL, reqBody);
    return response?.data?.result;
  } catch (error) {
    throw error;
  }
};

export const createQuestionSet = async () => {
  const apiURL = `/action/questionset/v2/create`;
  const reqBody = {
    request: {
      questionset: {
        name: 'Untitled QuestionSet',
        mimeType: 'application/vnd.sunbird.questionset',
        primaryCategory: 'Practice Question Set',
        code: uuidv4(),
        createdBy: userId,
        framework: FRAMEWORK_ID,
      },
    },
  };

  try {
    const response = await axios.post(apiURL, reqBody, {
      headers: {
        'Content-Type': 'application/json',
        tenantId: TENANT_ID,
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const deleteContent = async (identifier: string, mimeType: string) => {
  const questionsetRetireURL = `/action/questionset/v2/retire/${identifier}`;
  const contentRetireURL = `/action/content/v3/retire/${identifier}`;
  let apiURL = '';
  if (mimeType === MIME_TYPE.QUESTIONSET_MIME_TYPE) {
    apiURL = questionsetRetireURL;
  } else if (
    mimeType !== MIME_TYPE.QUESTIONSET_MIME_TYPE
    // mimeType !== MIME_TYPE.COLLECTION_MIME_TYPE
  ) {
    apiURL = contentRetireURL;
  }
  try {
    const response = await delApi(apiURL); // Assuming you have a 'del' method that handles DELETE
    return response?.data?.result;
  } catch (error) {
    throw error;
  }
};

export const createCourse = async (userId: any) => {
  const apiURL = `/action/content/v3/create`;

  const reqBody = {
    request: {
      content: {
        code: uuidv4(), // Generate a unique ID for 'code'
        name: 'Untitled Course',
        description: 'Enter description for Course',
        createdBy: userId,
        createdFor: [CHANNEL_ID],
        mimeType: MIME_TYPE.COURSE_MIME_TYPE,
        resourceType: 'Course',
        primaryCategory: 'Course',
        contentType: 'Course',
        framework: FRAMEWORK_ID,
      },
    },
  };

  try {
    const response = await axios.post(apiURL, reqBody, {});
    return response?.data;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const publishContent = async (identifier: any) => {
  const requestBody = {
    request: {
      content: {
        lastPublishedBy: userId,
      },
    },
  };

  try {
    const response = await axios.post(
      `/action/content/v3/publish/${identifier}`,
      requestBody
    );
    return response.data;
  } catch (error) {
    console.error('Error during publishing:', error);
    throw error;
  }
};

export const submitComment = async (identifier: any, comment: any) => {
  const requestBody = {
    request: {
      content: {
        rejectComment: comment,
      },
    },
  };

  try {
    const response = await axios.post(
      `/action/content/v3/reject/${identifier}`,
      requestBody
    );
    return response.data;
  } catch (error) {
    console.error('Error submitting comment:', error);
    throw error;
  }
};

export const getContentHierarchy = async ({
  doId,
}: {
  doId: string;
}): Promise<any> => {
  const apiUrl: string = `/action/content/v3/hierarchy/${doId}`;

  try {
    console.log('Request data', apiUrl);
    const response = await get(apiUrl);
    // console.log('response', response);
    return response;
  } catch (error) {
    console.error('Error in getContentHierarchy Service', error);
    throw error;
  }
};
export const getFrameworkDetails = async (): Promise<any> => {
  const apiUrl: string = `/api/framework/v1/read/${FRAMEWORK_ID}`;

  try {
    const response = await axios.get(apiUrl);
    return response?.data;
  } catch (error) {
    console.error('Error in getting Framework Details', error);
    return error;
  }
};
