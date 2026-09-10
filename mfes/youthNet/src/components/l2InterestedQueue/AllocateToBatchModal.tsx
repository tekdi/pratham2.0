import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Autocomplete,
  TextField,
  Modal,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { showToastMessage } from '@shared-lib-v2/DynamicForm/components/Toastify';
import { getCohortList as searchCohorts } from '../../services/youthNet/Dashboard/VillageServices';
import { getCohortList as getMyCohorts } from '../../services/GetCohortList';
import { bulkCreateCohortMembers } from '../../services/CohortService';
import { updateUser } from '../../services/youthNet/Dashboard/UserServices';
import {
  buildBatchEnrollCustomFields,
  isUpdateUserSuccess,
  getUpdateUserErrorMessage,
  isBulkCreateCohortMembersSuccess,
} from '../../services/l2InterestedQueue/l2QueueHelpers';

interface AllocateToBatchModalProps {
  open: boolean;
  onClose: () => void;
  learners: any[];
  domain: string;
  courseId: string;
  courseName?: string;
  onAllocated: () => void;
}

interface Option {
  label: string;
  value: string;
}

// Center and Batch are hand-fetched, not DynamicForm schema fields: mycohorts
// returns the trainer's whole cohort tree with no server-side filter of its
// own, and /cohort/search's response needs client-side unwrapping too,
// neither of which DynamicForm's schema-driven api/dependent mechanism
// (simple label/value mapping only, no filtering) can express. Batch is
// scoped to the selected Center + the learner's own Domain/Course.
//
// filters.domain/filters.courses/filters.parentId on the Batch search are
// UNVERIFIED against the real backend — no existing caller in the codebase
// filters /cohort/search by a customField (only core fields:
// type/status/parentId/state/district/block). Modeled on the established
// "schema field name becomes filter key verbatim" convention, matching
// L2BatchCreate.js's own field names. Confirm end-to-end.
const AllocateToBatchModal: React.FC<AllocateToBatchModalProps> = ({
  open,
  onClose,
  learners,
  domain,
  courseId,
  courseName,
  onAllocated,
}) => {
  const [centerOptions, setCenterOptions] = useState<Option[] | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<Option | null>(null);

  const [batchOptions, setBatchOptions] = useState<Option[] | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<Option | null>(null);

  const [saving, setSaving] = useState(false);

  const loadCenters = async () => {
    setCenterOptions(null);
    setSelectedCenter(null);
    setBatchOptions(null);
    setSelectedBatch(null);
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    if (!userId) {
      setCenterOptions([]);
      return;
    }
    const raw = await getMyCohorts(userId, true, true);
    if (!raw || raw?.isAxiosError || raw instanceof Error) {
      showToastMessage('Something went wrong while fetching centers', 'error');
      setCenterOptions([]);
      return;
    }
    const list = Array.isArray(raw?.result) ? raw.result : [];
    const centers = list.filter(
      (c: any) =>
        (c.type === 'COHORT' || c.type === 'CENTER') &&
        !c.parentId &&
        (c.cohortStatus ?? c.status)?.toLowerCase() === 'active'
    );
    setCenterOptions(centers.map((c: any) => ({ label: c.cohortName || c.name, value: c.cohortId })));
  };

  useEffect(() => {
    if (open) {
      loadCenters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const loadBatches = async (centerId: string) => {
    setBatchOptions(null);
    setSelectedBatch(null);
    const raw = await searchCohorts({
      limit: 200,
      offset: 0,
      filters: {
        type: 'BATCH',
        status: ['active'],
        parentId: [centerId],
        domain: [domain],
        courses: [courseId],
      },
    });
    if (!raw || raw?.isAxiosError || raw instanceof Error) {
      showToastMessage('Something went wrong while fetching batches', 'error');
      setBatchOptions([]);
      return;
    }
    const list = raw?.results?.cohortDetails || [];
    setBatchOptions(list.map((b: any) => ({ label: b.name, value: b.cohortId })));
  };

  const handleCenterChange = (option: Option | null) => {
    setSelectedCenter(option);
    if (option) {
      loadBatches(option.value);
    } else {
      setBatchOptions(null);
      setSelectedBatch(null);
    }
  };

  const handleConfirm = async () => {
    if (!selectedBatch || saving) return;
    setSaving(true);
    try {
      const userIds = learners.map((l) => l.userId);

      // Create the real cohort membership first — only flip each learner's
      // L2_INTERESTED flag to "enrolled" once that actually succeeds, so we
      // never mark someone enrolled without a real batch membership behind it.
      const bulkResult = await bulkCreateCohortMembers({
        userId: userIds,
        cohortId: [selectedBatch.value],
      });
      if (!isBulkCreateCohortMembersSuccess(bulkResult)) {
        showToastMessage('Could not create batch membership', 'error');
        return;
      }
      const enrollFields = buildBatchEnrollCustomFields();
      const userResults = await Promise.all(
        userIds.map((id) => updateUser(id, { userData: {}, customFields: enrollFields }))
      );
      const failed = userResults.find((r) => !isUpdateUserSuccess(r));
      if (failed) {
        showToastMessage(
          getUpdateUserErrorMessage(failed) || 'Something went wrong',
          'error'
        );
        return;
      }
      showToastMessage('Learner(s) allocated to batch', 'success');
      onAllocated();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const theme = useTheme<any>();

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="allocate-batch-title">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '92%', sm: 520 },
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#fff',
          borderRadius: '12px',
          outline: 'none',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ p: 2, borderRadius: '12px 12px 0 0', backgroundColor: theme.palette.warning?.A400 }}
        >
          <Box>
            <Typography id="allocate-batch-title" variant="h6">
              Allocate to batch
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {learners.length} learner{learners.length > 1 ? 's' : ''} · course:{' '}
              {courseName || courseId}
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose} aria-label="Close">
            <CloseSharpIcon fontSize="small" />
          </IconButton>
        </Box>
        <Divider />

        <Box sx={{ p: 2, overflowY: 'auto' }}>
          <Autocomplete
            options={centerOptions || []}
            loading={centerOptions == null}
            getOptionLabel={(o) => o.label}
            value={selectedCenter}
            onChange={(_, option) => handleCenterChange(option)}
            renderInput={(params) => <TextField {...params} label="Center" />}
          />

          <Autocomplete
            sx={{ mt: 2 }}
            options={batchOptions || []}
            loading={!!selectedCenter && batchOptions == null}
            disabled={!selectedCenter}
            getOptionLabel={(o) => o.label}
            value={selectedBatch}
            onChange={(_, option) => setSelectedBatch(option)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Batch"
                placeholder={!selectedCenter ? 'Choose a center first' : undefined}
              />
            )}
          />
        </Box>

        <Divider />
        <Box display="flex" gap={1} justifyContent="flex-end" sx={{ p: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" disabled={!selectedBatch || saving} onClick={handleConfirm}>
            {saving ? <CircularProgress size={20} /> : 'Confirm allocation'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AllocateToBatchModal;
