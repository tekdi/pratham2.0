import {
  publishFramework,
  publishFrameworkAfterBatchOperation,
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
    // The interceptor already extracts meaningful error messages
    throw error instanceof Error ? error : new Error('Failed to create term');
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

    // The interceptor already extracts meaningful error messages
    throw error instanceof Error ? error : new Error('Failed to update term');
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
      message: error instanceof Error ? error.message : 'Failed to delete term',
    };
  }
};
