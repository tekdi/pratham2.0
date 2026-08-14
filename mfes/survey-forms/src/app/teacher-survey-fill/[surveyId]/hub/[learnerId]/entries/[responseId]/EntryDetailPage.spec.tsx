import React from 'react';
import { render, screen } from '@testing-library/react';
import EntryDetailPage from './EntryDetailPage';
import * as surveyService from '../../../../../../../utils/API/surveyService';

jest.mock('next/navigation', () => ({
  useParams: () => ({ surveyId: 'survey-1', learnerId: 'learner-1', responseId: 'r-2' }),
  useRouter: () => ({ back: jest.fn() }),
}));
jest.mock('../../../../../../../utils/API/surveyService');

describe('EntryDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (surveyService.fetchSurveyById as jest.Mock).mockResolvedValue({
      params: { status: 'successful' },
      result: {
        data: {
          surveyId: 'survey-1',
          surveyTitle: 'Monthly Progress Check',
          sections: [
            {
              sectionId: 's1',
              sectionTitle: 'Attendance',
              sectionDescription: null,
              displayOrder: 0,
              isVisible: true,
              conditionalLogic: null,
              fields: [
                {
                  fieldId: 'f1',
                  fieldName: 'q1',
                  fieldLabel: 'Attendance this month',
                  fieldType: 'radio',
                  isRequired: true,
                  displayOrder: 0,
                  placeholder: null,
                  helpText: null,
                  defaultValue: null,
                  validations: {},
                  dataSource: null,
                  uploadConfig: null,
                  uiConfig: {},
                  conditionalLogic: null,
                  options: [{ value: 'yes', label: 'Yes, all sessions' }],
                },
              ],
            },
          ],
        },
      },
    });
    (surveyService.fetchResponseById as jest.Mock).mockResolvedValue({
      responseId: 'r-2',
      responseData: { f1: 'yes' },
      submittedAt: '2026-06-28T11:05:00.000Z',
    });
  });

  it('renders the submitted answer for the requested responseId', async () => {
    render(<EntryDetailPage />);
    expect(await screen.findByText('Yes, all sessions')).toBeInTheDocument();
    expect(surveyService.fetchResponseById).toHaveBeenCalledWith('r-2');
  });
});
