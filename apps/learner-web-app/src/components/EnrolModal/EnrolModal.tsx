'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { sendOTP, verifyOTP } from '@learner/utils/API/OtPService';
import { userCheck } from '@learner/utils/API/userService';
import { firstLetterInUpperCase } from '@learner/utils/helper';
import { showToastMessage } from '@learner/components/ToastComponent/Toastify';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@shared-lib';
import MobileVerificationSuccess from '@learner/components/MobileVerificationSuccess/MobileVerificationSuccess';
import AccountExistsCard from '@learner/components/AccountExistsCard/AccountExistsCard';

type Step = 'mobile' | 'otp' | 'success' | 'account-exists';

interface EnrolModalProps {
  open: boolean;
  onClose: () => void;
  programName: string;
  tenantId: string;
}

const OTP_LENGTH = 4;
const RESEND_SECONDS = 120;

const EnrolModal: React.FC<EnrolModalProps> = ({
  open,
  onClose,
  programName,
  tenantId,
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>('mobile');
  const [mobile, setMobile] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [hash, setHash] = useState('');
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [loading, setLoading] = useState(false);
  const [existingFullName, setExistingFullName] = useState('');
  const [existingUsernames, setExistingUsernames] = useState<string[]>([]);
  const [hasExistingAccounts, setHasExistingAccounts] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (step !== 'otp' || timer === 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [step, timer]);

  const resetState = () => {
    setStep('mobile');
    setMobile('');
    setMobileError('');
    setOtp(Array(OTP_LENGTH).fill(''));
    setHash('');
    setTimer(RESEND_SECONDS);
    setExistingFullName('');
    setExistingUsernames([]);
    setHasExistingAccounts(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  // ── Step 1: Send OTP ──────────────────────────────────────────────
  const handleSendOTP = async () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setMobileError('Please enter a valid 10-digit mobile number');
      return;
    }
    setMobileError('');
    setLoading(true);
    try {
      const res = await sendOTP({ mobile: `${mobile}`, reason: 'signup' });
      const hash = res?.result?.data?.hash || res?.data?.hash || res?.hash;
      if (hash) {
        setHash(hash);
        setStep('otp');
        setTimer(RESEND_SECONDS);
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
      } else {
        showToastMessage('Failed to send OTP. Please try again.', 'error');
      }
    } catch {
      showToastMessage('Failed to send OTP. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: OTP input ──────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length < OTP_LENGTH) {
      showToastMessage('Please enter the complete OTP', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await verifyOTP({
        mobile: `${mobile}`,
        reason: 'signup',
        otp: otpValue,
        hash,
      });
      if (res?.result?.success || res?.result?.verified || res?.verified) {
        try {
          const checkRes = await userCheck({ mobile });
          const users: any[] = checkRes?.result || [];
          if (users.length > 0) {
            const first = users[0];
            setExistingFullName(
              firstLetterInUpperCase(
                `${first.firstName || ''} ${first.lastName || ''}`.trim()
              )
            );
            setExistingUsernames(users.map((u: any) => u.username));
            setHasExistingAccounts(true);
          }
        } catch {
          // non-blocking — proceed to success screen even if check fails
        }
        setStep('success');
      } else {
        showToastMessage('Invalid OTP. Please try again.', 'error');
      }
    } catch {
      showToastMessage('Verification failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setOtp(Array(OTP_LENGTH).fill(''));
    await handleSendOTP();
  };

  const maskedMobile = mobile ? `+91 ${mobile.slice(0, 2)}****${mobile.slice(-4)}` : '';

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '16px', overflow: 'visible' },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Header row */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 2.5,
            pt: 2,
          }}
        >
          {step === 'otp' ? (
            <Button
              startIcon={<ArrowBackIcon fontSize="small" />}
              onClick={() => { setStep('mobile'); setOtp(Array(OTP_LENGTH).fill('')); }}
              sx={{
                textTransform: 'none',
                color: '#1F1B13',
                fontFamily: 'Poppins',
                fontSize: '13px',
                p: 0,
                minWidth: 0,
              }}
            >
              Go back
            </Button>
          ) : (
            <Box />
          )}
          <IconButton size="small" onClick={handleClose} sx={{ color: '#666' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Program badge */}
        <Box sx={{ px: 2.5, pt: 1, pb: 0.5 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              backgroundColor: '#FFF9E6',
              border: '1px solid #F5E199',
              borderRadius: '8px',
              px: 1.5,
              py: 0.6,
            }}
          >
            <Box
              component="img"
              src="/images/Pratham_Logo.png"
              alt="logo"
              sx={{ height: 18, objectFit: 'contain' }}
            />
            <Typography
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 600,
                fontSize: '13px',
                color: '#1F1B13',
              }}
            >
              {programName}
            </Typography>
          </Box>
        </Box>

        {/* ── Step 1: Mobile ── */}
        {step === 'mobile' && (
          <Box sx={{ px: 2.5, pt: 2, pb: 3 }}>
            <Typography
              sx={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '20px', mb: 0.5 }}
            >
              Enter Mobile Number
            </Typography>
            <Typography
              sx={{ fontFamily: 'Poppins', fontSize: '13px', color: '#555', mb: 2 }}
            >
              We'll send a verification code
            </Typography>

            <Box
              sx={{
                backgroundColor: '#F7F7F7',
                borderRadius: '8px',
                p: 1.5,
                mb: 2,
              }}
            >
              <Typography sx={{ fontFamily: 'Poppins', fontSize: '12px', color: '#444', lineHeight: 1.6 }}>
                To begin your registration, please enter your mobile number.
                Don't have a mobile phone? You can enter your parent's or guardian's
                number instead.
                <br />
                We will send an OTP to this number for verification.
              </Typography>
            </Box>

            <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '13px', mb: 0.5 }}>
              Mobile Number
            </Typography>
            <TextField
              fullWidth
              value={mobile}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 10);
                setMobile(v);
                setMobileError('');
              }}
              placeholder="9999999999"
              error={!!mobileError}
              helperText={mobileError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px', color: '#1F1B13', fontWeight: 500 }}>
                      +91
                    </Typography>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontFamily: 'Poppins',
                  fontSize: '14px',
                  '&.Mui-focused fieldset': { borderColor: '#FDBE16' },
                },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              disableElevation
              disabled={loading}
              onClick={handleSendOTP}
              sx={{
                backgroundColor: '#FDBE16',
                color: '#1F1B13',
                fontFamily: 'Poppins',
                fontWeight: 700,
                fontSize: '15px',
                textTransform: 'none',
                borderRadius: '8px',
                py: 1.4,
                '&:hover': { backgroundColor: '#f0b000' },
                '&.Mui-disabled': { backgroundColor: '#FFE48A', color: '#1F1B13' },
              }}
            >
              {loading ? 'Sending…' : 'Send OTP'}
            </Button>
          </Box>
        )}

        {/* ── Step 3: Verification Success ── */}
        {step === 'success' && (
          <Box sx={{ px: 2.5, pt: 2, pb: 3 }}>
            <MobileVerificationSuccess />
            <Button
              fullWidth
              variant="contained"
              disableElevation
              onClick={() => {
                if (hasExistingAccounts) {
                  setStep('account-exists');
                } else {
                  handleClose();
                  router.push(`/registration?tenantId=Pratham&enroll=${encodeURIComponent(programName)}&mobile=${encodeURIComponent(mobile)}`);
                }
              }}
              sx={{
                mt: 3,
                backgroundColor: '#FDBE16',
                color: '#1F1B13',
                fontFamily: 'Poppins',
                fontWeight: 700,
                fontSize: '15px',
                textTransform: 'none',
                borderRadius: '8px',
                py: 1.4,
                '&:hover': { backgroundColor: '#f0b000' },
              }}
            >
              Continue
            </Button>
          </Box>
        )}

        {/* ── Step 4: Account Exists ── */}
        {step === 'account-exists' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', maxHeight: '70vh' }}>
            {/* Scrollable content area */}
            <Box sx={{ px: 2.5, pt: 2, overflowY: 'auto', flex: 1 }}>
              <AccountExistsCard
                fullName={existingFullName}
                usernames={existingUsernames}
                onLoginClick={(username) => {
                  handleClose();
                  router.push(`/login?tenantId=${tenantId}&username=${encodeURIComponent(username)}&AccountExists=true`);
                }}
              />
            </Box>

            {/* Sticky button at bottom */}
            <Box
              sx={{
                px: 2.5,
                py: 2,
                borderTop: '1px solid #F0F0F0',
                backgroundColor: '#fff',
                flexShrink: 0,
              }}
            >
              <Button
                fullWidth
                variant="contained"
                disableElevation
                onClick={() => {
                  handleClose();
                  router.push(`/registration?tenantId=Pratham&enroll=${encodeURIComponent(programName)}&mobile=${encodeURIComponent(mobile)}`);
                }}
                sx={{
                  backgroundColor: '#FDBE16',
                  color: '#1F1B13',
                  fontFamily: 'Poppins',
                  fontWeight: 700,
                  fontSize: '15px',
                  textTransform: 'none',
                  borderRadius: '8px',
                  py: 1.4,
                  '&:hover': { backgroundColor: '#f0b000' },
                }}
              >
                {t('LANDING.YES_CREATE_NEW_ACCOUNT') || 'Yes, Create New Account'}
              </Button>
            </Box>
          </Box>
        )}

        {/* ── Step 2: OTP ── */}
        {step === 'otp' && (
          <Box sx={{ px: 2.5, pt: 2, pb: 3 }}>
            <Typography
              sx={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '20px', mb: 0.5 }}
            >
              Enter Verification Code
            </Typography>
            <Typography sx={{ fontFamily: 'Poppins', fontSize: '13px', color: '#555', mb: 3 }}>
              {maskedMobile}
            </Typography>

            {/* OTP boxes */}
            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', mb: 3 }}>
              {otp.map((digit, idx) => (
                <TextField
                  key={idx}
                  inputRef={(el) => { otpRefs.current[idx] = el; }}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  inputProps={{ maxLength: 1, style: { textAlign: 'center', fontFamily: 'Poppins', fontWeight: 600, fontSize: '20px' } }}
                  sx={{
                    width: 56,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '&.Mui-focused fieldset': { borderColor: '#FDBE16', borderWidth: 2 },
                    },
                  }}
                />
              ))}
            </Box>

            <Button
              fullWidth
              variant="contained"
              disableElevation
              disabled={loading || otp.join('').length < OTP_LENGTH}
              onClick={handleVerify}
              sx={{
                backgroundColor: '#FDBE16',
                color: '#1F1B13',
                fontFamily: 'Poppins',
                fontWeight: 700,
                fontSize: '15px',
                textTransform: 'none',
                borderRadius: '8px',
                py: 1.4,
                mb: 1.5,
                '&:hover': { backgroundColor: '#f0b000' },
                '&.Mui-disabled': { backgroundColor: '#FFE48A', color: '#1F1B13' },
              }}
            >
              {loading ? 'Verifying…' : 'Verify'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              {timer > 0 ? (
                <Typography sx={{ fontFamily: 'Poppins', fontSize: '13px', color: '#888' }}>
                  Resend code in {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                </Typography>
              ) : (
                <Button
                  onClick={handleResend}
                  sx={{
                    textTransform: 'none',
                    fontFamily: 'Poppins',
                    fontSize: '13px',
                    color: '#FDBE16',
                    fontWeight: 600,
                    p: 0,
                  }}
                >
                  Resend code
                </Button>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EnrolModal;
