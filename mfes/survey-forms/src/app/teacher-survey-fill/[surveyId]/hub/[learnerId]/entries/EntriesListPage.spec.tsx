import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EntriesListPage from './EntriesListPage';
import * as surveyService from '../../../../../../utils/API/surveyService';

const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock('next/navigation', () => ({
  useParams: () => ({ surveyId: 'survey-1', learnerId: 'learner-1' }),
  useRouter: () => ({ push: mockPush, back: mockBack }),
}));
jest.mock('../../../../../../utils/API/surveyService');

describe('EntriesListPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (surveyService.fetchSurveyById as jest.Mock).mockResolvedValue({
      params: { status: 'successful' },
      result: { data: { surveyId: 'survey-1', surveyTitle: 'Monthly Progress Check' } },
    });
    (surveyService.fetchSurveyEntries as jest.Mock).mockResolvedValue([
      { responseId: 'r-3', submittedAt: '2026-07-14T16:10:00.000Z' },
      { responseId: 'r-2', submittedAt: '2026-06-28T11:05:00.000Z' },
      { responseId: 'r-1', submittedAt: '2026-06-05T09:47:00.000Z' },
    ]);
  });

  it('numbers entries chronologically (oldest = Entry 1) while listing newest first', async () => {
    render(<EntriesListPage />);

    const entryLabels = await screen.findAllByText(/^Entry \d$/);
    expect(entryLabels.map((el) => el.textContent)).toEqual(['Entry 3', 'Entry 2', 'Entry 1']);
  });

  it('navigates to the entry detail route when a row is clicked', async () => {
    render(<EntriesListPage />);
    const firstRow = await screen.findByText('Entry 3');
    firstRow.click();
    expect(mockPush).toHaveBeenCalledWith('/teacher-survey-fill/survey-1/hub/learner-1/entries/r-3');
  });

  it('uses real browser back navigation instead of rebuilding the hub URL, so filters/sort/page survive going back', async () => {
    // A hardcoded router.push to a bare "/hub" URL would drop every query param
    // (search, status, month, sort, page, centerId, batchId) the hub had synced into
    // the URL, silently resetting filters and corrupting the history stack when mixed
    // with real back navigation elsewhere (Fill form, entry detail). router.back()
    // always returns to whatever the actual previous URL was, filters included.
    render(<EntriesListPage />);
    await screen.findByText('Entry 3');

    const backButton = screen.getByTestId('ArrowBackIcon').closest('button');
    fireEvent.click(backButton as HTMLElement);

    expect(mockBack).toHaveBeenCalledTimes(1);
    expect(mockPush).not.toHaveBeenCalledWith(expect.stringContaining('/hub'));
  });
});
