import React, { useState } from 'react';
import { Box, Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useTheme } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useRouter } from 'next/router';
import { showToastMessage } from '../Toastify';
import { login } from '../../services/ProfileService';
export interface PasswordCreateProps {
  handleResetPassword: (password: string, username?: string) => void;
  editPassword?: boolean;
}
const PasswordCreate: React.FC<PasswordCreateProps> = ({
  handleResetPassword,
  editPassword = false,
}) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [oldPasswordError, setOldPasswordError] = useState(false);
  const [samePasswordError, setSamePasswordError] = useState(false);
  const [showValidationMessages, setShowValidationMessages] = useState(false);
  const [visibility, setVisibility] = useState({
    oldPassword: false,
    password: false,
    confirmPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const isEditPassword = router.pathname === '/edit-password';
  const isTemporaryPassword = typeof window !== 'undefined' && localStorage.getItem('temporaryPassword') === 'true';
  const username = typeof window !== 'undefined' ? localStorage.getItem('userIdName') || '' : '';

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setShowValidationMessages(!!value);
    validatePassword(value);
    if (samePasswordError) {
      setSamePasswordError(false);
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setConfirmPasswordError(value !== password);
  };

  const validatePassword = (value: string) => {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isValidLength = value.length >= 8;

    const isValid =
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar &&
      isValidLength;
    setPasswordError(!isValid);

    return isValid;
  };

  const isFormValid =
    !passwordError &&
    !confirmPasswordError &&
    !samePasswordError &&
    password &&
    confirmPassword &&
    (!editPassword || (editPassword && (isTemporaryPassword || oldPassword)));

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setSamePasswordError(false);

    if (editPassword) {
      // Skip old password check if temporary password is set
      if (isTemporaryPassword) {
        handleResetPassword(password, username);
        return;
      }

      if (oldPassword === password) {
        setSamePasswordError(true);
        return;
      }

      const userIdName = localStorage.getItem('userIdName');
      if (!userIdName) {
        showToastMessage(t('LOGIN_PAGE.NO_USERNAME'));
        return;
      }

      setLoading(true);

      try {
        const response = await login({
          username: userIdName,
          password: oldPassword,
        });
        if (response) {
          handleResetPassword(password);
        } else {
          setOldPasswordError(true);
        }
      } catch (error) {
        console.error('Error verifying old password', error);
        setOldPasswordError(true);
      } finally {
        setLoading(false);
      }
    } else {
      handleResetPassword(password);
    }
  };
  const handleToggleVisibility = (field: keyof typeof visibility) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <form autoComplete="off" onSubmit={handleFormSubmit}>
      {editPassword && isTemporaryPassword && (
        <Box
          sx={{
            width: '100%',
            marginBottom: '1.8rem',
          }}
        >
       <TextField
  id="username"
  name="username-field"
  label={t('LOGIN_PAGE.USERNAME') || 'Username'}
  value={username}
  disabled
  fullWidth
  InputLabelProps={{ shrink: true }}
  sx={{
    position: 'relative',

    '& .MuiInputBase-root.Mui-disabled': {
      backgroundColor: theme.palette.action.hover,
      borderRadius: '8px',
      cursor: 'not-allowed',
    },

    '& .MuiInputBase-input.Mui-disabled': {
      WebkitTextFillColor: theme.palette.text.primary,
      opacity: 0.75,
      cursor: 'not-allowed',      // 🚫 no text arrow
      caretColor: 'transparent',  // 🚫 no blinking cursor
    },

    '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.action.disabled,
    },

    '& .MuiInputLabel-root.Mui-disabled': {
      color: theme.palette.text.secondary,
    },

    /* 🔒 Lock icon on hover */
    '&:hover::after': {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '1rem',
      opacity: 0.6,
      pointerEvents: 'none',
    },
  }}
/>


        </Box>
      )}
      {editPassword && !isTemporaryPassword && (
        <Box
          sx={{
            width: '100%',
          }}
        >
          <TextField
            id="old-password"
            name="old-password-field" // Unique name to prevent autofill
            autoComplete="new-password" // Prevents autofill
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleToggleVisibility('oldPassword')}
                    edge="end"
                  >
                    {visibility.oldPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            type={visibility.oldPassword ? 'text' : 'password'}
            value={oldPassword}
            onChange={(e) => {
              setOldPassword(e.target.value);
              if (oldPasswordError) {
                setOldPasswordError(false);
              }
            }}
            error={oldPasswordError}
            helperText={
              oldPasswordError && t('LOGIN_PAGE.CURRENT_PASSWORD_NOT')
            }
            
            label={t('LOGIN_PAGE.OLD_PASSWORD')}
            fullWidth
            sx={{
              '.MuiFormHelperText-root.Mui-error': {
                color: theme.palette.error.main,
              },
            }}
          />
        </Box>
      )}

      <Box
        sx={{
          width: '100%',
          margin: isEditPassword ? '1.8rem 0 0' : '3.2rem 0 0',
        }}
      >
        <TextField
          id="password"
          name="new-password-field"
          autoComplete="new-password"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => handleToggleVisibility('password')}
                  edge="end"
                >
                  {visibility.password ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          type={visibility.password ? 'text' : 'password'}
          value={password}
          onChange={handlePasswordChange}
          error={passwordError || samePasswordError}
          FormHelperTextProps={{
            sx: {
              color:
                passwordError || samePasswordError
                  ? theme.palette.error.main
                  : 'inherit',
            },
          }}
          helperText={
            (passwordError && t('LOGIN_PAGE.YOUR_PASSWORD_NEED')) ||
            (samePasswordError && t('LOGIN_PAGE.PASSWORD_SAME_AS_OLD'))
          }
          label={t('LOGIN_PAGE.PASSWORD')}
          fullWidth
          sx={{
            '.MuiFormHelperText-root.Mui-error': {
              color:
                passwordError || samePasswordError
                  ? theme.palette.error.main
                  : 'inherit',
            },
          }}
        />
      </Box>

      {showValidationMessages && passwordError && (
        <>
          <Box sx={{ mt: 0.8, pl: '16px' }}>
            <Typography
              variant="body2"
              color={passwordError ? 'error' : 'textPrimary'}
              sx={{
                color: theme.palette.warning['A200'],
                fontSize: '12px',
                fontWeight: '400',
              }}
            >
              <Box
                sx={{
                  color:
                    password.match(/[A-Z]/) && password.match(/[a-z]/)
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                  fontSize: '12px',
                  fontWeight: '400',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <CheckIcon sx={{ fontSize: '15px' }} />{' '}
                {t('LOGIN_PAGE.INCLUDE_BOTH')}
              </Box>
              <Box
                sx={{
                  color: password.match(/\d/)
                    ? theme.palette.success.main
                    : theme.palette.error.main,
                  fontSize: '12px',
                  fontWeight: '400',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  pt: 0.3,
                }}
              >
                <CheckIcon sx={{ fontSize: '15px' }} />{' '}
                {t('LOGIN_PAGE.INCLUDE_NUMBER')}
              </Box>
              <Box
                sx={{
                  color: password.match(/[!@#$%^&*(),.?":{}|<>]/)
                    ? theme.palette.success.main
                    : theme.palette.error.main,
                  fontSize: '12px',
                  fontWeight: '400',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  pt: 0.3,
                }}
              >
                <CheckIcon sx={{ fontSize: '15px' }} />{' '}
                {t('LOGIN_PAGE.INCLUDE_SPECIAL')}
              </Box>
              <Box
                sx={{
                  color:
                    password.length >= 8
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                  fontSize: '12px',
                  fontWeight: '400',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  pt: 0.3,
                }}
              >
                <CheckIcon sx={{ fontSize: '15px' }} />
                {t('LOGIN_PAGE.MUST_BE_AT')}
              </Box>
            </Typography>
          </Box>
        </>
      )}

      <Box
        sx={{
          width: '100%',
        }}
        margin={'2rem 0 0'}
      >
        <TextField
          id="confirm-password"
          name="confirm-password-field" // Unique name to prevent autofill
          autoComplete="new-password" // Helps in preventing autofill
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => handleToggleVisibility('confirmPassword')}
                  edge="end"
                >
                  {visibility.confirmPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          type={visibility.confirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={confirmPasswordError}
          helperText={confirmPasswordError && t('LOGIN_PAGE.NOT_MATCH')}
          label={t('LOGIN_PAGE.CONFIRM_PASSWORD')}
          fullWidth
          sx={{
            '.MuiFormHelperText-root.Mui-error': {
              color: theme.palette.error.main,
            },
          }}
        />
      </Box>

      <Box>
        <Box
          alignContent={'center'}
          textAlign={'center'}
          marginTop={'2.5rem'}
          width={'100%'}
        >
          <Button
            variant="contained"
            type="submit"
            fullWidth={true}
            sx={{
              '@media (min-width: 900px)': {
                width: '50%',
              },
            }}
            className="one-line-text"
            disabled={!isFormValid || loading}
          >
            {isTemporaryPassword ? t('LOGIN_PAGE.SET_PASSWORD') : t('LOGIN_PAGE.RESET_PASSWORD')}
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default PasswordCreate;
