import React from 'react';
import { render, screen } from '@testing-library/react';
import ReadOnlyValue from './ReadOnlyValue';
import type { SurveyField } from '../../types/survey';

const radioField: SurveyField = {
  fieldId: 'f1',
  fieldName: 'q1',
  fieldLabel: 'Attendance',
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
};

describe('ReadOnlyValue', () => {
  it('renders "No answer provided" for an empty value', () => {
    render(<ReadOnlyValue field={radioField} value="" />);
    expect(screen.getByText('No answer provided')).toBeInTheDocument();
  });

  it('resolves a radio value to its option label', () => {
    render(<ReadOnlyValue field={radioField} value="yes" />);
    expect(screen.getByText('Yes, all sessions')).toBeInTheDocument();
  });
});
