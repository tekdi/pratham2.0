import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, MenuItem } from '@mui/material';
import { useTranslation } from 'next-i18next';
import CommonDataTable from '@shared-lib-v2/lib/Table/CommonDataTable';
import Loader from '@shared-lib-v2/DynamicForm/components/Loader';
import { showToastMessage } from '@shared-lib-v2/DynamicForm/components/Toastify';
import LearnerSearchBar from './LearnerSearchBar';
import DropoutReasonModal from './DropoutReasonModal';
import {
  getBatchLearners,
  getLearnerStatus,
  getOjtAddress,
  getLearnerDisplayName,
  updateCohortMemberStatus,
  isMutationSuccess,
} from '../../services/myTeachingCenter/LearnerListService';
import {
  LEARNER_STATUS_LABEL_KEYS,
  LEARNER_STATUS_OPTIONS,
} from '../../services/myTeachingCenter/myTeachingCenter.config';
import { LearnerProgressStatus } from '../../utils/Interfaces';
import OjtAddressCell from './OjtAddressCell';

const PAGE_SIZE = 10;

interface LearnerListTableProps {
  batchCohortId: string;
  // Reports the learner count back to the caller instead of the caller
  // making its own separate cohortmember/list(limit:1) call just to get a
  // count — this table already fetches that same batch's learner list for
  // its own rows, and the response already carries totalCount. Only fired
  // for the unfiltered fetch (no search term, no status filter), since a
  // filtered totalCount doesn't represent the batch's full roster size.
  onTotalCountChange?: (count: number) => void;
}

const LearnerListTable: React.FC<LearnerListTableProps> = ({
  batchCohortId,
  onTotalCountChange,
}) => {
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LearnerProgressStatus | ''>('');
  const [rows, setRows] = useState<any[] | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [dropoutModalMembershipId, setDropoutModalMembershipId] = useState<string | number | null>(
    null
  );
  const [unmarking, setUnmarking] = useState<string | number | null>(null);

  const fetchLearners = async (page: number) => {
    try {
      const { userDetails, totalCount: total } = await getBatchLearners({
        batchCohortId,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
        name: searchTerm.trim() || undefined,
        status: statusFilter || undefined,
      });
      setRows(userDetails);
      setTotalCount(total);
      if (!searchTerm.trim() && !statusFilter) {
        onTotalCountChange?.(total);
      }
    } catch (error) {
      console.error('Error fetching batch learners:', error);
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
      setRows([]);
      setTotalCount(0);
    }
  };

  useEffect(() => {
    setCurrentPage(0);
    fetchLearners(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchCohortId, statusFilter, searchTerm]);

  const refreshCurrentPage = () => fetchLearners(currentPage);

  // A learner can only move to `dropout` from `in_training`, and can only
  // be moved back to `in_training` from `dropout` — every other status has
  // no Dropout action available at all.
  const handleUnmark = async (membershipId: string | number) => {
    if (unmarking) return;
    setUnmarking(membershipId);
    try {
      const result = await updateCohortMemberStatus({
        membershipId,
        memberStatus: 'in_training',
      });
      if (!isMutationSuccess(result)) {
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        return;
      }
      showToastMessage(t('MY_TEACHING_CENTER.LEARNER_UNMARKED_DROPOUT'), 'success');
      refreshCurrentPage();
    } finally {
      setUnmarking(null);
    }
  };

  // Assessment columns are intentionally omitted this phase (spec item 7 —
  // dynamic Assessment columns are explicit future work, not implemented
  // or hardcoded here).
  const columns = [
    {
      key: 'learnerName',
      label: t('MY_TEACHING_CENTER.LEARNER_NAME'),
      render: (row: any) => getLearnerDisplayName(row),
    },
    {
      key: 'ojtAddress',
      label: t('MY_TEACHING_CENTER.OJT_ADDRESS'),
      render: (row: any) => (
        <OjtAddressCell
          membershipId={row.cohortMembershipId}
          initialValue={getOjtAddress(row)}
          disabled={getLearnerStatus(row) === 'dropout'}
        />
      ),
    },
    {
      key: 'learnerStatus',
      label: t('MY_TEACHING_CENTER.LEARNER_STATUS'),
      render: (row: any) => {
        const status = getLearnerStatus(row);
        return status ? t(LEARNER_STATUS_LABEL_KEYS[status]) : '-';
      },
    },
    {
      key: 'dropout',
      label: t('MY_TEACHING_CENTER.DROPOUT_COLUMN'),
      render: (row: any) => {
        const status = getLearnerStatus(row);
        if (status === 'in_training') {
          return (
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => setDropoutModalMembershipId(row.cohortMembershipId)}
            >
              {t('MY_TEACHING_CENTER.MARK_AS_DROPOUT')}
            </Button>
          );
        }
        if (status === 'dropout') {
          return (
            <Button
              size="small"
              variant="outlined"
              disabled={unmarking === row.cohortMembershipId}
              onClick={() => handleUnmark(row.cohortMembershipId)}
            >
              {t('MY_TEACHING_CENTER.UNMARK_AS_DROPOUT')}
            </Button>
          );
        }
        return '-';
      },
    },
  ];

  return (
    <Box>
      <Box display="flex" flexWrap="wrap" alignItems="center" gap={2} sx={{ mb: 2 }}>
        <Box sx={{ flex: 1, minWidth: 260 }}>
          <LearnerSearchBar
            onSearch={(value) => setSearchTerm(value)}
            value={searchTerm}
            placeholder={t('MY_TEACHING_CENTER.SEARCH_LEARNER')}
            fullWidth
          />
        </Box>
        {/* Native MUI outlined-select label (notched border), matching the
            Status field design on /youthnet/l2-interested-queue. */}
        <TextField
          select
          size="small"
          label={t('MY_TEACHING_CENTER.LEARNER_STATUS')}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as LearnerProgressStatus | '')}
          sx={{ width: 160, mt: 2 }}
        >
          <MenuItem value="">{t('MY_TEACHING_CENTER.ALL_STATUSES')}</MenuItem>
          {LEARNER_STATUS_OPTIONS.map((status) => (
            <MenuItem key={status} value={status}>
              {t(LEARNER_STATUS_LABEL_KEYS[status])}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {rows != null ? (
        <CommonDataTable
          columns={columns}
          rows={rows}
          page={currentPage + 1}
          pageSize={PAGE_SIZE}
          totalCount={totalCount}
          onPageChange={(page: number) => {
            setCurrentPage(page - 1);
            fetchLearners(page - 1);
          }}
          emptyMessage={t('MY_TEACHING_CENTER.NO_LEARNERS_FOUND')}
        />
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center" sx={{ py: 4 }}>
          <Loader showBackdrop={false} loadingText={t('COMMON.LOADING')} />
        </Box>
      )}

      <DropoutReasonModal
        open={dropoutModalMembershipId !== null}
        onClose={() => setDropoutModalMembershipId(null)}
        cohortMembershipId={dropoutModalMembershipId}
        onMarked={refreshCurrentPage}
      />
    </Box>
  );
};

export default LearnerListTable;
