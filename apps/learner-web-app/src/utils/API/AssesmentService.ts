import { get, post } from './RestClient';
import { URL_CONFIG } from '../app.constant';
import API_ENDPOINTS from './EndUrls';

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

export interface AssessmentSection {
  sectionId: string;
  sectionName: string;
  data: Array<{
    item: {
      id: string;
      title: string;
      type: string;
      maxscore: number;
      params: any[];
      sectionId: string;
    };
    index: number;
    pass: string;
    score: number;
    resvalues: Array<{
      label?: string;
      value: any;
      selected: boolean;
      AI_suggestion: string;
    }>;
    duration: number;
    sectionName: string;
  }>;
}

export interface UpdateAssessmentScorePayload {
  userId: string;
  courseId: string;
  contentId: string;
  attemptId: string;
  lastAttemptedOn: string;
  timeSpent: number;
  totalMaxScore: number;
  totalScore: number;
  unitId: string;
  assessmentSummary: AssessmentSection[];
  submitedBy?: string;
}

export interface AssessmentRecord {
  assessmentTrackingId: string;
  userId: string;
  courseId: string;
  contentId: string;
  attemptId: string;
  createdOn: string;
  lastAttemptedOn: string;
  assessmentSummary: {
    data: {
      item: {
        id: string;
        title: string;
        maxscore: number;
        sectionId: string;
      };
      pass: string;
      duration: number;
      score: number;
      resvalues: Array<{
        value: any;
        selected: boolean;
        AI_suggestion: string;
      }>;
    }[];
  }[];
  totalMaxScore: number;
  totalScore: number;
  updatedOn: string;
  timeSpent: string;
  unitId: string;
  submitedBy: string;
}

interface IAssessmentStatusOptions {
  userId: string[];
  courseId: string[];
  unitId: string[];
  contentId: string[];
}

interface ISearchAssessment {
  userId: string;
  courseId: string;
  unitId: string;
  contentId: string;
}

export const getAssessmentDetails = async (doId: string) => {
  try {
    // Ensure the environment variable is defined
    const searchApiUrl = process.env.NEXT_PUBLIC_MIDDLEWARE_URL;
    if (!searchApiUrl) {
      throw new Error('Search API URL environment variable is not configured');
    }

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

// answer sheet submissions
export const answerSheetSubmissions = async ({
  userId,
  questionSetId,
  identifier,
  fileUrls,
  createdBy,
  parentId,
}: {
  userId: string;
  questionSetId: string;
  identifier: string;
  fileUrls: string[];
  createdBy: string;
  parentId?: string;
}) => {
  const apiURL = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/tracking/answer-sheet-submissions/create`;

  try {
    const response = await post(apiURL, {
      userId,
      questionSetId,
      identifier,
      fileUrls,
      createdBy,
      parentId,
    });
    return response?.data;
  } catch (error) {
    console.error('Error in answer sheet submissions:', error);
    throw error;
  }
};

export const getAssessmentStatus = async (body: IAssessmentStatusOptions) => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/tracking/assessment/search`;
  try {
    const response = await post(apiUrl, body);
    return response?.data?.data;
  } catch (error) {
    console.error('error in getting Assessment Status Service list', error);

    return error;
  }
};

export const searchAssessment = async (body: ISearchAssessment) => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/tracking/assessment/search`;
  try {
    const response = await post(apiUrl, body);
    return response?.data?.data;
  } catch (error) {
    console.error('error in getting Assessment Status Service list', error);

    return error;
  }
};

export const getAssessmentTracking = async (params: ISearchAssessment) => {
  const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/tracking/assessment/search`;
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

export const updateAssessmentScore = async (
  payload: UpdateAssessmentScorePayload
): Promise<any> => {
  try {
    const response = await post(
      `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/tracking/assessment/create`,
      payload
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getOfflineAssessmentStatus = async (data: {
  userIds: string[];
  questionSetId: string;
  parentId?: string | null;
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

const API_URL = process.env.NEXT_PUBLIC_MIDDLEWARE_URL;
export const hierarchyContent = async (content_do_id: string) => {
  const url = `${API_URL}/action/questionset/v2/hierarchy/` + content_do_id;

  let api_response = null;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      api_response = await response.json();
      return api_response;
    } else {
      console.error('Error fetching hierarchy content:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Error fetching hierarchy content:', error);
    return null;
  }
};

