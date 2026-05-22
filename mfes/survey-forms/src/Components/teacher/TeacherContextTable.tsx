import React from 'react';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import TeacherStatusChip from './TeacherStatusChip';
import type { ContextResponseInfo } from '../../utils/API/surveyService';

interface Row {
  id: string;
  label: string;
  subtitle?: string;
}

interface Props {
  rows: Row[];
  responseInfoById?: Record<string, ContextResponseInfo>;
  onRowAction: (row: Row) => void;
  expired?: boolean;
}

const TeacherContextTable: React.FC<Props> = ({
  rows,
  responseInfoById,
  onRowAction,
  expired,
}) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: '12px', border: '1px solid #E0E0E0', overflowX: 'auto' }}>
      <Table size="small" sx={{ minWidth: 480 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#fafafa' }}>
            <TableCell sx={{ fontWeight: 600 }}>Learner Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Survey Status</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Submission Date</TableCell>
            <TableCell
              align="right"
              sx={{
                fontWeight: 600,
                position: 'sticky',
                right: 0,
                backgroundColor: '#fafafa',
                zIndex: 1,
              }}
            >
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const info = responseInfoById?.[row.id];
            const status = info?.status;
            const isFillDisabled = !!(expired && (!status || status === 'none'));
            const submittedAt = info?.submittedAt
              ? new Date(info.submittedAt).toLocaleDateString()
              : '—';

            return (
              <TableRow key={row.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {row.label}
                  </Typography>
                  {row.subtitle && (
                    <Typography variant="caption" sx={{ color: '#7C766F', display: 'block' }}>
                      {row.subtitle}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <TeacherStatusChip status={status} />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: '#7C766F' }}>
                    {submittedAt}
                  </Typography>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    position: 'sticky',
                    right: 0,
                    backgroundColor: '#fff',
                    zIndex: 1,
                  }}
                >
                  <Button
                    size="small"
                    variant="contained"
                    onClick={isFillDisabled ? undefined : () => onRowAction(row)}
                    sx={{
                      backgroundColor: isFillDisabled ? '#E0E0E0' : '#FDBE16',
                      color: isFillDisabled ? '#9E9E9E' : '#1E1B16',
                      fontWeight: 600,
                      pointerEvents: isFillDisabled ? 'none' : 'auto',
                      boxShadow: 'none',
                      '&:hover': { backgroundColor: isFillDisabled ? '#E0E0E0' : '#e6ab0e', boxShadow: 'none' },
                    }}
                  >
                    {status === 'submitted' ? 'View' : status === 'draft' ? 'Continue' : 'Fill'}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TeacherContextTable;
