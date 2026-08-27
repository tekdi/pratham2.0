import { post } from '@shared-lib';
import { RECOMMENDATIONS_ENDPOINT } from './EndUrls';
import {
  RecommendationsRequestPayload,
  RecommendationsApiResponse,
} from '../Interface';

export const getRecommendedContent = async (
  payload: RecommendationsRequestPayload
): Promise<RecommendationsApiResponse> => {
  try {
    const response = await post<RecommendationsRequestPayload>(
      RECOMMENDATIONS_ENDPOINT,
      payload
    );
    return response?.data;
  } catch (error) {
    console.error('Error fetching recommended content:', error);
    throw error;
  }
};
