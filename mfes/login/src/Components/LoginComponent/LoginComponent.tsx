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
import { useTranslation } from 'next-i18next';
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
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false,
  });

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
        // mx: 'auto',
        p: 4,
        // border: '2px solid #007bff',
        borderRadius: 2,
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
        {/* {t('LOGIN_PAGE.LOGIN')} */}
        Login
      </Typography>

      <TextField
        label="UserName"
        //{t('LOGIN_PAGE.USERNAME')}
        name="username"
        value={formData.username}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        margin="normal"
      />

      <TextField
        label="Password"
        //{t('LOGIN_PAGE.PASSWORD')}
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        margin="normal"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword((prev) => !prev)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={1}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.remember}
              onChange={handleChange}
              name="remember"
            />
          }
          label="Remember Me"
          // {t('LOGIN_PAGE.REMEMBER_ME')}
        />
        <Typography
          variant="body2"
          color="secondary"
          sx={{ cursor: 'pointer' }}
          onClick={handleForgotPassword}
        >
          ForGot Password
          {/* {t('LOGIN_PAGE.FORGOT_PASSWORD')} */}
        </Typography>
      </Box>

      <Button
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
        onClick={handleLogin}
      >
        {/* {t('LOGIN_PAGE.LOGIN')} */}
        Login
      </Button>

      <Typography
        variant="body2"
        color="secondary"
        align="center"
        mt={2}
        sx={{ cursor: 'pointer' }}
        onClick={handleAddAccount}
      >
        {/* {t('LOGIN_PAGE.I_DONT_HAVE_ACCOUNT')} */}I dont have an Account
      </Typography>
    </Paper>
  );
};

export default LoginComponent;
