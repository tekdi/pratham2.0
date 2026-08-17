import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import FillRouteGuard from './FillRouteGuard';
import * as surveyService from '../../../../utils/API/surveyService';

const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useParams: () => ({ surveyId: 'survey-1', contextId: 'learner-1' }),
  useRouter: () => ({ replace: mockReplace }),
}));
jest.mock('../../../../utils/API/surveyService');
jest.mock('./SurveyRenderer', () => () => <div>survey-renderer</div>);

describe('FillRouteGuard', () => {
  beforeEach(() => jest.clearAllMocks());

  it('redirects to /view for a single-entry survey already submitted', async () => {
    (surveyService.fetchSurveyById as jest.Mock).mockResolvedValue({
      result: { data: { surveyType: 'single' } },
    });
    (surveyService.fetchSurveyResponseStatus as jest.Mock).mockResolvedValue('submitted');

    render(<FillRouteGuard />);

    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith('/survey-fill/survey-1/learner-1/view')
    );
    expect(screen.queryByText('survey-renderer')).not.toBeInTheDocument();
  });

  it('renders SurveyRenderer for a multi-entry survey without checking submission status', async () => {
    (surveyService.fetchSurveyById as jest.Mock).mockResolvedValue({
      result: { data: { surveyType: 'multi' } },
    });

    render(<FillRouteGuard />);

    expect(await screen.findByText('survey-renderer')).toBeInTheDocument();
    expect(surveyService.fetchSurveyResponseStatus).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('renders SurveyRenderer for a single-entry survey not yet submitted', async () => {
    (surveyService.fetchSurveyById as jest.Mock).mockResolvedValue({
      result: { data: { surveyType: 'single' } },
    });
    (surveyService.fetchSurveyResponseStatus as jest.Mock).mockResolvedValue('none');

    render(<FillRouteGuard />);

    expect(await screen.findByText('survey-renderer')).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
