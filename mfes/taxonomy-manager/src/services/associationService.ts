import { publishFrameworkAfterBatchOperation } from '../utils/HelperService';
import { patch } from './RestClient';
import { URL_CONFIG } from '../utils/url.config';

export interface AssociationPayload {
  associations: { identifier: string }[];
}

export interface BatchAssociationCreateInput {
  fromTermCode: string;
  frameworkCode: string;
  categoryCode: string;
  associations: { identifier: string }[];
}

export async function createTermAssociations({
  fromTermCode,
  frameworkCode,
  categoryCode,
  associations,
}: {
  fromTermCode: string;
  frameworkCode: string;
  categoryCode: string;
  associations: { identifier: string }[];
}): Promise<unknown> {
  const url = `${URL_CONFIG.API.TERM_UPDATE}/${fromTermCode}?framework=${frameworkCode}&category=${categoryCode}`;

  const requestBody = {
    request: {
      term: {
        associations,
      },
    },
  };

  try {
    const response = await patch(url, requestBody);
    return response.data;
  } catch (error: unknown) {
    // The interceptor already extracts meaningful error messages
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to update associations';
    throw new Error(`Failed to update associations: ${errorMessage}`);
  }
}

export async function batchCreateTermAssociations(
  updates: BatchAssociationCreateInput[],
  channelId?: string
): Promise<
  { result?: unknown; error?: Error; input: BatchAssociationCreateInput }[]
> {
  const results = await Promise.all(
    updates.map(async (input) => {
      try {
        const result = await createTermAssociations(input);
        return { result, input };
      } catch (error) {
        return { error: error as Error, input };
      }
    })
  );
  // Publish framework after all associations are updated
  if (updates.length > 0) {
    const frameworkCode = updates[0].frameworkCode;
    await publishFrameworkAfterBatchOperation(
      frameworkCode,
      'association updates',
      channelId
    );
  }
  return results;
}
