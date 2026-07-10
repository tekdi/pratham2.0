import { resolvePostSurveyListRoute } from './resolveSurveyFillRoute';
import type { Survey } from '../types/survey';
import type { SurveyFormsEntryConfig } from '../types/surveyEntryConfig';

beforeEach(() => {
  localStorage.clear();
});

const makeSurvey = (contextType: string): Survey =>
  ({ surveyId: 'survey-123', contextType } as Survey);

const hubConfig: SurveyFormsEntryConfig = {
  version: 1,
  contextEntry: 'hub',
  hubKind: 'learner',
  rosterSource: 'inline',
  rosterItems: [],
} as unknown as SurveyFormsEntryConfig;

describe('resolvePostSurveyListRoute', () => {
  it('routes self contextType to /self regardless of config', () => {
    expect(resolvePostSurveyListRoute(makeSurvey('self'), null)).toBe(
      '/survey-fill/survey-123/self'
    );
  });

  it('routes none contextType to /self regardless of config', () => {
    expect(resolvePostSurveyListRoute(makeSurvey('none'), null)).toBe(
      '/survey-fill/survey-123/self'
    );
  });

  it('routes to hub when entryConfig.contextEntry is hub', () => {
    expect(resolvePostSurveyListRoute(makeSurvey('learner'), hubConfig)).toBe(
      '/survey-fill/survey-123/hub'
    );
  });

  it('routes learner contextType to /{userId} when userId is in localStorage', () => {
    localStorage.setItem('userId', 'user-abc');
    expect(resolvePostSurveyListRoute(makeSurvey('learner'), null)).toBe(
      '/survey-fill/survey-123/user-abc'
    );
  });

  it('falls back to ContextPicker when contextType is learner but userId is missing', () => {
    expect(resolvePostSurveyListRoute(makeSurvey('learner'), null)).toBe(
      '/survey-fill/survey-123'
    );
  });

  it('falls back to ContextPicker for non-learner contextual types with no hub config', () => {
    localStorage.setItem('userId', 'user-abc');
    expect(resolvePostSurveyListRoute(makeSurvey('center'), null)).toBe(
      '/survey-fill/survey-123'
    );
  });
});
