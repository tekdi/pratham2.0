import React from 'react';
import { render, screen } from '@testing-library/react';
import EntriesListPage from './EntriesListPage';
import * as surveyService from '../../../../../../utils/API/surveyService';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useParams: () => ({ surveyId: 'survey-1', learnerId: 'learner-1' }),
  useRouter: () => ({ push: mockPush, back: jest.fn() }),
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
});
