// components/Buttons/ResetFiltersButton.tsx
import React from 'react';
import { Button, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ResetFiltersButtonProps {
  searchStoreKey: string;
  formRef: React.RefObject<any>;
  SubmitaFunction: (data: any) => void;
  setPrefilledFormData: (data: any) => void;
  defaultFilter?: Record<string, any>; // optional, fallback to stateId
}

const ResetFiltersButton: React.FC<ResetFiltersButtonProps> = ({
  searchStoreKey,
  formRef,
  SubmitaFunction,
  setPrefilledFormData,
  defaultFilter,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const handleReset = () => {
    const resetFormData =
      defaultFilter ||
      (localStorage.getItem('stateId')
        ? { state: [localStorage.getItem('stateId')] }
        : {
    "state": []
});

    localStorage.setItem(searchStoreKey, JSON.stringify(resetFormData));
    setPrefilledFormData(resetFormData);
    SubmitaFunction(resetFormData);

    if (formRef.current?.resetForm) {
      formRef.current.resetForm(resetFormData);
    }
  };

  return (
    <Button
      variant="outlined"
      color="primary"
      sx={{
        textTransform: 'none',
        fontSize: '14px',
        // color: theme.palette.primary['100'],
        width: '200px',
        marginRight: '10px',
      }}
      onClick={handleReset}
    >
      {t('COMMON.RESET_FILTERS')}
    </Button>
  );
};

export default ResetFiltersButton;
