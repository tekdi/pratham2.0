import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TeacherContextHubPage from './TeacherContextHubPage';
import * as surveyService from '../../../../utils/API/surveyService';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useParams: () => ({ surveyId: 'survey-1' }),
  useRouter: () => ({ push: mockPush, replace: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
jest.mock('../../../../utils/API/surveyService');

describe('TeacherContextHubPage — multi-entry hub', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.setItem('userId', 'teacher-1');
    (surveyService.fetchSurveyById as jest.Mock).mockResolvedValue({
      params: { status: 'successful' },
      result: { data: { surveyId: 'survey-1', surveyTitle: 'Monthly Check', surveyType: 'multi', endDate: null } },
    });
    (surveyService.fetchTeacherCentersWithBatches as jest.Mock).mockResolvedValue({
      centers: [{ id: 'center-1', label: 'Kothrud Center' }],
      batchesByCenterId: { 'center-1': [{ id: 'batch-1', label: 'Batch A' }] },
    });
    (surveyService.fetchTeacherCohortLearners as jest.Mock).mockResolvedValue({
      learners: [{ id: 'learner-1', label: 'Kiran Salunkhe' }],
      totalCount: 1,
    });
    (surveyService.fetchResponseListByCohort as jest.Mock).mockResolvedValue([
      { contextId: 'learner-1', submittedCount: 3, hasInProgress: false, latestSubmittedAt: '2026-07-14T16:10:00.000Z' },
    ]);
  });

  it('shows "View Entries (3)" for a multi-entry survey and navigates on click', async () => {
    render(<TeacherContextHubPage />);

    const viewEntriesButton = await screen.findByRole('button', { name: 'View Entries (3)' });
    fireEvent.click(viewEntriesButton);

    expect(mockPush).toHaveBeenCalledWith('/teacher-survey-fill/survey-1/hub/learner-1/entries');
  });

  it('counts a learner with submittedCount > 0 as Completed in the summary tiles', async () => {
    render(<TeacherContextHubPage />);
    await screen.findByText('Completed');
    const completedLabels = screen.getAllByText('Completed');
    const completedTile = completedLabels
      .map((el) => el.closest('.MuiPaper-root'))
      .find((el) => el !== null);
    expect(completedTile).toHaveTextContent('1');
  });
});

describe('TeacherContextHubPage — pagination (MUI TablePagination, matching admin portal)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.setItem('userId', 'teacher-1');
    const learners = Array.from({ length: 12 }, (_, i) => ({
      id: `learner-${i + 1}`,
      label: `Learner ${i + 1}`,
    }));
    (surveyService.fetchSurveyById as jest.Mock).mockResolvedValue({
      params: { status: 'successful' },
      result: { data: { surveyId: 'survey-1', surveyTitle: 'Monthly Check', surveyType: 'single', endDate: null } },
    });
    (surveyService.fetchTeacherCentersWithBatches as jest.Mock).mockResolvedValue({
      centers: [{ id: 'center-1', label: 'Kothrud Center' }],
      batchesByCenterId: { 'center-1': [{ id: 'batch-1', label: 'Batch A' }] },
    });
    (surveyService.fetchTeacherCohortLearners as jest.Mock).mockResolvedValue({
      learners,
      totalCount: learners.length,
    });
    (surveyService.fetchResponseListByCohort as jest.Mock).mockResolvedValue([]);
  });

  it('shows a rows-per-page selector and a range label, and advances to the next page on click', async () => {
    render(<TeacherContextHubPage />);

    await screen.findByText('Learner 1');
    expect(screen.getByText('1–10 of 12')).toBeInTheDocument();
    expect(screen.queryByText('Learner 11')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /next page/i }));

    expect(await screen.findByText('Learner 11')).toBeInTheDocument();
    expect(screen.queryByText('Learner 1')).not.toBeInTheDocument();
  });

  it('changing rows-per-page shows more rows on one page', async () => {
    render(<TeacherContextHubPage />);
    await screen.findByText('Learner 1');

    const rowsPerPageSelect = screen.getByLabelText(/rows per page/i);
    fireEvent.mouseDown(rowsPerPageSelect);
    fireEvent.click(screen.getByRole('option', { name: '25' }));

    expect(await screen.findByText('Learner 12')).toBeInTheDocument();
  });
});
