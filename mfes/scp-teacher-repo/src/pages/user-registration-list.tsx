import React, { useState } from 'react';
import { Box, Grid, Typography, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import Header from '../components/Header';
import RegistrationPieChart from '../components/UserRegistration/RegistrationPieChart';
import RegistrationTabs from '../components/UserRegistration/RegistrationTabs';
import UserCard from '../components/UserRegistration/UserCard';
import BottomActionBar from '../components/UserRegistration/BottomActionBar';
import AssignBatchModal from '../components/UserRegistration/AssignBatchModal';
import AssignBatchSuccessModal from '../components/UserRegistration/AssignBatchSuccessModal';
import MoreOptionsBottomSheet from '../components/UserRegistration/MoreOptionsBottomSheet';
import { userList } from '../components/UserRegistration/dummyData';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withRole from '../components/withRole';
import { TENANT_DATA } from '../../app.config';

const UserRegistrationList = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
  const [assignBatchModalOpen, setAssignBatchModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [selectedBatchName, setSelectedBatchName] = useState('');
  const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);
  const [users, setUsers] = useState([...userList]);

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
    setAssignBatchModalOpen(true);
  };

  const handleAssignBatchSubmit = (data: { mode: string; center: string; batch: string }) => {
    // Close assign batch modal
    setAssignBatchModalOpen(false);
    // Set batch name for success modal
    setSelectedBatchName(data.batch);
    // Open success modal
    setSuccessModalOpen(true);
    // Clear selections
    setSelectedUsers(new Set());
  };

  const handleCallLogUpdate = (userId: number, callLog: { date: string; note: string }) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              callLogs: [...user.callLogs, { date: callLog.date, status: 'Logged', note: callLog.note }],
            }
          : user
      )
    );
  };

  const handleMoreOptions = () => {
    setMoreOptionsOpen(true);
  };

  const handleNotInterested = () => {
    // TODO: Implement not interested action
    console.log('Not interested for learners:', Array.from(selectedUsers));
    setSelectedUsers(new Set());
  };

  const handleMayJoinNextYear = () => {
    // TODO: Implement may join next year action
    console.log('May join next year for learners:', Array.from(selectedUsers));
    setSelectedUsers(new Set());
  };

  const selectedLearnerNames = users
    .filter((user) => selectedUsers.has(user.id))
    .map((user) => user.name);

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
            {users.map((user) => (
                <UserCard 
                    key={user.id} 
                    user={user}
                    isSelected={selectedUsers.has(user.id)}
                    onSelectChange={handleUserSelect}
                    onCallLogUpdate={handleCallLogUpdate}
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

      {/* Assign Batch Modal */}
      <AssignBatchModal
        open={assignBatchModalOpen}
        onClose={() => setAssignBatchModalOpen(false)}
        selectedLearners={selectedLearnerNames}
        onAssign={handleAssignBatchSubmit}
      />

      {/* Success Modal */}
      <AssignBatchSuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        batchName={selectedBatchName}
      />

      {/* More Options Bottom Sheet */}
      <MoreOptionsBottomSheet
        open={moreOptionsOpen}
        onClose={() => setMoreOptionsOpen(false)}
        selectedCount={selectedUsers.size}
        onNotInterested={handleNotInterested}
        onMayJoinNextYear={handleMayJoinNextYear}
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
