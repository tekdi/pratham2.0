import {
  publishFramework,
  publishFrameworkAfterBatchOperation,
  AxiosErrorType,
} from '../utils/HelperService';
import { post, patch, delApi } from './RestClient';
import { URL_CONFIG } from '../utils/url.config';

export interface TermInput {
  name: string;
  code: string;
  description: string;
  label: string;
  categoryCode: string;
}

export interface UpdateTermInput {
  identifier: string;
  code: string;
  categoryCode: string;
  description: string;
  name: string;
  label: string;
}

export async function createTerm(
  term: TermInput,
  frameworkCode: string
): Promise<unknown> {
  const requestBody = {
    request: {
      term: {
        name: term.name,
        label: term.label,
        description: term.description,
        code: term.code,
      },
    },
  };

  const url = `${URL_CONFIG.API.TERM_CREATE}?framework=${frameworkCode}&category=${term.categoryCode}`;

  try {
    const response = await post(url, requestBody);
    const data = response.data;

    if (data.responseCode !== 'OK') {
      throw new Error(data?.params?.errmsg ?? 'Failed to create term');
    }

    return data;
  } catch (error: unknown) {
    const axiosError = error as AxiosErrorType;
    const status = axiosError?.response?.status;

    // Handle specific HTTP status codes
    let errorMessage: string;
    switch (status) {
      case 401:
        errorMessage =
          'Authorization failed. Please check your credentials and try again.';
        break;
      case 403:
        errorMessage =
          'Access forbidden. You do not have permission to create terms.';
        break;
      case 404:
        errorMessage =
          'Resource not found. Please check the codes and try again.';
        break;
      case 500:
        errorMessage =
          'Server error occurred while creating term. Please try again later.';
        break;
      default:
        errorMessage = `Failed to create term (Status: ${status || 'Unknown'})`;
    }

    // Try to get error details from response
    const errorData = axiosError?.response?.data;
    if (errorData?.params?.errmsg || errorData?.params?.err) {
      errorMessage = errorData.params.errmsg ?? errorData.params.err;
    } else if (errorData?.message) {
      errorMessage = errorData.message;
    }

    throw new Error(errorMessage);
  }
}

export async function updateTerm(
  input: UpdateTermInput,
  frameworkCode: string,
  channelId: string
): Promise<unknown> {
  const requestBody = {
    request: {
      term: {
        description: input.description,
        name: input.name,
        label: input.label,
      },
    },
  };

  const url = `${URL_CONFIG.API.TERM_UPDATE}/${input.code}?framework=${frameworkCode}&category=${input.categoryCode}`;

  try {
    const response = await patch(url, requestBody, {
      'X-Channel-Id': channelId,
    });
    const data = response.data;

    if (data.responseCode !== 'OK') {
      const errorMessage =
        data?.params?.errmsg ?? 'Failed to update term - invalid response';
      throw new Error(errorMessage);
    }

    // Publish the framework after successful update
    try {
      await publishFramework(frameworkCode, channelId);
    } catch (publishError) {
      console.warn(
        'Failed to publish framework after term update:',
        publishError
      );
      // Don't throw here as the main update was successful
    }

    return data;
  } catch (error: unknown) {
    // If it's already a term update error, re-throw it
    if (
      error instanceof Error &&
      error.message.includes('Failed to update term')
    ) {
      throw error;
    }

    const axiosError = error as AxiosErrorType;
    const status = axiosError?.response?.status;

    // Handle specific HTTP status codes
    let errorMessage: string;
    switch (status) {
      case 401:
        errorMessage =
          'Authorization failed. Please check your credentials and try again.';
        break;
      case 403:
        errorMessage =
          'Access forbidden. You do not have permission to update terms.';
        break;
      case 404:
        errorMessage =
          'Resource not found. Please check the codes and try again.';
        break;
      case 500:
        errorMessage =
          'Server error occurred while updating term. Please try again later.';
        break;
      default:
        errorMessage = `Failed to update term (Status: ${status || 'Unknown'})`;
    }

    // Try to get error details from response
    const errorData = axiosError?.response?.data;
    if (errorData?.params?.errmsg || errorData?.params?.err) {
      errorMessage = errorData.params.errmsg ?? errorData.params.err;
    } else if (errorData?.message) {
      errorMessage = errorData.message;
    }

    throw new Error(errorMessage);
  }
}

export async function batchCreateTerms(
  terms: TermInput[],
  frameworkCode: string
): Promise<
  { status: 'success' | 'failed'; message: string; term: TermInput }[]
> {
  const results: {
    status: 'success' | 'failed';
    message: string;
    term: TermInput;
  }[] = [];

  for (const term of terms) {
    try {
      await createTerm(term, frameworkCode);
      results.push({
        status: 'success',
        message: 'Successfully created',
        term,
      });
    } catch (err: unknown) {
      let msg = 'Failed to create term';
      if (err instanceof Error) msg = err.message;
      results.push({
        status: 'failed',
        message: msg,
        term,
      });
    }
  }

  // Get channelId from stores and publish the framework after all terms are created
  const successfulTerms = results.filter(
    (result) => result.status === 'success'
  );
  if (successfulTerms.length > 0) {
    await publishFrameworkAfterBatchOperation(frameworkCode, 'term creation');
  }

  return results;
}

export async function retryCreateTerm(
  term: TermInput,
  frameworkCode: string
): Promise<unknown> {
  return createTerm(term, frameworkCode);
}

export const deleteTerm = async (
  termCode: string,
  frameworkId: string,
  categoryCode: string,
  channelId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const headers = {
      'X-Channel-Id': channelId,
    };

    const url = `${URL_CONFIG.API.TERM_DELETE}/${termCode}?framework=${frameworkId}&category=${categoryCode}`;

    const response = await delApi(url, undefined, headers);

    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        message: 'Term deleted successfully',
      };
    } else {
      return {
        success: false,
        message: response.data?.message || 'Failed to delete term',
      };
    }
  } catch (error: unknown) {
    console.error('Error deleting term:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete term',
    };
  }
};
