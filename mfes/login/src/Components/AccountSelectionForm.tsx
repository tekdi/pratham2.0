'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Paper,
  Button,
} from '@mui/material';

interface UserAccount {
  name: string;
  username: string;
}

interface AccountSelectionFormProps {
  userAccounts: UserAccount[];
  onNext: (selected: UserAccount) => void;
}

const AccountSelectionForm: React.FC<AccountSelectionFormProps> = ({
  userAccounts,
  onNext,
}) => {
  const [selectedUsername, setSelectedUsername] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedUsername(event.target.value);
  };

  const handleSubmit = () => {
    const selected = userAccounts.find((u) => u.username === selectedUsername);
    if (selected) {
      onNext(selected);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      // bgcolor="#fefbe9"
    >
      <Typography variant="h6" mb={3}>
        Which account are you having trouble logging into?
      </Typography>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, width: 350 }}>
        <RadioGroup value={selectedUsername} onChange={handleChange}>
          {userAccounts.map((account) => (
            <FormControlLabel
              key={account.username}
              value={account.username}
              control={<Radio />}
              label={
                <Box>
                  <Typography fontWeight="bold">{account.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {account.username}
                  </Typography>
                </Box>
              }
              sx={{
                border: '1px solid #ccc',
                borderRadius: 2,
                px: 2,
                py: 1,
                mb: 1,
                backgroundColor:
                  selectedUsername === account.username ? '#f3f3f3' : '#fff',
              }}
            />
          ))}
        </RadioGroup>

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
          disabled={!selectedUsername}
          onClick={handleSubmit}
        >
          Next
        </Button>
      </Paper>
    </Box>
  );
};

export default AccountSelectionForm;
