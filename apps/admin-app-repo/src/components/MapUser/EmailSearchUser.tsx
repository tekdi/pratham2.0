import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  CircularProgress,
} from '@mui/material';
import { post } from '@/services/RestClient';
import { showToastMessage } from '@/components/Toastify';
import { transformLabel } from '@/utils/Helper';
import { API_ENDPOINTS } from '@/utils/API/APIEndpoints';

interface EmailSearchUserProps {
  onUserSelected?: (userId: string) => void;
}

interface UserDetails {
  userId: string;
  name: string;
  dob: string | null;
  mobile: string | null;
  state: string;
  district: string;
  block: string;
  village: string;
}

const EmailSearchUser: React.FC<EmailSearchUserProps> = ({
  onUserSelected,
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  const fetchUserByEmail = async () => {
    if (!email || !email.trim()) {
      showToastMessage('Please enter an email address', 'error');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToastMessage('Please enter a valid email address', 'error');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = API_ENDPOINTS.usersHierarchyView;

      const requestBody = {
        limit: 0,
        offset: 0,
        email: email.trim(),
      };

      const response = await post(apiUrl, requestBody);

      if (
        response?.data?.responseCode === 200 &&
        response?.data?.result?.user
      ) {
        const user = response.data.result.user;

        // Extract user details
        const extractedUserId = user.userId;
        const name =
          user.name ||
          `${user.firstName || ''} ${user.middleName || ''} ${
            user.lastName || ''
          }`.trim();
        const dob = user.dob || null;
        const mobile = user.mobile || null;

        // Extract custom fields - STATE, DISTRICT, BLOCK, VILLAGE
        // These fields are extracted from the customFields array by matching the label property
        // Example: { label: "STATE", selectedValues: ["Maharashtra"] } or { label: "STATE", selectedValues: [{ value: "Maharashtra" }] }
        const customFields = user.customFields || [];
        const stateField = customFields.find(
          (field: any) => field.label === 'STATE'
        );
        const districtField = customFields.find(
          (field: any) => field.label === 'DISTRICT'
        );
        const blockField = customFields.find(
          (field: any) => field.label === 'BLOCK'
        );
        const villageField = customFields.find(
          (field: any) => field.label === 'VILLAGE'
        );

        // Handle both string and object formats in selectedValues
        // String format: selectedValues: ["EK0112"]
        // Object format: selectedValues: [{ value: "EK0112" }]
        // Returns empty string if field doesn't exist or has no values
        const getFieldValue = (field: any) => {
          if (!field?.selectedValues?.[0]) return '';
          const firstValue = field.selectedValues[0];
          return typeof firstValue === 'string'
            ? firstValue
            : firstValue?.value || '';
        };

        const state = getFieldValue(stateField);
        const district = getFieldValue(districtField);
        const block = getFieldValue(blockField);
        const village = getFieldValue(villageField);

        const details: UserDetails = {
          userId: extractedUserId,
          name: name,
          dob: dob,
          mobile: mobile,
          state: state,
          district: district,
          block: block,
          village: village,
        };

        setUserDetails(details);
        setUserId(extractedUserId);
        setIsUserLoaded(true);

        // Call callback with userId
        if (onUserSelected) {
          onUserSelected(extractedUserId);
        }

        showToastMessage('User details fetched successfully', 'success');
      } else {
        showToastMessage('User not found with this email address', 'error');
        resetUserData();
      }
    } catch (error: any) {
      console.error('Error fetching user:', error);
      const errorMessage =
        error?.response?.data?.params?.errmsg ||
        'Failed to fetch user details. Please try again.';
      showToastMessage(errorMessage, 'error');
      resetUserData();
    } finally {
      setLoading(false);
    }
  };

  const resetUserData = () => {
    setUserDetails(null);
    setUserId(null);
    setIsUserLoaded(false);
    if (onUserSelected) {
      onUserSelected('');
    }
  };

  const handleChangeUser = () => {
    setEmail('');
    resetUserData();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="body1" color="text.secondary">
        Search for an existing user by email and allocate a center to them
      </Typography>
      {/* Email Input Section */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        <TextField
          fullWidth
          label="Enter user email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isUserLoaded}
          variant="outlined"
          type="email"
          sx={{ flex: 1 }}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !isUserLoaded && !loading) {
              fetchUserByEmail();
            }
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={isUserLoaded ? handleChangeUser : fetchUserByEmail}
          disabled={loading}
          sx={{ minWidth: '150px', height: '56px' }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : isUserLoaded ? (
            'Change User'
          ) : (
            'Fetch User'
          )}
        </Button>
      </Box>

      {/* User Details Section */}
      {isUserLoaded && userDetails && (
        <Box
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            p: 3,
            backgroundColor: '#f9f9f9',
          }}
        >
          <Typography
            variant="h1"
            sx={{ mb: 2,  color: '#000000' }}
          >
            User Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Name
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 'medium', mt: 0.5 }}
              >
                {userDetails.name || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Date of Birth
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 'medium', mt: 0.5 }}
              >
                {formatDate(userDetails.dob)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Mobile Number
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 'medium', mt: 0.5 }}
              >
                {userDetails.mobile || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                User State
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 'medium', mt: 0.5 }}
              >
                {transformLabel(userDetails.state) || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                User District
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 'medium', mt: 0.5 }}
              >
                {transformLabel(userDetails.district) || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Block
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 'medium', mt: 0.5 }}
              >
                {transformLabel(userDetails.block) || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Village
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 'medium', mt: 0.5 }}
              >
                {transformLabel(userDetails.village) || 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default EmailSearchUser;
