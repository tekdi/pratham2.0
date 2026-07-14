import React from 'react';
import {
  Avatar,
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { CommonPagination } from '@shared-lib-v2/lib/Pagination/CommonPagination';
import { IndividualProgressTableProps } from '../../utils/Interface';
import { EMPLOYEES_PER_PAGE } from '../../utils/app.config';
import { getUserInitials } from '../../utils/managerDashboardHelpers';
import NoDataFound from '../common/NoDataFound';
import UserCourseProgress from './UserCourseProgress';
import EmployeeFlags from './EmployeeFlags';

const IndividualProgressTable: React.FC<IndividualProgressTableProps> = ({
  rows,
  loading,
  error,
  currentPage,
  totalPages,
  totalEmployees,
  onPageChange,
  onViewEmployee,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <Typography variant="h6">{t('MANAGER_OVERVIEW.LOADING_TEAM')}</Typography>
      </Box>
    );
  }

  if (error) {
    return <NoDataFound title="MANAGER_OVERVIEW.TEAM_LOAD_FAILED" />;
  }

  if (rows.length === 0) {
    return <NoDataFound title="MANAGER_OVERVIEW.NO_EMPLOYEES_FOUND" />;
  }

  const headCellSx = {
    fontWeight: 500,
    fontSize: '13px',
    color: theme.palette.text.secondary,
    borderBottom: `1px solid ${theme.palette.warning['800']}`,
    whiteSpace: 'nowrap',
  };

  return (
    <>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: { xs: 900, md: '100%' } }}>
          <TableHead>
            <TableRow>
              <TableCell sx={headCellSx}>{t('EMPLOYEE')}</TableCell>
              <TableCell sx={headCellSx}>{t('MANAGER_OVERVIEW.COL_MANDATORY_COURSES')}</TableCell>
              <TableCell sx={headCellSx}>{t('MANAGER_OVERVIEW.COL_NON_MANDATORY')}</TableCell>
              <TableCell sx={headCellSx}>{t('MANAGER_OVERVIEW.COL_FLAGS')}</TableCell>
              <TableCell sx={headCellSx} />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.userId} sx={{ '&:hover': { backgroundColor: theme.palette.warning['800'] } }}>
                <TableCell sx={{ py: 1.25 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: theme.palette.warning['800'],
                        color: theme.palette.text.primary,
                        fontWeight: 500,
                        fontSize: '13px',
                        flexShrink: 0,
                      }}
                    >
                      {getUserInitials(row.userName)}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Tooltip title={row.userName} arrow>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{
                            lineHeight: 1.3,
                            mb: 0.25,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            textTransform: 'capitalize',
                            maxWidth: 220,
                          }}
                        >
                          {row.userName}
                        </Typography>
                      </Tooltip>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell sx={{ minWidth: 200, py: 1.25 }}>
                  <UserCourseProgress statusCounts={row.mandatoryProgress} />
                </TableCell>
                <TableCell sx={{ minWidth: 200, py: 1.25 }}>
                  <UserCourseProgress statusCounts={row.nonMandatoryProgress} />
                </TableCell>
                <TableCell sx={{ py: 1.25 }}>
                  <EmployeeFlags flags={row.flags} />
                </TableCell>
                <TableCell sx={{ py: 1.25 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    endIcon={<ArrowForwardIcon sx={{fontSize: '11px'}} />}
                    onClick={() => onViewEmployee(row.userId)}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 500,
                      fontSize: '12px',
                      borderRadius: '7px',
                      borderColor: theme.palette.warning['A100'],
                      color: theme.palette.text.primary,
                      backgroundColor: 'white',
                      px: '10px',
                      py: '4px',
                      '&:hover': {
                        borderColor: theme.palette.warning['600'],
                        backgroundColor: theme.palette.warning['800'],
                      },
                    }}
                  >
                    {t('MANAGER_OVERVIEW.VIEW')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
        sx={{ mt: 2, pt: 1.5, borderTop: `1px solid ${theme.palette.warning['800']}` }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px', mb: 0 }}>
          {t('SHOWING')} {(currentPage - 1) * EMPLOYEES_PER_PAGE + 1}–
          {Math.min(currentPage * EMPLOYEES_PER_PAGE, totalEmployees)} {t('OF')} {totalEmployees} {t('EMPLOYEES')}
        </Typography>

        <CommonPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          firstLabel={t('COMMON.FIRST')}
          previousLabel={t('COMMON.PREV')}
          nextLabel={t('COMMON.NEXT')}
          lastLabel={t('COMMON.LAST')}
        />
      </Stack>
    </>
  );
};

export default IndividualProgressTable;
