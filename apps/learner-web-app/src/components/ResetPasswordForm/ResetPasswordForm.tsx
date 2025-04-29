import React, { useState } from 'react';
import {
  TextField,
  IconButton,
  InputAdornment,
  Button,
  Typography,
  Box,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { login, resetPassword } from '@learner/utils/API/LoginService';
import { showToastMessage } from '../ToastComponent/Toastify';

interface ResetPasswordFormProps {
  onResetPassword: (
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => void;
  onForgotPassword: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onResetPassword,
  onForgotPassword,
}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      showToastMessage('Please fill in all fields.', 'error');
      return;
    } else if (newPassword !== confirmPassword) {
      showToastMessage(
        'New Password and Confirm Password must be the same.',
        'error'
      );
      return;
    }

    onResetPassword(oldPassword, newPassword, confirmPassword);
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: '0 auto',
        p: 3,
        bgcolor: '#fff',
        borderRadius: 2,
        boxShadow: 3,
        textAlign: 'center',
      }}
    >
      <TextField
        label="Old Password"
        type={showPassword ? 'text' : 'password'}
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        fullWidth
        variant="outlined"
        sx={{ mb: 2 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={toggleShowPassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="New Password"
        type={showPassword ? 'text' : 'password'}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        fullWidth
        variant="outlined"
        sx={{ mb: 2 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={toggleShowPassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Confirm New Password"
        type={showPassword ? 'text' : 'password'}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
        variant="outlined"
        sx={{ mb: 3 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={toggleShowPassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        variant="contained"
        fullWidth
        onClick={handleSubmit}
        sx={{
          backgroundColor: '#FFC107',
          color: '#000',
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: '#FFB300',
          },
          mb: 2,
        }}
      >
        Reset Password
      </Button>

      <Typography
        variant="body2"
        color="secondary"
        sx={{ cursor: 'pointer', textDecoration: 'underline' }}
        onClick={onForgotPassword}
      >
        Forgot Password?
      </Typography>
    </Box>
  );
};

export default ResetPasswordForm;
