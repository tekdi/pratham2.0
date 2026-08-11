import * as RestClient from './RestClient';
import { fetchSurveyEntries, fetchResponseById, fetchResponseListByCohort } from './surveyService';

jest.mock('./RestClient');

describe('surveyService — multi-entry additions', () => {
  afterEach(() => jest.resetAllMocks());

  it('fetchSurveyEntries requests only SUBMITTED rows for the given contextId, sorted newest-first', async () => {
    (RestClient.post as jest.Mock).mockResolvedValue({
      data: { result: { data: [{ responseId: 'r-2' }, { responseId: 'r-1' }] } },
    });

    const entries = await fetchSurveyEntries('survey-1', 'learner-1');

    expect(RestClient.post).toHaveBeenCalledWith(
      '/api/v1/responses/list/survey-1',
      expect.objectContaining({
        contextIds: ['learner-1'],
        status: 'submitted',
        sortBy: 'submittedAt',
        sortOrder: 'DESC',
      }),
    );
    expect(entries).toEqual([{ responseId: 'r-2' }, { responseId: 'r-1' }]);
  });

  it('fetchResponseById returns the response from result.data', async () => {
    (RestClient.get as jest.Mock).mockResolvedValue({
      data: { result: { responseId: 'r-1' } },
    });

    const result = await fetchResponseById('r-1');

    expect(RestClient.get).toHaveBeenCalledWith('/api/v1/responses/read/r-1');
    expect(result).toEqual({ responseId: 'r-1' });
  });

  it('fetchResponseListByCohort returns the new submittedCount-aware shape unchanged from the API', async () => {
    const apiRows = [{ contextId: 'learner-1', submittedCount: 2, hasInProgress: false, latestSubmittedAt: '2026-07-14T16:10:00.000Z' }];
    (RestClient.get as jest.Mock).mockResolvedValue({ data: { result: apiRows } });

    const rows = await fetchResponseListByCohort('survey-1', 'batch-1');

    expect(rows).toEqual(apiRows);
  });
});
