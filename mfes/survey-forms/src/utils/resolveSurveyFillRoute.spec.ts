import { resolvePostSurveyListRoute } from './resolveSurveyFillRoute';
import type { Survey } from '../types/survey';
import type { SurveyFormsEntryConfig } from '../types/surveyEntryConfig';

const mockStorage: Record<string, string> = {};

beforeEach(() => {
  Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: (key: string) => mockStorage[key] ?? null,
      setItem: (key: string, val: string) => { mockStorage[key] = val; },
      removeItem: (key: string) => { delete mockStorage[key]; },
      clear: () => { Object.keys(mockStorage).forEach((k) => delete mockStorage[k]); },
    },
    writable: true,
    configurable: true,
  });
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
    mockStorage['userId'] = 'user-abc';
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
    mockStorage['userId'] = 'user-abc';
    expect(resolvePostSurveyListRoute(makeSurvey('center'), null)).toBe(
      '/survey-fill/survey-123'
    );
  });
});
