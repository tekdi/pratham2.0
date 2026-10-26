import axios from 'axios';
import { KnowledgePartner } from '@learner/components/themantic/knowledgePartners/partnersData';

// Served by this app's route handlers in src/app/api/knowledge-partners
const KNOWLEDGE_PARTNERS_API_URL = '/api/knowledge-partners';

export const getKnowledgePartners = async (): Promise<KnowledgePartner[]> => {
  try {
    const response = await axios.get(KNOWLEDGE_PARTNERS_API_URL);
    return response?.data?.result ?? [];
  } catch (error) {
    console.error('Error in fetching knowledge partners', error);
    throw error;
  }
};

// Resolves to null when the partner does not exist (404)
export const getKnowledgePartnerById = async (
  partnerId: string
): Promise<KnowledgePartner | null> => {
  try {
    const response = await axios.get(
      `${KNOWLEDGE_PARTNERS_API_URL}/${encodeURIComponent(partnerId)}`
    );
    return response?.data?.result ?? null;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return null;
    }
    console.error('Error in fetching knowledge partner', error);
    throw error;
  }
};
