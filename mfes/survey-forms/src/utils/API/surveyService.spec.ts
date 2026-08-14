import * as RestClient from './RestClient';
import {
  fetchSurveyEntries,
  fetchResponseById,
  fetchResponseListByCohort,
  fetchAllTeacherCohortLearners,
  fetchAllSubmittedEntriesForContexts,
} from './surveyService';

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

describe('fetchAllTeacherCohortLearners — real pagination, no hardcoded cap', () => {
  afterEach(() => jest.resetAllMocks());

  it('loops through every page until the reported total is reached, however large the batch is', async () => {
    (RestClient.post as jest.Mock)
      .mockResolvedValueOnce({
        data: {
          result: {
            userDetails: Array.from({ length: 100 }, (_, i) => ({ userId: `u${i + 1}` })),
            totalCount: 250,
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          result: {
            userDetails: Array.from({ length: 100 }, (_, i) => ({ userId: `u${i + 101}` })),
            totalCount: 250,
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          result: {
            userDetails: Array.from({ length: 50 }, (_, i) => ({ userId: `u${i + 201}` })),
            totalCount: 250,
          },
        },
      });

    const result = await fetchAllTeacherCohortLearners('cohort-1');

    expect(RestClient.post).toHaveBeenCalledTimes(3);
    expect(result.totalCount).toBe(250);
    expect(result.learners).toHaveLength(250);
    expect(result.learners[0].id).toBe('u1');
    expect(result.learners[249].id).toBe('u250');
  });

  it('stops after one request when everyone already fits in the first page (no wasted requests for small batches)', async () => {
    (RestClient.post as jest.Mock).mockResolvedValueOnce({
      data: {
        result: {
          userDetails: Array.from({ length: 16 }, (_, i) => ({ userId: `u${i + 1}` })),
          totalCount: 16,
        },
      },
    });

    const result = await fetchAllTeacherCohortLearners('cohort-1');

    expect(RestClient.post).toHaveBeenCalledTimes(1);
    expect(result.learners).toHaveLength(16);
    expect(result.totalCount).toBe(16);
  });

  it('stops if a page comes back empty even though totalCount claims more remain (safety guard, no infinite loop)', async () => {
    (RestClient.post as jest.Mock).mockResolvedValueOnce({
      data: { result: { userDetails: [], totalCount: 250 } },
    });

    const result = await fetchAllTeacherCohortLearners('cohort-1');

    expect(RestClient.post).toHaveBeenCalledTimes(1);
    expect(result.learners).toHaveLength(0);
  });

  it('regression: retrieves all 1098 learners from a real prod-sized batch instead of truncating at 300', async () => {
    const TOTAL = 1098;
    (RestClient.post as jest.Mock).mockImplementation((_url, body: { offset: number; limit: number }) => {
      const remaining = Math.max(0, TOTAL - body.offset);
      const count = Math.min(body.limit, remaining);
      return Promise.resolve({
        data: {
          result: {
            userDetails: Array.from({ length: count }, (_, i) => ({ userId: `u${body.offset + i + 1}` })),
            totalCount: TOTAL,
          },
        },
      });
    });

    const result = await fetchAllTeacherCohortLearners('cohort-1');

    expect(result.totalCount).toBe(1098);
    expect(result.learners).toHaveLength(1098);
    expect(result.learners[0].id).toBe('u1');
    expect(result.learners[1097].id).toBe('u1098');
    expect(RestClient.post).toHaveBeenCalledTimes(11); // 10 pages of 100 + 1 page of 98
  });
});

describe('fetchAllSubmittedEntriesForContexts — every submitted entry for a set of learners, not just the aggregate', () => {
  afterEach(() => jest.resetAllMocks());

  it('loops through pages until meta.total is reached', async () => {
    (RestClient.post as jest.Mock)
      .mockResolvedValueOnce({
        data: {
          result: {
            data: Array.from({ length: 100 }, (_, i) => ({ responseId: `r${i + 1}` })),
            meta: { total: 150 },
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          result: {
            data: Array.from({ length: 50 }, (_, i) => ({ responseId: `r${i + 101}` })),
            meta: { total: 150 },
          },
        },
      });

    const result = await fetchAllSubmittedEntriesForContexts('survey-1', ['learner-1', 'learner-2']);

    expect(RestClient.post).toHaveBeenCalledTimes(2);
    expect(RestClient.post).toHaveBeenCalledWith(
      '/api/v1/responses/list/survey-1',
      expect.objectContaining({ contextIds: ['learner-1', 'learner-2'], status: 'submitted' }),
    );
    expect(result).toHaveLength(150);
  });

  it('returns [] immediately without a network call when contextIds is empty', async () => {
    const result = await fetchAllSubmittedEntriesForContexts('survey-1', []);
    expect(result).toEqual([]);
    expect(RestClient.post).not.toHaveBeenCalled();
  });
});
