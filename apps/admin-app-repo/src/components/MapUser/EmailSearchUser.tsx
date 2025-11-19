import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { post } from '@/services/RestClient';
import { showToastMessage } from '@/components/Toastify';
import { transformLabel } from '@/utils/Helper';
import { API_ENDPOINTS } from '@/utils/API/APIEndpoints';
import DynamicForm from '@shared-lib-v2/DynamicForm/components/DynamicForm';

import { useTranslation } from 'react-i18next';
import { extractMatchingKeys } from '@shared-lib-v2/DynamicForm/components/DynamicFormCallback';
interface EmailSearchUserProps {
  onUserSelected?: (userId: string) => void;
  onUserDetails: (userUpdatedDetails: any) => void;
  schema: any;
  uiSchema: any;
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
  onUserDetails,
  schema,
  uiSchema,
}) => {
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [userRow, setUserRow] = useState<any>(null);
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

        setUserRow(user);
        let tempFormData = extractMatchingKeys(user, schema);
        setPrefilledFormData(tempFormData);

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

  //dynamci form for update user details
  const [prefilledFormData, setPrefilledFormData] = useState(
    {}
  );
  const [alteredSchema, setAlteredSchema] = useState<any>(schema);
  const [alteredUiSchema, setAlteredUiSchema] = useState<any>(uiSchema);

  const FormSubmitFunction = async (formData: any, payload: any) => {
    console.log(formData, 'formdata');
    console.log('########## debug payload', payload);
    console.log('########## debug formdata', formData);
    setPrefilledFormData(formData);
    // convert to payload
    // console.log('######### filteredData', JSON.stringify(filteredData));
    const cleanedData = Object.fromEntries(
      Object.entries(formData).filter(
        ([_, value]) => !Array.isArray(value) || value.length > 0
      )
    );
    //step-2 : Validate the form data
    function transformFormData(
      formData: Record<string, any>,
      schema: any,
      extraFields: Record<string, any> = {} // Optional root-level custom fields
    ) {

      const transformedData: Record<string, any> = {
        ...extraFields, // Add optional root-level custom fields dynamically
        customFields: [],
      };

      for (const key in formData) {
        if (schema.properties[key]) {
          const fieldSchema = schema.properties[key];

          if (fieldSchema.coreField === 0 && fieldSchema.fieldId) {
            // Use fieldId for custom fields
            transformedData.customFields.push({
              fieldId: fieldSchema.fieldId,
              value: formData[key] || '',
            });
          } else {
            // Use the field name for core fields
            transformedData[key] = formData[key] || '';
          }
        }
      }

      return transformedData;
    }

    // Optional extra root-level fields
    // Extra Field for cohort creation

    const transformedFormData = transformFormData(
      cleanedData,
      schema,
      {}
    );

    console.log('########## debug transformedFormData', transformedFormData);

    onUserDetails(transformedFormData);
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
          startIcon={
            loading ? null : isUserLoaded ? (
              <ChangeCircleIcon />
            ) : (
              <SearchIcon />
            )
          }
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
        <Typography variant="h1" sx={{ mb: 2, color: '#000000' }}>
          User Details
        </Typography>
          <DynamicForm
            schema={alteredSchema}
            uiSchema={alteredUiSchema}
            t={t}
            FormSubmitFunction={FormSubmitFunction}
            prefilledFormData={prefilledFormData}
            hideSubmit={true}
            extraFields={[]}
            type={''}
            isCallSubmitInHandle={true}
            SubmitaFunction={FormSubmitFunction}
          />
          <Box sx={{marginTop: 2}}>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default EmailSearchUser;
