import { MasterCategory } from '../interfaces/MasterCategoryInterface';
import { URL_CONFIG } from '../utils/url.config';
import { isCamelCase } from '../utils/HelperService';
import { post } from './RestClient';

/**
 * Service to manage master categories.
 * This service provides functions to fetch, create, and manipulate master categories.
 */

// Fetches all master categories from the API
export async function fetchMasterCategories(): Promise<MasterCategory[]> {
  const requestBody = {
    request: {
      filters: {
        status: ['Draft', 'Live'],
        objectType: 'Category',
      },
    },
  };

  try {
    const response = await post(
      URL_CONFIG.API.MASTER_CATEGORY_SEARCH,
      requestBody
    );
    const data = response.data;

    if (!Array.isArray(data?.result?.Category)) {
      throw new Error('Malformed API response');
    }

    return data.result.Category as MasterCategory[];
  } catch (error: unknown) {
    const axiosError = error as { response?: { status?: number } };
    const status = axiosError?.response?.status;
    throw new Error(`Error: ${status || 'Unknown error'}`);
  }
}

// Creates a new master category with the provided details
export async function createMasterCategory(category: {
  name: string;
  code: string;
  description: string;
  targetIdFieldName: string;
  searchLabelFieldName: string;
  searchIdFieldName: string;
  orgIdFieldName: string;
}) {
  // Validate that the code is in camelCase format
  if (!isCamelCase(category.code)) {
    throw new Error(
      'Code must be in camelCase format (e.g., "myCategory", "userProfile")'
    );
  }

  const requestBody = {
    request: {
      category,
    },
  };

  try {
    const response = await post(
      URL_CONFIG.API.MASTER_CATEGORY_CREATE,
      requestBody
    );
    const data = response.data;

    if (data.responseCode !== 'OK') {
      throw new Error(data?.params?.errmsg ?? 'Failed to create category');
    }

    return data;
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { status?: number; data?: { params?: { errmsg?: string } } };
    };
    const status = axiosError?.response?.status;
    const errorMessage = axiosError?.response?.data?.params?.errmsg;

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    throw new Error(`Error: ${status || 'Unknown error'}`);
  }
}

// Generates field names for a master category based on its code
export function generateMasterCategoryFields(code: string) {
  return {
    targetIdFieldName: `target${capitalizeFirst(code)}Ids`,
    searchLabelFieldName: `se_${pluralize(code)}`,
    searchIdFieldName: `se_${code}Ids`,
    orgIdFieldName: `${code}Ids`,
  };
}

// Capitalizes the first letter of a string
function capitalizeFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function pluralize(str: string) {
  // Simple pluralization: add 's' if not already ending with 's'
  return str.endsWith('s') ? str : str + 's';
}
