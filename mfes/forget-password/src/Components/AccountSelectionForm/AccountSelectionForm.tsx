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
  onNext: (selected: string) => void;
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
    if (selectedUsername) {
      onNext(selectedUsername);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#fefbe9"
      px={2} // Symmetric horizontal padding
    >
      <Typography variant="h6" mb={3} textAlign="center">
        Which account are you having trouble logging into?
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          width: '100%',
          maxWidth: 700,
        }}
      >
        <RadioGroup value={selectedUsername} onChange={handleChange}>
          {userAccounts &&
            userAccounts?.map((account) => (
              <Box
                key={account.username}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  mb: 1,
                  backgroundColor:
                    selectedUsername === account.username ? '#f3f3f3' : '#fff',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedUsername(account.username)} // make entire box clickable
              >
                <Box>
                  <Typography fontWeight="bold" noWrap>
                    {account.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'block',
                    }}
                  >
                    {account.username}
                  </Typography>
                </Box>

                <Radio
                  checked={selectedUsername === account.username}
                  value={account.username}
                  onChange={handleChange}
                />
              </Box>
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
