// @ts-nocheck
import { sendCredentialService } from '@/services/NotificationService';
import { TelemetryEventType } from '@/utils/app.constant';
import { firstLetterInUpperCase, getUserFullName } from '@/utils/Helper';
import { telemetryFactory } from '@/utils/telemetry';
import axios from 'axios';
import { debounce } from 'lodash';
import { showToastMessage } from '../Toastify';

export const debouncedGetList = debounce(
  async (data, setResponse, getListApiCall) => {
    const resp = await getListApiCall(data);
    console.log('Debounced API Call:', resp);
    // console.log('totalCount', result?.totalCount);
    // console.log('userDetails', result?.getUserDetails);
    setResponse({ result: resp });
  },
  300
);

export const fetchForm = async (readForm: any) => {
  let data = JSON.stringify({
    readForm: readForm,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: '/api/dynamic-form/get-rjsf-form',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };

  let responseForm = null;
  await axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      if (response.data?.schema && response.data?.uiSchema) {
        // console.log(`schema`, response.data?.schema);
        responseForm = response.data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return responseForm;
};

export const searchListData = async (
  formData: any,
  newPage: any,
  staticFilter: any,
  pageLimit: any,
  setPageOffset: any,
  setCurrentPage: any,
  setResponse: any,
  getListApiCall: any,
  staticSort: any
) => {
  const { sortBy, ...restFormData } = formData;

  const filters = {
    ...staticFilter,
    // status: [Status.ACTIVE],
    ...Object.entries(restFormData).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== '') {
        if (key === 'status') {
          acc[key] = [value];
        } else {
          acc[key] = value;
        }
      }

      return acc;
    }, {} as Record<string, any>),
  };

  const sort = staticSort;
  let limit = pageLimit;
  let offset = newPage * limit;
  let pageNumber = newPage;

  setPageOffset(offset);
  setCurrentPage(pageNumber);
  setResponse({});

  const data = {
    limit,
    offset,
    sort,
    filters,
  };

  if (filters.firstName) {
    debouncedGetList(data, setResponse, getListApiCall);
  } else {
    const resp = await getListApiCall(data);
    // console.log('totalCount', result?.totalCount);
    // console.log('userDetails', result?.getUserDetails);
    setResponse({ result: resp });
    console.log('Immediate API Call:', resp);
  }
};
export const extractMatchingKeys = (row: any, schema: any) => {
  let result = {};
  const getValue = (type, selectedValues) => {
    if (
      type === 'array' &&
      Array.isArray(selectedValues) &&
      selectedValues.length > 0
    ) {
      if (typeof selectedValues?.[0] === 'object') {
        // Array of JSON objects -> return array of IDs
        return selectedValues.map((item) => item.id);
      } else {
        // Simple array of strings -> return as is
        return selectedValues;
      }
    } else if (
      type === 'string' &&
      Array.isArray(selectedValues) &&
      selectedValues.length > 0
    ) {
      if (typeof selectedValues?.[0] === 'object') {
        // Array of JSON objects -> return first object's ID
        return selectedValues?.[0].id;
      }
    }
    //patch for type = array and selected value = string
    else if(type==='array'){
      return [selectedValues];
    }
    return null; // Default if conditions not met
  };
  const convertArrayToStrings = (arr) => {
    if (!Array.isArray(arr)) {
      // throw new Error('Input is not an array');
      return arr;
    }
    return arr.map((item) => String(item));
  };
  for (const [key, value] of Object.entries(schema.properties)) {
    // console.log('######### prefilled key', JSON.stringify(key));
    // console.log('######### prefilled value', JSON.stringify(value));
    // console.log('######### prefilled row', JSON.stringify(row));
    if (value.coreField === 0) {
      if (value.fieldId) {
        //check type = array or string
        const customField = row.customFields?.find(
          (field) => field.fieldId === value.fieldId
        );
        if (customField) {
          // console.log(
          //   '######### prefilled customField',
          //   JSON.stringify(customField)
          // );
          let resultValue = getValue(value.type, customField.selectedValues);
          if (resultValue) {
            // console.log(
            //   '######### prefilled resultValue',
            //   JSON.stringify(resultValue)
            // );
            result[key] = convertArrayToStrings(resultValue);
          }
        }
      } else if (row[key] !== undefined && row[key] !== null) {
        result[key] = row[key];
      }
    } else if (row[key] !== undefined && row[key] !== null) {
      result[key] = row[key];
    }
  }

  return result;
};

// Add Edit Functions

export const splitUserData = (payload: any) => {
  const { customFields, ...userData } = payload;
  return { userData, customFields };
};

export const telemetryCallbacks = (id: any) => {
  const windowUrl = window.location.pathname;
  const cleanedUrl = windowUrl.replace(/^\//, '');
  const env = cleanedUrl.split('/')[0];

  const telemetryInteract = {
    context: {
      env: env,
      cdata: [],
    },
    edata: {
      id: id,
      type: TelemetryEventType.CLICK,
      subtype: '',
      pageid: cleanedUrl,
    },
  };

  telemetryFactory.interact(telemetryInteract);
};

export const notificationCallback = async (
  messageKey: any,
  context: any,
  key: any,
  payload: any,
  t: any,
  successMessageKey: any
) => {
  const isQueue = false;

  let creatorName;

  if (typeof window !== 'undefined' && window.localStorage) {
    creatorName = getUserFullName();
  }
  let replacements: { [key: string]: string };
  replacements = {};
  if (creatorName) {
    replacements = {
      '{FirstName}': firstLetterInUpperCase(payload?.firstName),
      '{UserName}': payload?.email,
      '{Password}': payload?.password,
      '{appUrl}': (process.env.NEXT_PUBLIC_TEACHER_APP_URL as string) || '', //TODO: check url
    };
  }

  const sendTo = {
    receipients: [payload?.email],
  };
  if (Object.keys(replacements).length !== 0 && sendTo) {
    const response = await sendCredentialService({
      isQueue,
      context,
      key,
      replacements,
      email: sendTo,
    });

    if (response?.result[0]?.data[0]?.status === 'success') {
      showToastMessage(t(messageKey), 'success');
    } else {
      showToastMessage(t(successMessageKey), 'success');
    }
  } else {
    showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
  }
};
