import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Button,
  Alert,
  Link,
  CircularProgress,
} from '@mui/material';
import { useState, useEffect } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckIcon from '@mui/icons-material/Check';
import Image from 'next/image';
import face from '../../../public/images/Group 3.png';
import tip from '../../../public/images/Group.png';
import { useSearchParams } from 'next/navigation';
import { showToastMessage } from '../ToastComponent/Toastify';
import { userCheck } from '@learner/utils/API/userService';
import { useTranslation } from '@shared-lib';

type Props = {
  username: string;
  onUsernameChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  confirmPassword: string;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitDisabled?: boolean;
  isGuardianConfirmed?: any;
  setIsGuardianConfirmed?: any;
  belowEighteen?: boolean;
  tenantName?: string;
};

const CreateAccountForm = ({
  username,
  onUsernameChange,
  password,
  onPasswordChange,
  confirmPassword,
  onConfirmPasswordChange,
  onSubmit,
  isSubmitDisabled = false,
  belowEighteen,
  tenantName,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const searchParams = useSearchParams();
  const newAccount = searchParams.get('newAccount');
  //const belowEighteen = newAccount === 'below-18';
  const [isGuardianConfirmed, setIsGuardianConfirmed] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirm((prev) => !prev);
  const { t } = useTranslation();

  const handleUsernameChange = (value: string) => {
    onUsernameChange(value);
    setUsernameError('');
  };

  const handleUsernameBlur = async (value: string) => {
    if (value) {
      try {
        const response = await userCheck({ username: value });
        const users = response?.result || [];
        if (users.length > 0) {
          setUsernameError(t('NAVAPATHAM.USERNAME_ALREADY_EXISTS'));
        } else {
          setUsernameError('');
        }
      } catch (error) {
        console.error('Error checking username:', error);
      }
    } else {
      setUsernameError('');
    }
  };

  const validatePassword = (value: string) => {
    return value.length >= 4;
  };
  const handleConsentform = () => {
    const isForNavaPatham =
      typeof window !== 'undefined'
        ? localStorage.getItem('isForNavaPatham') === 'true'
        : false;

    // Get the selected language from localStorage (same key as Header.jsx uses)
    const selectedLanguage =
      typeof window !== 'undefined'
        ? localStorage.getItem('lang') || 'en'
        : 'en';

    // Map language codes to lowercase language names for PDF file naming
    // Using the same language codes as Header.jsx
    const languageFileMap: { [key: string]: string } = {
      en: 'english',
      hi: 'hindi',
      mr: 'marathi',
      bn: 'bengali',
      as: 'assamese',
      guj: 'gujarati',
      kan: 'kannada',
      odi: 'odia',
      tam: 'tamil',
      tel: 'telugu',
      ur: 'urdu',
    };

    if (isForNavaPatham) {
      window.open('/files/telugu_consent_form.pdf', '_blank');
    } else {
      // Get the language name from the map, default to 'hindi'
      const languageName = languageFileMap[selectedLanguage] || 'hindi';
      
      if (belowEighteen) {
        // Use PDF file naming convention: consent_form_below_18_<language>.pdf
        window.open(`/files/consent_form_below_18_${languageName}.pdf`, '_blank');
      } else {
        // Use PDF file naming convention: consent_form_above_18_<language>.pdf
        window.open(`/files/consent_form_above_18_${languageName}.pdf`, '_blank');
      }
    }
  };
  const handlePrivacyGuidelines = () => {
    window.open('https://www.pratham.org/privacy-guidelines/', '_blank');
  };

  const isPasswordValid = validatePassword(password);
  const doPasswordsMatch = password === confirmPassword;

  const handleSubmit = () => {
    if (!doPasswordsMatch) {
      showToastMessage(t('NAVAPATHAM.PASSWORDS_DO_NOT_MATCH'), 'error');
      return;
    }

    if (!isPasswordValid) {
      showToastMessage(
        t('NAVAPATHAM.PASSWORD_DOES_NOT_MEET_REQUIREMENTS'),
        'error'
      );
      return;
    }

    onSubmit();
  };

  return (
    <>
      <Box
        sx={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          // justifyContent: 'center',
          fontFamily: `'Inter', sans-serif`, // assuming Inter or similar
          // mt: '15px',
        }}
      >
        <Typography variant="h1" fontWeight="bold" gutterBottom>
          {`${t('LEARNER_APP.REGISTRATION.GET_STARTED_WITH_YOUR_LEARNING_JOURNEY_NOW')} `}
        </Typography>

        <Typography
          sx={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '24px',
            letterSpacing: '0.5px',
            textAlign: 'center',
            p: '5px',
          }}
        >
          {/* Get vocational training to land
          <Box component="br" sx={{ display: { xs: 'block', sm: 'none' } }} />
          an entry level job with 2 months of
          <Box component="br" sx={{ display: { xs: 'block', sm: 'none' } }} />
          training */}
          {t('LEARNER_APP.REGISTRATION.CREATE_ACCOUNT_TO_PROGRAMS')}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '24px',
            letterSpacing: '0.5px',
            textAlign: 'center',
          }}
        >
          {t('NAVAPATHAM.ALREADY_SIGNED_UP')} ?{' '}
          <Link
            href="/login"
            underline="hover"
            color="secondary"
            sx={{ fontWeight: '500' }}
          >
            {t('NAVAPATHAM.CLICK_HERE_TO_LOGIN')}
          </Link>
        </Typography>
      </Box>
      <Box
        mx="auto"
        p={3}
        sx={{
          backgroundColor: 'white',
          maxWidth: {
            xs: 350,
            md: 800,
          },
        }}
      >
        {/* Header */}
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Image src={face} alt="Step Icon" />
          <Typography fontWeight={600}>
            2/2 {t('NAVAPATHAM.CREATE_USERNAME_PASSWORD')}
          </Typography>
        </Box>

        {/* Alert */}
        <Alert
          icon={<Image src={tip} alt="Tip Icon" />}
          severity="info"
          sx={{
            backgroundColor: '#F7EBD9',
            color: '#000',
            fontSize: '14px',
            mb: 3,
          }}
        >
          {t('NAVAPATHAM.CREDENTIALS_TIP')}
        </Alert>

        {/* Username */}
        <TextField
          label={t('NAVAPATHAM.USERNAME')}
          value={username}
          onChange={(e) => handleUsernameChange(e.target.value)}
          onBlur={(e) => handleUsernameBlur(e.target.value)}
          fullWidth
          margin="normal"
          error={!!usernameError}
          helperText={usernameError || t('NAVAPATHAM.USERNAME_HELPER')}
        />

        {/* Password */}
        <TextField
          label={t('NAVAPATHAM.PASSWORD')}
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePassword} edge="end">
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Validation checklist */}
        {password && !isPasswordValid && (
          <Box pl={1} pt={1}>
            <ValidationItem
              valid={password.length >= 4}
              label={t('LEARNER_APP.RESET_PASSWORD_FORM.PASSWORD_MIN_LENGTH')}            />
          </Box>
        )}

        {/* Confirm Password */}
        <TextField
          label={t('NAVAPATHAM.CONFIRM_PASSWORD')}
          type={showConfirm ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={toggleConfirmPassword} edge="end">
                  {showConfirm ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Consent */}
        <FormControlLabel
          control={
            <Checkbox
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
          }
          label={
            <Typography variant="h3">
              {t('NAVAPATHAM.I_HAVE_READ_AND_AGREE_TO_THE')}{' '}
              <Typography
                component="span"
                fontWeight="bold"
                color="#0071E3"
                onClick={handlePrivacyGuidelines}
                sx={{ cursor: 'pointer' }}
              >
                {t('NAVAPATHAM.PRIVACY_GUIDELINES')}
              </Typography>{' '}
              {t('NAVAPATHAM.AND_I_CONSENT_TO_THE_COLLECTION')}{' '}
              <Typography
                component="span"
                fontWeight="bold"
                color="#0071E3"
                onClick={handleConsentform}
                sx={{ cursor: 'pointer' }}
              >
                {t('NAVAPATHAM.CONSENT_FORM')}
              </Typography>
              .
            </Typography>
          }
          sx={{ mt: 2, alignItems: 'flex-start' }}
        />
        {belowEighteen && (
          <FormControlLabel
            control={
              <Checkbox
                checked={isGuardianConfirmed}
                onChange={(e) => setIsGuardianConfirmed(e.target.checked)}
                sx={{ alignSelf: 'flex-start', mt: 1 }}
              />
            }
            label={
              <Typography variant="h3">
                {t('NAVAPATHAM.PARENT_GUARDIAN_CONFIRMATION')}
              </Typography>
            }
          />
        )}

        {/* Submit Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={
            !agree ||
            isSubmitDisabled ||
            !isPasswordValid ||
            (belowEighteen && !isGuardianConfirmed) ||
            username === '' ||
            password === '' ||
            confirmPassword === '' ||
            usernameError !== ''
          }
          sx={{
            backgroundColor: '#FFCB05',
            color: 'black',
            fontWeight: '600',
            mt: 3,
            textTransform: 'none',
            borderRadius: 999,
            '&:hover': {
              backgroundColor: '#f2b800',
            },
            '&:disabled': {
              backgroundColor: '#E0E0E0',
              color: '#9E9E9E',
            },
          }}
        >
          {isSubmitDisabled ? (
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={20} sx={{ color: '#9E9E9E' }} />
              <span>{t('NAVAPATHAM.CREATING_ACCOUNT')}</span>
            </Box>
          ) : (
            t('NAVAPATHAM.CREATE_ACCOUNT')
          )}
        </Button>
      </Box>
    </>
  );
};

const ValidationItem = ({
  valid,
  label,
}: {
  valid: boolean;
  label: string;
}) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      color={valid ? 'green' : 'error.main'}
      fontSize="14px"
      fontWeight={400}
      mb={0.5}
    >
      <CheckIcon sx={{ fontSize: 16 }} />
      {label}
    </Box>
  );
};

export default CreateAccountForm;
