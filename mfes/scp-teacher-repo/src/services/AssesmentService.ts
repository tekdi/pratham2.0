import {
  AssessmentListParam,
  GetDoIdServiceParam,
  IAssessmentStatusOptions,
  ISearchAssessment,
} from '../utils/Interfaces';
import { get, post } from './RestClient';
import { URL_CONFIG } from '../utils/url.config';
import API_ENDPOINTS from '../utils/API/APIEndpoints';

interface IAssessmentItemParam {
  answer: boolean;
  value: {
    body: string;
    value: number;
  };
}

interface IAssessmentItem {
  id: string;
  title: string;
  type: string;
  maxscore: number;
  params: IAssessmentItemParam[];
  sectionId: string;
}

interface IAssessmentResValue {
  label?: string;
  value: string | number;
  selected: boolean;
  AI_suggestion: string;
}

interface IAssessmentData {
  item: IAssessmentItem;
  index: number;
  pass: 'yes' | 'no';
  score: number;
  resvalues: IAssessmentResValue[];
  duration: number;
  sectionName: string;
}

interface IAssessmentSummarySection {
  sectionId: string;
  sectionName: string;
  data: IAssessmentData[];
}

interface ICreateAssessmentTracking {
  userId: string;
  courseId: string;
  contentId: string;
  attemptId: string;
  lastAttemptedOn: string;
  timeSpent: number;
  totalMaxScore: number;
  totalScore: number;
  unitId: string;
  assessmentSummary: IAssessmentSummarySection[];
}

interface IUpdateAssessmentScore {
  userId: string;
  courseId: string;
  contentId: string;
  attemptId: string;
  totalScore: number;
  assessmentSummary: {
    sectionId: string;
    sectionName: string;
    data: {
      item: {
        id: string;
      };
      score: number;
    }[];
  }[];
}

export const getAssessmentList = async ({
  sort,
  pagination,
  filters,
}: AssessmentListParam): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.assessmentList;
  try {
    const response = await post(apiUrl, { pagination, filters, sort });
    return response?.data;
  } catch (error) {
    console.error('error in getting Assessment List Service list', error);

    return error;
  }
};

export const getAssessmentDetails = async (doId: string) => {
  try {
    // Ensure the environment variable is defined
    const searchApiUrl = process.env.NEXT_PUBLIC_MIDDLEWARE_URL;
    if (!searchApiUrl) {
      throw new Error('Search API URL environment variable is not configured');
    }
    // Axios request configuration
    // const config: AxiosRequestConfig = {
    //   method: 'get',
    //   maxBodyLength: Infinity,
    //   url: `${searchApiUrl}/api/course/v1/hierarchy/${doId}`,
    //   params: params,
    // };

    // Execute the request
    const response = await get(
      `${searchApiUrl}/api/course/v1/hierarchy/${doId}?mode=edit`,
      { Authorization: `Bearer` }
    );
    const res = response?.data?.result?.content;

    return res;
  } catch (error) {
    console.error('Error in ContentSearch:', error);
    throw error;
  }
};

export const getDoIdForAssessmentDetails = async ({
  filters,
}: GetDoIdServiceParam): Promise<any> => {
  const apiUrl = `${URL_CONFIG.API.COMPOSITE_SEARCH}`;
  const data = {
    request: {
      filters: {
        program: filters.program,
        board: filters.board,
        // state: filters.state,
        assessmentType: filters.assessmentType,
        status: ['Live'],
        primaryCategory: ['Practice Question Set'],
      },
    },
  };

  try {
    const response = await post(apiUrl, data);
    return response?.data;
  } catch (error) {
    console.error('Error in getDoIdForAssessmentDetails Service', error);
    return error;
  }
};

// answer sheet submissions
export const answerSheetSubmissions = async ({
  userId,
  questionSetId,
  identifier,
  fileUrls,
}: {
  userId: string;
  questionSetId: string;
  identifier: string;
  fileUrls: string[];
}) => {
  const apiURL = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/tracking/answer-sheet-submissions/create`;

  try {
    const response = await post(apiURL, {
      userId,
      questionSetId,
      identifier,
      fileUrls,
    });
    return response?.data;
  } catch (error) {
    console.error('Error in answer sheet submissions:', error);
    throw error;
  }
};

export const getAssessmentStatus = async (body: IAssessmentStatusOptions) => {
  const apiUrl: string = API_ENDPOINTS.assessmentSearchStatus;
  try {
    const response = await post(apiUrl, body);
    return response?.data?.data;
  } catch (error) {
    console.error('error in getting Assessment Status Service list', error);

    return error;
  }
};

export const searchAssessment = async (body: ISearchAssessment) => {
  const apiUrl: string = API_ENDPOINTS.assessmentSearch;
  try {
    const response = await post(apiUrl, body);
    return response?.data?.data;
  } catch (error) {
    console.error('error in getting Assessment Status Service list', error);

    return error;
  }
};

export const getAssessmentTracking = async (params: ISearchAssessment) => {
  const apiUrl = API_ENDPOINTS.assessmentSearch;
  try {
    const response = await post(apiUrl, params);
    return response?.data;
  } catch (error) {
    console.error('Error in getting assessment tracking:', error);
    throw error;
  }
};

export const createAssessmentTracking = async (
  data: ICreateAssessmentTracking
) => {
  const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/tracking/assessment/create`;
  try {
    const response = await post(apiUrl, data);
    return response?.data;
  } catch (error) {
    console.error('Error in creating assessment tracking:', error);
    throw error;
  }
};

export const updateAssessmentScore = async (data: IUpdateAssessmentScore) => {
  const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/tracking/assessment/create`;
  try {
    const response = await post(apiUrl, data);
    return response?.data;
  } catch (error) {
    console.error('Error in updating assessment score:', error);
    throw error;
  }
};

export const getOfflineAssessmentStatus = async (data: {
  userIds: string[];
  questionSetId: string;
}) => {
  const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/tracking/assessment/offline-assessment-status`;
  try {
    const response = await post(apiUrl, data);
    return response?.data;
  } catch (error) {
    console.error('Error in getting offline assessment status:', error);
    throw error;
  }
};

export const searchAiAssessment = async (data: {
  question_set_id: string[];
}) => {
  const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/tracking/ai-assessment/search`;
  try {
    const response = await post(apiUrl, data);
    return response?.data;
  } catch (error) {
    console.error('Error in searching ai assessment:', error);
    throw error;
  }
};

export const getOfflineAssessmentDetails = async ({
  filters,
}: GetDoIdServiceParam): Promise<any> => {
  const apiUrl = `${URL_CONFIG.API.COMPOSITE_SEARCH}`;
  const data = {
    request: {
      filters: {
        program: filters.program,
        board: filters.board,
        // state: filters.state,
        assessmentType: filters.assessmentType,
        status: ['Live'],
        primaryCategory: ['Practice Question Set'],
      },
    },
  };

  try {
    const response1 = await post(apiUrl, data);
    const response = await searchAiAssessment({
      question_set_id: response1?.data?.result?.QuestionSet?.map(
        (item: any) => item.identifier
      ),
    });
    const QuestionSet = response1?.data?.result?.QuestionSet?.filter(
      (item: any) =>
        response.data.find(
          (sub: any) => item.identifier === sub.question_set_id
        )
    );

    return {
      result: {
        ...response1?.data?.result,
        QuestionSet,
        count: QuestionSet.length,
      },
      responseCode: response1?.data?.responseCode,
    };
  } catch (error) {
    console.error('Error in getDoIdForAssessmentDetails Service', error);
    return error;
  }
};
