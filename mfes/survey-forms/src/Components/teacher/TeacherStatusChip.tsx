import React from 'react';
import { Chip } from '@mui/material';

type TeacherStatus = 'none' | 'draft' | 'submitted' | string;

interface Props {
  status?: TeacherStatus;
}

const TeacherStatusChip: React.FC<Props> = ({ status }) => {
  if (!status || status === 'none') {
    return <Chip size="small" label="Not Started" variant="outlined" />;
  }
  if (status === 'draft') {
    return <Chip size="small" label="In Progress" sx={{ backgroundColor: '#FFF8E1', color: '#E65100' }} />;
  }
  if (status === 'submitted') {
    return (
      <Chip
        size="small"
        label="Completed"
        sx={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}
      />
    );
  }
  return <Chip size="small" label={status} variant="outlined" />;
};

export default TeacherStatusChip;
