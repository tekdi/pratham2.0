'use client';

import React, { useEffect, useState } from 'react';
import SimpleModal from '@forget-password/Components/SimpleModal/SimpleModal';

import AccountSelectionForm from '@forget-password/Components/AccountSelectionForm/AccountSelectionForm';
import OtpVerificationComponent from '@forget-password/Components/OtpVerificationComponent/OtpVerificationComponent';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { userCheck } from '@forget-password/utils/API/userService';
import { showToastMessage } from '@forget-password/Components/ToastComponent/Toastify';
import { sendOTP, verifyOTP } from '@forget-password/utils/API/OtPService';
import { maskMobileNumber } from '@forget-password/utils/Helper/helper';
import { Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
type UserAccount = {
  name: string;
  username: string;
};

const AccountSelectionPage = () => {
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [hash, setHash] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const mobile = searchParams.get('mobile');

  const [usernames, setUsernames] = useState<UserAccount[]>([]);
  const [otpmodal, setOtpModal] = useState(false);
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  useEffect(() => {
    const fetchUsernameByMobile = async () => {
      try {
        if (mobile) {
          const response = await userCheck({ mobile });
          console.log('response', response.result);
          const userList = response.result.map((user: any) => ({
            name: [user.firstName, user.middleName, user.lastName]
              .filter(Boolean)
              .join(' '),
            username: user.username,
          }));
          setUsernames(userList);
        }
      } catch {
        showToastMessage('please enter correct username', 'info');
      }
    };
    fetchUsernameByMobile();
  }, []);
  const handleNextStep = async (value: string) => {
    const isValidMobileNumber = /^[0-9]{10}$/.test(value);

    if (isValidMobileNumber) {
      //const userList = await fetchUsernamesByMobile(value);
    } else {
      const mobile = await fetchMobileByUsername(value);

      //  let mobile = '9087'; // currently assume here dummy mob number
      if (mobile) {
        try {
          let reason = 'signup'; // temporary taken signup cause api support only sinup reason
          const response = await sendOTP({ mobile, reason });
          console.log('sendOTP', response);
          setHash(response?.result?.data?.hash);
          setOtpModal(true);
          setMobileNumber(mobile);
        } catch (error) {}
      }
    }

    console.log('User input:', value);
  };

  const onVerify = async () => {
    // const isValid = await verifyOtp(otp);
    try {
      let mobile = mobileNumber;
      let reason = 'signup';

      const response = await verifyOTP({
        mobile,
        reason,
        otp: otp.join(''),
        hash,
      });
      console.log('verifyOtp', response);
      const isValid = response.result.success; // temporary assume true
      if (isValid) {
        router.push('/reset-Password');
        setOtpModal(false);
      } else {
        showToastMessage('Please enter valid otp', 'error');
      }
    } catch (error) {
      showToastMessage('Please enter valid otp', 'error');
    }
  };
  const fetchMobileByUsername = async (username: string) => {
    try {
      const response = await userCheck({ username });
      console.log('response', response?.result[0]?.mobile);
      response.result[0].mobile = '8793607919'; // temporary hardcoded
      if (response?.result[0]?.mobile) {
        return response?.result[0]?.mobile;
      } else {
        showToastMessage(
          'Unable to find mobile number on given username',
          'error'
        );
      }
    } catch {
      showToastMessage('please enter correct username', 'info');
    }
  };

  const onResend = async () => {
    try {
      let reason = 'signup';
      // temporary taken signup cause api support only sinup reason
      const response = await sendOTP({ mobile: mobileNumber, reason });
      console.log('sendOTP', response);
      setHash(response?.result?.data?.hash);
    } catch (error) {}
  };
  const handleCloseModal = () => setOtpModal(false);

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
      <AccountSelectionForm userAccounts={usernames} onNext={handleNextStep} />
      <SimpleModal
        open={otpmodal}
        onClose={handleCloseModal}
        showFooter
        primaryText={'Verify OTP'}
        modalTitle={'Verify Your Phone Number'}
        primaryActionHandler={onVerify}
      >
        <OtpVerificationComponent
          onResend={onResend}
          otp={otp}
          setOtp={setOtp}
          maskedNumber={maskMobileNumber(mobileNumber)}
        />
      </SimpleModal>
    </>
  );
};

export default AccountSelectionPage;
