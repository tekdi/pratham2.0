import React, { useEffect, useState } from 'react';
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
import { post } from '../DynamicForm/services/RestClient';
import { showToastMessage } from '@shared-lib-v2/DynamicForm/components/Toastify';
import { transformLabel } from '../DynamicForm/utils/Helper';
import { API_ENDPOINTS } from '@shared-lib-v2/utils/API/EndUrls';
import DynamicForm from '@shared-lib-v2/DynamicForm/components/DynamicForm';

import { useTranslation } from '../lib/context/LanguageContext';
import { extractMatchingKeys } from '@shared-lib-v2/DynamicForm/components/DynamicFormCallback';
import { readUserId, readUserIdTrue } from '../DynamicForm/services/NotificationService';
interface EditSearchUserProps {
  onUserDetails: (userUpdatedDetails: any) => void;
  schema: any;
  uiSchema: any;
  userId: string;
  roleId: string;
  tenantId: string;
  type: string;
  selectedUserRow: any;
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

const EditSearchUser: React.FC<EditSearchUserProps> = ({
  onUserDetails,
  schema,
  uiSchema,
  userId,
  roleId,
  tenantId,
  type,
  selectedUserRow,
}) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(
    null
  );
  const [isUserLoaded, setIsUserLoaded] = useState(
    false
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [canProceed, setCanProceed] = useState<boolean>(true);

  const fetchUserByUserId = async () => {
    if (!userId || !userId.trim()) {
      showToastMessage('Please enter an user id', 'error');
      return;
    }

    setLoading(true);
    setValidationError(null);
    setCanProceed(true);
    try {
      const response = await readUserIdTrue(userId);
      let user = response?.result?.userData;
      user.mobile = user.mobile ? user.mobile.toString() : null;

        // Validate tenant and role
        const tenantData = user.tenantData || [];
        const matchedTenant = tenantData.find(
          (tenant: any) => tenant.tenantId === tenantId
        );

        if (matchedTenant) {
          const tenantStatus = matchedTenant.tenantStatus?.toLowerCase();
          const roleData = matchedTenant.roleData || [];
          const isRolePresent = roleData.some(
            (role: any) => role.roleId === roleId
          );

          // Case 1: Tenant is inactive or archived
          if (tenantStatus === 'inactive' || tenantStatus === 'archived') {
            setLoading(false);
            setValidationError('Already deleted user cannot be mapped');
            setCanProceed(false);
            setUserDetails(null);
            setIsUserLoaded(false);
            showToastMessage('Already deleted user cannot be mapped', 'error');
            return;
          }

          // Case 2: Tenant is active and role is already present
          if (tenantStatus === 'active' && isRolePresent) {
            setLoading(false);
            setValidationError(
              'User is already mapped to this role. Please use reassign option'
            );
            setCanProceed(false);
            setUserDetails(null);
            setIsUserLoaded(false);
            showToastMessage(
              'User is already mapped to this role. Please use reassign option',
              'error'
            );
            return;
          }

          // Case 3: Tenant is active and role is not present - proceed normally
          if (tenantStatus === 'active' && !isRolePresent) {
            setValidationError(null);
            setCanProceed(true);
          }
        } else {
          // Tenant not found in user's tenantData - proceed normally
          setValidationError(null);
          setCanProceed(true);
        }

        let tempFormData = extractMatchingKeys(user, schema);
        setPrefilledFormData({
          ...tempFormData,
          ...(type == 'instructor' ? { designation: 'facilitator' } : {}),
        });

        // Extract user details
        const extractedUserId = user.userId;
        const name =
          user.name ||
          `${user.firstName || ''} ${user.middleName || ''} ${
            user.lastName || ''
          }`.trim();
        const dob = user.dob || null;
        const mobile = user.mobile ? user.mobile.toString() : null;

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

        // Only proceed if validation passed
        if (canProceed) {
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

          console.log('########## debug details', details);

          setUserDetails(details);
          setIsUserLoaded(true);

          // showToastMessage('User details fetched successfully', 'success');
        }
      
    } catch (error: any) {
      console.error('Error fetching user:', error);
      const errorMessage =
        error?.response?.data?.params?.errmsg ||
        'Failed to fetch user details. Please try again.';
      showToastMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserByUserId();
  }, [selectedUserRow]);

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
    // console.log(formData, 'formdata');
    console.log('########## debug payload', payload);
    console.log('########## debug formdata', formData);
    setPrefilledFormData(formData);
    onUserDetails(payload);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
          <Typography variant="h1" sx={{ mt: 2 }}>Loading...</Typography>
        </Box>
      )}
      
      {/* Validation Error Section */}
      {validationError && (
        <Box
          sx={{
            border: '1px solid #f44336',
            borderRadius: 2,
            p: 2,
            backgroundColor: '#ffebee',
          }}
        >
          <Typography variant="body1" sx={{ color: '#d32f2f' }}>
            {validationError}
          </Typography>
        </Box>
      )}

      {/* User Details Section */}
      {isUserLoaded && userDetails && canProceed && (
        <>
          <Box
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              p: 3,
              backgroundColor: '#f9f9f9',
            }}
          >
            <DynamicForm
              schema={alteredSchema}
              uiSchema={alteredUiSchema}
              FormSubmitFunction={FormSubmitFunction}
              prefilledFormData={prefilledFormData}
              hideSubmit={true}
              type={''}
            />
            {/* <Box sx={{ marginTop: 2 }}></Box> */}
          </Box>
        </>
      )}
    </Box>
  );
};

export default EditSearchUser;
