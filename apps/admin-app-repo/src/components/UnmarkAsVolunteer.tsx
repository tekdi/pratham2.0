import { Checkbox, FormControlLabel } from '@mui/material';
import React from 'react';
import { useTranslation } from 'next-i18next';

interface UnmarkAsVolunteerProps {
  checked: boolean;
  setChecked: (checked: boolean) => void;
}

const UnmarkAsVolunteer: React.FC<UnmarkAsVolunteerProps> = ({
  checked,
  setChecked,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
        }
        label={t('YOUTH.DO_YOU_WANT_TO_UNMARK_AS_VOLUNTEER')}
        sx={{ mb: checked ? 2 : 0 }}
      />
    </>
  );
};

export default UnmarkAsVolunteer; 