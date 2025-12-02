import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/material/styles';

interface RegistrationTabsProps {
  value: string;
  onChange: (event: React.SyntheticEvent, newValue: string) => void;
}

const RegistrationTabs: React.FC<RegistrationTabsProps> = ({ value, onChange }) => {
  return (
    <Box sx={{ width: '100%', bgcolor: 'transparent', mb: 2 }}>
      <Tabs
        value={value}
        onChange={onChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        textColor="inherit"
        sx={{
            '& .MuiTabs-indicator': {
                backgroundColor: '#FDBE16',
                height: '3px'
            },
            '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '14px',
                minWidth: 'auto',
                mr: 2,
                color: '#4A4640',
                '&.Mui-selected': {
                    color: '#1E1B16',
                }
            }
        }}
      >
        <Tab label="Action Pending" value="pending" />
        {/* Skip Assigned */}
        <Tab label="Archived" value="archived" />
        <Tab label="Upcoming" value="upcoming" />
      </Tabs>
    </Box>
  );
};

export default RegistrationTabs;
