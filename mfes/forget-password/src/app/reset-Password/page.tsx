'use client';

import React, { useState } from 'react';
import SimpleModal from '@forget-password/Components/SimpleModal/SimpleModal';
import ResetPasswordForm from '@forget-password/Components/ResetPasswordForm/ResetPasswordForm';
import PasswordResetSuccess from '@forget-password/Components/PasswordResetSuccess/PasswordResetSuccess';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { forgetPassword } from '@forget-password/utils/API/resetPasswordService';
const ResetPasswordPage = ({}) => {
  const router = useRouter();

  const [resetPasswordSuccessModal, setResetPasswordSuccessModal] =
    useState(false);

  const onResetPassword = async (newPassword: string) => {
    try {
      let token = localStorage.getItem('tokenForResetPassword');
      if (token) {
        const response = await forgetPassword(newPassword, token);
        console.log(response);
        setResetPasswordSuccessModal(true);
      }
    } catch {}
  };

  const onCloseSuccessModal = () => {
    const route = localStorage.getItem('loginRoute');
    if (route) router.push(route);

    setResetPasswordSuccessModal(false);
  };

  return (
    <>
      <Box
        sx={{ p: 2, cursor: 'pointer', width: 'fit-content' }}
        onClick={() => router.back()}
      >
        <ArrowBackIcon
          sx={{ color: '#4B5563', '&:hover': { color: '#000' } }}
        />
      </Box>
      <ResetPasswordForm onSubmit={onResetPassword} />

      <SimpleModal
        open={resetPasswordSuccessModal}
        onClose={onCloseSuccessModal}
        showFooter
        primaryText={'Okay'}
        primaryActionHandler={onCloseSuccessModal}
      >
        <PasswordResetSuccess />
      </SimpleModal>
    </>
  );
};

export default ResetPasswordPage;
