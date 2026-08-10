import React from 'react';
import { render, screen } from '@testing-library/react';
import SurveyStatusSummary from './SurveyStatusSummary';

describe('SurveyStatusSummary — percentage tiles (PS-7183)', () => {
  it('shows each status as a percentage of the total, with the raw count as a subtitle', () => {
    render(
      <SurveyStatusSummary
        counts={{ completed: 2847, inProgress: 654, notStarted: 1171 }}
      />
    );

    expect(screen.getByText('61%')).toBeInTheDocument();
    expect(screen.getByText('2,847 of 4,672')).toBeInTheDocument();

    expect(screen.getByText('14%')).toBeInTheDocument();
    expect(screen.getByText('654 of 4,672')).toBeInTheDocument();

    expect(screen.getByText('25%')).toBeInTheDocument();
    expect(screen.getByText('1,171 of 4,672')).toBeInTheDocument();
  });

  it('renders 0% for every tile when there are no learners at all', () => {
    render(<SurveyStatusSummary counts={{ completed: 0, inProgress: 0, notStarted: 0 }} />);
    expect(screen.getAllByText('0%')).toHaveLength(3);
    expect(screen.getAllByText('0 of 0')).toHaveLength(3);
  });
});
