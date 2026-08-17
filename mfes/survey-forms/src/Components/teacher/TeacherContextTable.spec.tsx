import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TeacherContextTable from './TeacherContextTable';

const rows = [{ id: 'learner-1', label: 'Aarti Deshmukh', entriesCount: 2 }];

describe('TeacherContextTable — multi-entry buttons', () => {
  it('renders a single Fill/View/Continue button for single-entry surveys (unchanged)', () => {
    const onRowAction = jest.fn();
    render(
      <TeacherContextTable
        rows={rows}
        responseInfoById={{ 'learner-1': { status: 'none', submittedAt: null } }}
        onRowAction={onRowAction}
      />
    );
    expect(screen.getByRole('button', { name: 'Fill' })).toBeInTheDocument();
    expect(screen.queryByText(/New Entry/)).not.toBeInTheDocument();
  });

  it('renders "+ New Entry" and "View Entries (N)" for multi-entry surveys with existing entries', () => {
    const onNewEntry = jest.fn();
    const onViewEntries = jest.fn();
    render(
      <TeacherContextTable
        rows={rows}
        responseInfoById={{ 'learner-1': { status: 'submitted', submittedAt: '2026-07-14' } }}
        onRowAction={jest.fn()}
        surveyType="multi"
        onNewEntry={onNewEntry}
        onViewEntries={onViewEntries}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '+ New Entry' }));
    expect(onNewEntry).toHaveBeenCalledWith(rows[0]);

    fireEvent.click(screen.getByRole('button', { name: 'View Entries (2)' }));
    expect(onViewEntries).toHaveBeenCalledWith(rows[0]);
  });

  it('renders "Continue" instead of "+ New Entry" when a draft is already in progress, and no other entry can be started', () => {
    const onNewEntry = jest.fn();
    const row = { id: 'learner-3', label: 'Ojas Majage', entriesCount: 0, hasInProgress: true };
    render(
      <TeacherContextTable
        rows={[row]}
        responseInfoById={{ 'learner-3': { status: 'draft', submittedAt: null } }}
        onRowAction={jest.fn()}
        surveyType="multi"
        onNewEntry={onNewEntry}
        onViewEntries={jest.fn()}
      />
    );

    expect(screen.queryByRole('button', { name: '+ New Entry' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(onNewEntry).toHaveBeenCalledWith(row);
  });

  it('shows both "Continue" and "View Entries (N)" when a draft is in progress and prior entries exist', () => {
    render(
      <TeacherContextTable
        rows={[{ id: 'learner-4', label: 'Satish Mane', entriesCount: 1, hasInProgress: true }]}
        responseInfoById={{ 'learner-4': { status: 'draft', submittedAt: '2026-08-03' } }}
        onRowAction={jest.fn()}
        surveyType="multi"
        onNewEntry={jest.fn()}
        onViewEntries={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'View Entries (1)' })).toBeInTheDocument();
  });

  it('renders "Continue" (not "+ New Entry") for a learner already Completed who also has a separate draft entry in progress', () => {
    // This is the PS follow-up bug: overall status is "submitted" (Completed) once any
    // entry is submitted, but hasInProgress tracks the *separate* concurrent draft
    // independently — the button must key off hasInProgress, not the aggregate status.
    const onNewEntry = jest.fn();
    render(
      <TeacherContextTable
        rows={[{ id: 'learner-5', label: 'past learner', entriesCount: 2, hasInProgress: true }]}
        responseInfoById={{ 'learner-5': { status: 'submitted', submittedAt: '2026-08-03' } }}
        onRowAction={jest.fn()}
        surveyType="multi"
        onNewEntry={onNewEntry}
        onViewEntries={jest.fn()}
      />
    );

    expect(screen.queryByRole('button', { name: '+ New Entry' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'View Entries (2)' })).toBeInTheDocument();
  });

  it('hides "View Entries" for multi-entry surveys with zero entries', () => {
    render(
      <TeacherContextTable
        rows={[{ id: 'learner-2', label: 'Imran Shaikh', entriesCount: 0 }]}
        responseInfoById={{ 'learner-2': { status: 'none', submittedAt: null } }}
        onRowAction={jest.fn()}
        surveyType="multi"
        onNewEntry={jest.fn()}
        onViewEntries={jest.fn()}
      />
    );
    expect(screen.getByRole('button', { name: '+ New Entry' })).toBeInTheDocument();
    expect(screen.queryByText(/View Entries/)).not.toBeInTheDocument();
  });
});

describe('TeacherContextTable — sortable "Latest Submitted Date" header', () => {
  it('renders "Latest Submitted Date" as a clickable header and toggles sort on click', () => {
    const onSortToggle = jest.fn();
    render(
      <TeacherContextTable
        rows={rows}
        responseInfoById={{ 'learner-1': { status: 'submitted', submittedAt: '2026-07-14' } }}
        onRowAction={jest.fn()}
        sortOrder="desc"
        onSortToggle={onSortToggle}
      />
    );

    expect(screen.queryByText('Submission Date')).not.toBeInTheDocument();
    const header = screen.getByRole('button', { name: /Latest Submitted Date/ });
    fireEvent.click(header);
    expect(onSortToggle).toHaveBeenCalledTimes(1);
  });
});
