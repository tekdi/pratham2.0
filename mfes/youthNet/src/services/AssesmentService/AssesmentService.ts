import { post } from "@/services/RestClient";
import {
  GetDoIdServiceParam
} from '../../utils/Interfaces';
import { URL_CONFIG } from "../../utils/url.config";

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

  // Build filters dynamically
  const requestFilters: any = {
    program: filters.program,
    board: filters.board,
    status: ['Live'],
    primaryCategory: ['Practice Question Set'],
  };

  // Optional filters
  if (filters.assessmentType) {
    requestFilters.assessmentType = filters.assessmentType;
  }

  if (filters.evaluationType) {
    requestFilters.evaluationType = filters.evaluationType;
  }

  const data = {
    request: {
      filters: requestFilters,
    },
  };

  try {
    const response1 = await post(apiUrl, data);

    // 🚀 If evaluationType is provided, return directly without extra API call
    if (filters.evaluationType) {
      return {
        result: {
          ...response1?.data?.result,
        },
        responseCode: response1?.data?.responseCode,
      };
    }

    // ✅ Default behavior (when evaluationType not provided)
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