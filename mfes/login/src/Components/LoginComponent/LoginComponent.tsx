'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Paper,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Loader, useTranslation } from '@shared-lib'; // Updated import

interface LoginComponentProps {
  onLogin: (data: {
    username: string;
    password: string;
    remember: boolean;
  }) => void;
  handleAddAccount?: () => void;
  handleForgotPassword?: () => void;
}

const LoginComponent: React.FC<LoginComponentProps> = ({
  onLogin,
  handleAddAccount,
  handleForgotPassword,
}) => {
  const { t } = useTranslation(); // Initialize translation function
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false,
  });
  const storedConfig =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('uiConfig') || '{}')
      : {};

  const programName =
    typeof window !== 'undefined' ? localStorage.getItem('userProgram') : '';
  const programTenantId =
    typeof window !== 'undefined'
      ? localStorage.getItem('userProgramTenantId')
      : '';

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleLogin = () => {
    if (onLogin) onLogin(formData);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 400,
        p: 3,
        borderRadius: 2,
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 400,
            fontSize: '24px',
            lineHeight: '32px',
            letterSpacing: '0px',
            textAlign: 'center',
            mb: 3,
          }}
        >
          {t('LEARNER_APP.LOGIN.login_title')} {/* Internationalized title */}
        </Typography>

        <TextField
          label={t('LEARNER_APP.LOGIN.username_label')}
          name="username"
          value={formData.username}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          margin="normal"
        />

        <TextField
          label={t('LEARNER_APP.LOGIN.password_label')}
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          margin="normal"
          autoComplete="new-password" // <-- Prevent browser from injecting its UI
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box mt={1}>
          <Typography
            variant="body2"
            color="secondary"
            sx={{ cursor: 'pointer', mb: 1 }}
            onClick={handleForgotPassword}
          >
            {t('LEARNER_APP.LOGIN.forgot_password')}{' '}
            {/* Internationalized text */}
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.remember}
                onChange={handleChange}
                name="remember"
              />
            }
            label={t('LEARNER_APP.LOGIN.remember_me')}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            backgroundColor: '#FFC107',
            color: '#000',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#ffb300',
            },
          }}
        >
          {t('LEARNER_APP.LOGIN.login_button')}
        </Button>

        {(storedConfig?.showSignup === true ||
          Object.keys(storedConfig).length === 0) && (
          <Typography
            variant="body2"
            color="secondary"
            align="center"
            mt={2}
            sx={{ cursor: 'pointer' }}
            onClick={handleAddAccount}
          >
            {t('LEARNER_APP.LOGIN.no_account')}
          </Typography>
        )}

        {/* SSO Login Buttons */}
        {/*storedConfig?.sso?.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              width: '100%',
              mt: 2,
            }}
          >
            {storedConfig?.sso?.map((ssoOption: any, index: number) => {
              // Check if current domain is in enable_domain array
              const currentDomain =
                typeof window !== 'undefined' ? window.location.origin : '';
              const isDomainEnabled =
                ssoOption?.enable_domain?.includes(currentDomain) || false;

              if (!isDomainEnabled) return null;

              return (
                <Button
                  key={index}
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: 50,
                    backgroundColor: '#FDBE16',
                    '&:hover': {
                      backgroundColor: '#FDBE16',
                    },
                    flex: '1 1 calc(50% - 4px)', // Side by side layout with gap
                    minWidth: '120px',
                  }}
                  onClick={() => {
                    // Store program info and open SSO URL
                    if (typeof window !== 'undefined' && window.localStorage) {
                      localStorage.setItem('userProgram', programName || '');
                      localStorage.setItem('userProgramTenantId', programTenantId || '');
                      const uiConfig = storedConfig || {};
                      localStorage.setItem(
                        'uiConfig',
                        JSON.stringify(uiConfig)
                      );
                    }
                    // Construct SSO URL with callback parameters
                    const currentBaseUrl =
                      typeof window !== 'undefined'
                        ? window.location.origin
                        : '';
                    const callbackUrl = `${currentBaseUrl}/sso?env=newton&tenantid=${programTenantId}`;
                    const encodedCallbackUrl = callbackUrl;
                    // encodeURIComponent(callbackUrl);
                    // roleId
                    const ssoUrl = `${ssoOption?.url}?callbackurl=${encodedCallbackUrl}`;

                    // Open SSO URL in new tab
                    window.open(ssoUrl, '_blank');
                  }}
                >
                  {t(ssoOption?.label) || `Login with ${ssoOption?.type}`}
                </Button>
              );
            })}
          </Box>
        )}*/}
      </form>
    </Paper>
  );
};

export default LoginComponent;
