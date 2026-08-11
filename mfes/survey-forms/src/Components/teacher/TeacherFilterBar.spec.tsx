import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TeacherFilterBar from './TeacherFilterBar';

describe('TeacherFilterBar — Month control', () => {
  it('renders the Month filter when showMonthFilter is true and calls onMonthFilterChange', () => {
    const onMonthFilterChange = jest.fn();
    render(
      <TeacherFilterBar
        search=""
        onSearchChange={jest.fn()}
        showMonthFilter
        monthFilter="All"
        onMonthFilterChange={onMonthFilterChange}
      />
    );

    expect(screen.getByLabelText('Month')).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByLabelText('Month'));
    fireEvent.click(screen.getByText('July'));
    expect(onMonthFilterChange).toHaveBeenCalledWith('July');
  });

  it('does not render the Month control when its props are omitted', () => {
    render(<TeacherFilterBar search="" onSearchChange={jest.fn()} />);
    expect(screen.queryByLabelText('Month')).not.toBeInTheDocument();
  });

  it('does not render a sort control (sorting moved to the table header)', () => {
    render(<TeacherFilterBar search="" onSearchChange={jest.fn()} />);
    expect(screen.queryByLabelText('Sort by date')).not.toBeInTheDocument();
  });
});
