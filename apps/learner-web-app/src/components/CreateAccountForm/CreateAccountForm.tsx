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
} from '@mui/material';
import { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Image from 'next/image';
import face from '../../../public/images/Group 3.png';
import tip from '../../../public/images/Group.png';

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
  isGuardianConfirmed,
  setIsGuardianConfirmed,
  belowEighteen,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  //   const [isGuardianConfirmed, setIsGuardianConfirmed] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirm((prev) => !prev);

  return (
    <Box maxWidth={800} mx="auto" p={3} sx={{ backgroundColor: 'white' }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Image src={face} alt="Step Icon" />
        <Typography fontWeight={600}>
          2/2 Create your username & password
        </Typography>
      </Box>

      {/* Alert */}
      <Alert
        icon={<Image src={tip} alt="Step Icon" />}
        severity="info"
        sx={{
          backgroundColor: '#F7EBD9',
          color: '#000',
          fontSize: '14px',
          mb: 3,
        }}
      >
        Tip: Note down your credentials somewhere safe so you have it handy!
      </Alert>

      {/* Username */}
      <TextField
        label="Username"
        value={username}
        onChange={(e) => onUsernameChange(e.target.value)}
        fullWidth
        margin="normal"
        helperText="Make it unique! Customise it with your birth date or lucky number"
      />

      {/* Password */}
      <TextField
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        fullWidth
        margin="normal"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={togglePassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Confirm Password */}
      <TextField
        label="Confirm Password"
        type={showConfirm ? 'text' : 'password'}
        value={confirmPassword}
        onChange={(e) => onConfirmPasswordChange(e.target.value)}
        fullWidth
        margin="normal"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={toggleConfirmPassword} edge="end">
                {showConfirm ? <VisibilityOff /> : <Visibility />}
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
          <Typography fontSize="14px">
            I have read and agree to the{' '}
            <Typography component="span" fontWeight="bold" color="#0071E3">
              Privacy Guidelines
            </Typography>{' '}
            and I consent to the collection and use of my personal data as
            described in the{' '}
            <Typography component="span" fontWeight="bold" color="#0071E3">
              Consent Form
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
            <Typography fontSize="14px">
              I confirm this checkbox is filled out by the parent/guardian of
              the learner.
            </Typography>
          }
        />
      )}

      {/* Submit Button */}
      <Button
        fullWidth
        variant="contained"
        onClick={onSubmit}
        disabled={!agree || isSubmitDisabled}
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
        }}
      >
        Create Account
      </Button>
    </Box>
  );
};

export default CreateAccountForm;
