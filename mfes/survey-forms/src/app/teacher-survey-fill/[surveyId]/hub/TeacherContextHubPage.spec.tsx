import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TeacherContextHubPage from './TeacherContextHubPage';
import * as surveyService from '../../../../utils/API/surveyService';

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockSearchParams = new URLSearchParams();
jest.mock('next/navigation', () => ({
  useParams: () => ({ surveyId: 'survey-1' }),
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useSearchParams: () => mockSearchParams,
}));
jest.mock('../../../../utils/API/surveyService');

describe('TeacherContextHubPage — multi-entry hub', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    window.localStorage.setItem('userId', 'teacher-1');
    (surveyService.fetchSurveyById as jest.Mock).mockResolvedValue({
      params: { status: 'successful' },
      result: { data: { surveyId: 'survey-1', surveyTitle: 'Monthly Check', surveyType: 'multi', endDate: null } },
    });
    (surveyService.fetchTeacherCentersWithBatches as jest.Mock).mockResolvedValue({
      centers: [{ id: 'center-1', label: 'Kothrud Center' }],
      batchesByCenterId: { 'center-1': [{ id: 'batch-1', label: 'Batch A' }] },
    });
    (surveyService.fetchAllTeacherCohortLearners as jest.Mock).mockResolvedValue({
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
    mockSearchParams = new URLSearchParams();
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
    (surveyService.fetchAllTeacherCohortLearners as jest.Mock).mockResolvedValue({
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

describe('TeacherContextHubPage — Month filter considers every entry, not just the latest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    window.localStorage.setItem('userId', 'teacher-1');
    (surveyService.fetchSurveyById as jest.Mock).mockResolvedValue({
      params: { status: 'successful' },
      result: { data: { surveyId: 'survey-1', surveyTitle: 'Jhalak Survey Updated', surveyType: 'multi', endDate: null } },
    });
    (surveyService.fetchTeacherCentersWithBatches as jest.Mock).mockResolvedValue({
      centers: [{ id: 'center-1', label: 'Kothrud Center' }],
      batchesByCenterId: { 'center-1': [{ id: 'batch-1', label: 'Batch A' }] },
    });
    (surveyService.fetchAllTeacherCohortLearners as jest.Mock).mockResolvedValue({
      learners: [{ id: 'learner-1', label: 'Aarti Deshmukh' }],
      totalCount: 1,
    });
    // Aggregate only carries the LATEST date (August) — the bug is trusting only this for Month filtering.
    (surveyService.fetchResponseListByCohort as jest.Mock).mockResolvedValue([
      { contextId: 'learner-1', submittedCount: 2, hasInProgress: false, latestSubmittedAt: '2026-08-13T18:01:00.000Z' },
    ]);
    // The full per-entry lookup reveals the learner ALSO has a July entry, in this same batch.
    (surveyService.fetchAllSubmittedEntriesForContexts as jest.Mock).mockResolvedValue([
      { responseId: 'r-2', contextId: 'learner-1', submittedAt: '2026-08-13T18:01:00.000Z', responseMetadata: { cohortId: 'batch-1' } },
      { responseId: 'r-1', contextId: 'learner-1', submittedAt: '2026-07-13T18:01:32.000Z', responseMetadata: { cohortId: 'batch-1' } },
    ]);
  });

  it('keeps a learner visible when filtering by an earlier month than their latest entry', async () => {
    render(<TeacherContextHubPage />);
    await screen.findByText('Aarti Deshmukh');

    fireEvent.mouseDown(screen.getByLabelText('Month'));
    fireEvent.click(screen.getByText('July'));

    expect(await screen.findByText('Aarti Deshmukh')).toBeInTheDocument();
  });

  it('shows the date of the entry WITHIN the filtered month, not the true overall-latest date', async () => {
    render(<TeacherContextHubPage />);
    await screen.findByText('Aarti Deshmukh');

    // Before filtering: the true latest (August) date is shown, DD/MM/YYYY.
    expect(await screen.findByText('13/08/2026')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByLabelText('Month'));
    fireEvent.click(screen.getByText('July'));
    await screen.findByText('Aarti Deshmukh');

    // After filtering by July: the July date is shown instead of the August one.
    expect(await screen.findByText('13/07/2026')).toBeInTheDocument();
    expect(screen.queryByText('13/08/2026')).not.toBeInTheDocument();
  });

  it('keeps the View Entries link unfiltered — the Entries screen still always shows every entry', async () => {
    render(<TeacherContextHubPage />);
    await screen.findByText('Aarti Deshmukh');

    fireEvent.mouseDown(screen.getByLabelText('Month'));
    fireEvent.click(screen.getByText('July'));
    await screen.findByText('Aarti Deshmukh');

    fireEvent.click(screen.getByRole('button', { name: 'View Entries (2)' }));

    expect(mockPush).toHaveBeenCalledWith('/teacher-survey-fill/survey-1/hub/learner-1/entries');
  });
});

describe('TeacherContextHubPage — Month filter does not leak entries from a different batch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    window.localStorage.setItem('userId', 'teacher-1');
    (surveyService.fetchSurveyById as jest.Mock).mockResolvedValue({
      params: { status: 'successful' },
      result: { data: { surveyId: 'survey-1', surveyTitle: 'Board Result Entry', surveyType: 'single', endDate: null } },
    });
    (surveyService.fetchTeacherCentersWithBatches as jest.Mock).mockResolvedValue({
      centers: [{ id: 'center-1', label: 'andaman center' }],
      batchesByCenterId: { 'center-1': [{ id: 'batch-1', label: 'andaman second batch' }] },
    });
    (surveyService.fetchAllTeacherCohortLearners as jest.Mock).mockResolvedValue({
      learners: [{ id: 'learner-1', label: 'TestUser Majage' }],
      totalCount: 1,
    });
    // Aggregate (already correctly scoped to batch-1 server-side): this learner has
    // NOT submitted anything in THIS batch — genuinely "Not Started".
    (surveyService.fetchResponseListByCohort as jest.Mock).mockResolvedValue([
      { contextId: 'learner-1', submittedCount: 0, hasInProgress: false, latestSubmittedAt: null },
    ]);
    // But the same learner ID has a July submission under a DIFFERENT batch
    // (e.g. a reused/moved test account) — the raw entries lookup has no cohort
    // filter of its own, so this must be filtered out client-side against batchId.
    (surveyService.fetchAllSubmittedEntriesForContexts as jest.Mock).mockResolvedValue([
      { responseId: 'r-other-batch', contextId: 'learner-1', submittedAt: '2026-07-01T10:00:00.000Z', responseMetadata: { cohortId: 'some-other-batch' } },
    ]);
  });

  it('does not show a Not Started learner as matching July just because they submitted under a different batch', async () => {
    render(<TeacherContextHubPage />);
    await screen.findByText('TestUser Majage');

    fireEvent.mouseDown(screen.getByLabelText('Month'));
    fireEvent.click(screen.getByText('July'));

    // Wait for a definitive settled marker (the empty state), not just the
    // absence of the row — the loading spinner also hides the row transiently,
    // which would make a bare "not in document" check pass for the wrong reason.
    expect(await screen.findByText('No learners found in the selected batch.')).toBeInTheDocument();
    expect(screen.queryByText('TestUser Majage')).not.toBeInTheDocument();
    // The row is gone entirely — so no stray "01/07/2026" from that other-batch entry either.
    expect(screen.queryByText('01/07/2026')).not.toBeInTheDocument();
  });
});

describe('TeacherContextHubPage — filters survive back-navigation via the URL', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.setItem('userId', 'teacher-1');
    (surveyService.fetchSurveyById as jest.Mock).mockResolvedValue({
      params: { status: 'successful' },
      result: { data: { surveyId: 'survey-1', surveyTitle: 'Jhalak Survey Updated', surveyType: 'multi', endDate: null } },
    });
    (surveyService.fetchTeacherCentersWithBatches as jest.Mock).mockResolvedValue({
      centers: [{ id: 'center-1', label: 'Kothrud Center' }],
      batchesByCenterId: { 'center-1': [{ id: 'batch-1', label: 'Batch A' }] },
    });
    (surveyService.fetchAllTeacherCohortLearners as jest.Mock).mockResolvedValue({
      learners: [{ id: 'learner-1', label: 'Kedar' }],
      totalCount: 1,
    });
    (surveyService.fetchResponseListByCohort as jest.Mock).mockResolvedValue([
      { contextId: 'learner-1', submittedCount: 1, hasInProgress: false, latestSubmittedAt: '2026-08-13T18:01:00.000Z' },
    ]);
    (surveyService.fetchAllSubmittedEntriesForContexts as jest.Mock).mockResolvedValue([
      { responseId: 'r-1', contextId: 'learner-1', submittedAt: '2026-07-13T18:01:32.000Z', responseMetadata: { cohortId: 'batch-1' } },
    ]);
  });

  it('restores the Month filter from the URL on mount (e.g. after coming back from View Entries)', async () => {
    mockSearchParams = new URLSearchParams('centerId=center-1&batchId=batch-1&month=July');
    render(<TeacherContextHubPage />);

    // Kedar only has a July entry — if Month had reset to "All" this would still pass,
    // so also assert the Month select itself shows "July", not the default "All".
    expect(await screen.findByText('Kedar')).toBeInTheDocument();
    expect(screen.getByLabelText('Month')).toHaveTextContent('July');
  });

  it('writes the active Month filter into the URL so a later remount can restore it', async () => {
    mockSearchParams = new URLSearchParams('centerId=center-1&batchId=batch-1');
    render(<TeacherContextHubPage />);
    await screen.findByText('Kedar');

    fireEvent.mouseDown(screen.getByLabelText('Month'));
    fireEvent.click(screen.getByText('July'));
    await screen.findByText('Kedar');

    const lastReplaceUrl = mockReplace.mock.calls[mockReplace.mock.calls.length - 1][0];
    expect(lastReplaceUrl).toContain('month=July');
  });
});
