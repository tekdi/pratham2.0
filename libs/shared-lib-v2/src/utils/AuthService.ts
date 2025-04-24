import axios from 'axios'; // Ensure axios is imported
import { API_ENDPOINTS } from './APIEndpoints';

// Define the type for the input parameter
interface InstantIdParam {
  instantId: string;
}

// Define the type for the result of the API call
interface FilterContentResult {
  framework?: {
    categories?: any[];
  };
}

interface StaticFilterContentResult {
  objectCategoryDefinition?: {
    forms?: { 
      create?: {
        properties?: any;
      };
    };
  };
}

// Function to fetch filter content
export const filterContent = async ({ instantId }: InstantIdParam): Promise<FilterContentResult | undefined> => {
  const url = API_ENDPOINTS.framework(instantId); // Construct the URL using the instantId

  try {
    const result = await axios.get(url);

    if (result) {
      return result.data?.result as FilterContentResult;
    }
  } catch (e) {
    console.log('No internet available, retrieving offline data...', e);
  }
  return undefined;
};

// Function to fetch static filter content
export const staticFilterContent = async ({ instantId }: InstantIdParam): Promise<StaticFilterContentResult | undefined> => {
  const url = API_ENDPOINTS.actionObject // Hardcoded URL

  const payload = {
    request: {
      objectCategoryDefinition: {
        objectType: 'Collection',
        name: 'Course',
        channel: instantId,
      },
    },
  };

  try {
    const result = await axios.post(url, payload);

    if (result) {
      return result.data?.result as StaticFilterContentResult;
    }
  } catch (e) {
    console.log('Error while fetching static filter content', e);
  }
  return undefined;
};