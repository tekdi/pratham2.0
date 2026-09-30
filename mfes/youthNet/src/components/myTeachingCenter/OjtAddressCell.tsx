import React, { useState } from 'react';
import { TextField, InputAdornment, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useTranslation } from 'next-i18next';
import { showToastMessage } from '@shared-lib-v2/DynamicForm/components/Toastify';
import {
  updateCohortMemberStatus,
  isMutationSuccess,
} from '../../services/myTeachingCenter/LearnerListService';
import { OJT_ADDRESS_FIELD_ID } from '../../services/myTeachingCenter/myTeachingCenter.config';

type CellStatus = 'idle' | 'saving' | 'saved' | 'error';

interface OjtAddressCellProps {
  membershipId: string | number;
  initialValue: string;
  disabled?: boolean;
}

// Save-on-blur only — no separate Save button/column. Each cell owns its
// own value/status so one row saving or erroring never affects another.
// Disabled for a dropped-out learner — OJT tracking doesn't apply once
// they're no longer active in training.
const OjtAddressCell: React.FC<OjtAddressCellProps> = ({
  membershipId,
  initialValue,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(initialValue || '');
  const [lastSaved, setLastSaved] = useState(initialValue || '');
  const [status, setStatus] = useState<CellStatus>('idle');

  const handleBlur = async () => {
    if (value === lastSaved) return;
    setStatus('saving');
    const result = await updateCohortMemberStatus({
      membershipId,
      dynamicBody: {
        customFields: [{ fieldId: OJT_ADDRESS_FIELD_ID, value }],
      },
    });
    if (isMutationSuccess(result)) {
      setStatus('saved');
      setLastSaved(value);
      showToastMessage(t('MY_TEACHING_CENTER.OJT_ADDRESS_SAVED'), 'success');
    } else {
      setStatus('error');
      showToastMessage(t('MY_TEACHING_CENTER.OJT_ADDRESS_SAVE_FAILED'), 'error');
    }
  };

  return (
    <TextField
      size="small"
      variant="outlined"
      disabled={disabled}
      placeholder={t('MY_TEACHING_CENTER.OJT_ADDRESS_PLACEHOLDER')}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      sx={{ minWidth: 220 }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {status === 'saving' && <CircularProgress size={16} />}
            {status === 'saved' && <CheckCircleIcon color="success" fontSize="small" />}
            {status === 'error' && <ErrorIcon color="error" fontSize="small" />}
          </InputAdornment>
        ),
      }}
    />
  );
};

export default OjtAddressCell;
