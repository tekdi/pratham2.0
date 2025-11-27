import React, { useState } from 'react';
import { Box, Grid, Typography, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import Header from '@/components/Header';
import RegistrationPieChart from '@/components/UserRegistration/RegistrationPieChart';
import RegistrationTabs from '@/components/UserRegistration/RegistrationTabs';
import UserCard from '@/components/UserRegistration/UserCard';
import BottomActionBar from '@/components/UserRegistration/BottomActionBar';
import { userList } from '@/components/UserRegistration/dummyData';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withRole from '@/components/withRole';
import { TENANT_DATA } from '../../app.config';

const UserRegistrationList = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleUserSelect = (userId: number, selected: boolean) => {
    setSelectedUsers((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(userId);
      } else {
        newSet.delete(userId);
      }
      return newSet;
    });
  };

  const handleCancel = () => {
    setSelectedUsers(new Set());
  };

  const handleAssignBatch = () => {
    // TODO: Implement assign batch functionality
    console.log('Assign batch for users:', Array.from(selectedUsers));
  };

  const handleMoreOptions = () => {
    // TODO: Implement more options menu
    console.log('More options clicked');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FBF4E4', pb: selectedUsers.size > 0 ? '80px' : 0, overflowX: 'hidden' }}>
      <Header />
      <Box sx={{ 
        // mx: 'auto', 
       p: 2, 
        // maxWidth: { xs: '100%', sm: '600px', md: '900px' },
        // width: '100%',
        // boxSizing: 'border-box'
      }}>
        
        <RegistrationPieChart />
        
        <RegistrationTabs value={tabValue} onChange={handleTabChange} />
        
        {/* Search and Filter Row */}
        <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
            <Grid item xs={8} sm={9}>
                <TextField
                    fullWidth
                    placeholder="Search Learner.."
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{ 
                        bgcolor: '#fff', 
                        borderRadius: '100px',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '100px',
                            '& fieldset': { border: 'none' },
                        }
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon sx={{ color: '#7C766F' }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
            <Grid item xs={4} sm={3}>
                <Box sx={{ 
                    bgcolor: '#fff', 
                    borderRadius: '100px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    px: 2,
                    height: '40px',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                }}>
                     <Typography sx={{ fontSize: '14px', color: '#1E1B16', fontWeight: 500 }}>Filter by</Typography>
                     <FilterListIcon sx={{ color: '#1E1B16', fontSize: 20 }} />
                </Box>
            </Grid>
        </Grid>
        
        {/* Action Banner */}
        {selectedUsers.size === 0 && (
            <Box sx={{ bgcolor: '#EAE0D5', p: 1.5, mb: 2, borderRadius: '8px', textAlign: 'center' }}>
                <Typography sx={{ fontSize: '14px', color: '#4A4640', fontWeight: 500 }}>
                    To take action, select at least one learner
                </Typography>
            </Box>
        )}

        <Box sx={{ mt: 2 }}>
            {userList.map((user) => (
                <UserCard 
                    key={user.id} 
                    user={user}
                    isSelected={selectedUsers.has(user.id)}
                    onSelectChange={handleUserSelect}
                />
            ))}
        </Box>
      </Box>

      {/* Bottom Action Bar */}
      <BottomActionBar
        selectedCount={selectedUsers.size}
        onCancel={handleCancel}
        onAssignBatch={handleAssignBatch}
        onMoreOptions={handleMoreOptions}
      />
    </Box>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default withRole(TENANT_DATA.SECOND_CHANCE_PROGRAM)(UserRegistrationList);


