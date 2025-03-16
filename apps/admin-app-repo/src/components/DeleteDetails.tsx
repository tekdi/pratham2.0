import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';

interface DeleteDetailsProps {
  firstName: string;
  lastName: string;
  village: string;
  checked: boolean;
  setChecked: (checked: boolean) => void;
  reason: string;
  setReason: (reason: string) => void;
}

const DeleteDetails: React.FC<DeleteDetailsProps> = ({
  firstName,
  lastName,
  village,
  checked,
  setChecked,
  reason,
  setReason,
}) => {
  return (
    <>
      <Box
        sx={{
          border: '1px solid #ddd',
          borderRadius: 2,
          mb: 2,
          p: 1,
        }}
      >
        <Typography fontWeight="bold">
          {firstName} {lastName} test belongs to below center
        </Typography>
        <TextField fullWidth value={village} disabled sx={{ mt: 1 }} />
      </Box>

      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
        }
        label="Do you want to delete user from center?"
        sx={{ mb: checked ? 2 : 0 }}
      />

      {checked && (
        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <FormLabel sx={{ fontWeight: 'bold', mb: 1 }}>
            Reason for Deletion
          </FormLabel>
          <RadioGroup
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            <FormControlLabel
              value="Incorrect Data Entry"
              control={<Radio />}
              label="Incorrect Data Entry"
            />
            <FormControlLabel
              value="Duplicate User"
              control={<Radio />}
              label="Duplicate User"
            />
          </RadioGroup>
        </FormControl>
      )}
    </>
  );
};

export default DeleteDetails;
