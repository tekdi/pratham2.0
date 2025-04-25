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
import CheckIcon from '@mui/icons-material/Check';
import Image from 'next/image';
import face from '../../../public/images/Group 3.png';
import tip from '../../../public/images/Group.png';
import { useSearchParams } from 'next/navigation';
import { showToastMessage } from '../ToastComponent/Toastify';

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
  belowEighteen,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const searchParams = useSearchParams();
  const newAccount = searchParams.get('newAccount');
  //const belowEighteen = newAccount === 'below-18';
  const [isGuardianConfirmed, setIsGuardianConfirmed] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirm((prev) => !prev);

  const validatePassword = (value: string) => {
    return (
      /[A-Z]/.test(value) &&
      /[a-z]/.test(value) &&
      /\d/.test(value) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(value) &&
      value.length >= 8
    );
  };

  const isPasswordValid = validatePassword(password);
  const doPasswordsMatch = password === confirmPassword;

  const handleSubmit = () => {
    if (!doPasswordsMatch) {
      showToastMessage('Passwords do not match', 'error');
      return;
    }

    if (!isPasswordValid) {
      showToastMessage('Password does not meet requirements', 'error');
      return;
    }

    onSubmit();
  };

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
        icon={<Image src={tip} alt="Tip Icon" />}
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

      {/* Validation checklist */}
      {password && !isPasswordValid && (
        <Box pl={1} pt={1}>
          <ValidationItem
            valid={/[A-Z]/.test(password) && /[a-z]/.test(password)}
            label="Include both uppercase and lowercase letters"
          />
          <ValidationItem
            valid={/\d/.test(password)}
            label="Include at least one number"
          />
          <ValidationItem
            valid={/[!@#$%^&*(),.?":{}|<>]/.test(password)}
            label="Include at least one special character"
          />
          <ValidationItem
            valid={password.length >= 8}
            label="At least 8 characters"
          />
        </Box>
      )}

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
        onClick={handleSubmit}
        disabled={
          !agree ||
          isSubmitDisabled ||
          !isPasswordValid ||
          (belowEighteen && !isGuardianConfirmed) ||
          username === '' ||
          password === '' ||
          confirmPassword === ''
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
        }}
      >
        Create Account
      </Button>
    </Box>
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
