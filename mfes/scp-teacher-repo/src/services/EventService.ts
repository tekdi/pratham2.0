import { scheduleEventParam, CreateEvent, EditEvent } from '@/utils/Interfaces';
import { patch, post } from './RestClient';
import API_ENDPOINTS from '@/utils/API/APIEndpoints';

export const getEventList = async ({
  limit,
  offset,
  filters,
}: scheduleEventParam): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.eventList
  try {
    const response = await post(apiUrl, { limit, offset, filters });
    return response?.data?.result;
  } catch (error) {
    console.error('error in getting event List Service list', error);
    return error;
  }
};

export const createEvent = async (apiBody: CreateEvent): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.eventCreate
  try {
    const response = await post(apiUrl, apiBody);
    return response?.data;
  } catch (error) {
    console.error('error in getting event List Service list', error);
    return error;
  }
};

export const editEvent = async (
  eventRepetitionId: string,
  apiBody: EditEvent
): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.eventDetails(eventRepetitionId)
  try {
    const response = await patch(apiUrl, apiBody);
    return response?.data;
  } catch (error) {
    console.error('error in getting event List Service list', error);
    return error;
  }
};
