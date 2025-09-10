import { Framework } from '../interfaces/FrameworkInterface';
import { URL_CONFIG } from '../utils/url.config';
import { get, post } from './RestClient';

const getFrameworkById = async (id: string): Promise<Framework> => {
  const url = `${URL_CONFIG.API.FRAMEWORK_READ}/${id}`;

  // Use RestClient get method with automatic authentication and tenant headers
  const response = await get(url);
  const data = response.data;

  if (!data?.result?.framework) {
    throw new Error('Malformed API response');
  }

  return data.result.framework as Framework;
};

export async function createFramework(
  framework: { name: string; code: string; description: string },
  channelId: string
) {
  const requestBody = {
    request: {
      framework: {
        name: framework.name,
        code: framework.code,
        description: framework.description,
        type: 'K-12',
        channel: channelId,
      },
    },
  };

  const customHeaders = {
    'X-Channel-Id': channelId,
  };

  const url = URL_CONFIG.API.FRAMEWORK_CREATE;

  // Use RestClient post method with automatic authentication and tenant headers
  const response = await post(url, requestBody, customHeaders);
  const data = response.data;

  if (data.responseCode !== 'OK') {
    throw new Error(
      data?.params?.errmsg ?? data?.params?.err ?? `Error: ${response.status}`
    );
  }

  return data;
}

const frameworkService = {
  getFrameworkById,
  createFramework,
};

export default frameworkService;
