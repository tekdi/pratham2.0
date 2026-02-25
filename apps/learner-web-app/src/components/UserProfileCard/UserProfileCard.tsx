'use client';

import {
  Box,
  Typography,
  Grid,
  ListItemText,
  ListItemIcon,
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { useEffect, useState } from 'react';
import settingImage from '../../../public/images/settings.png';
import Image from 'next/image';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useRouter } from 'next/navigation';
import { getUserDetails, getMentorList } from '@learner/utils/API/userService';
import { getTenantInfo } from '@learner/utils/API/ProgramService';
import { Loader, useTranslation } from '@shared-lib';
import { isUnderEighteen, toPascalCase } from '@learner/utils/helper';
import { fetchForm, enhanceUiSchemaWithGrid, splitUserData } from '@shared-lib-v2/DynamicForm/components/DynamicFormCallback';
import { FormContext } from '@shared-lib-v2/DynamicForm/components/DynamicFormConstant';
import DocumentViewer from '@shared-lib-v2/DynamicForm/components/DocumentViewer/DocumentViewer';
import EditSearchUser from '@shared-lib-v2/MapUser/EditSearchUser';
import { RoleId} from '@shared-lib-v2/utils/app.constant';
import { showToastMessage } from '@shared-lib-v2/DynamicForm/components/Toastify';
import { updateUser } from '@learner/utils/API/userService';
import CircularProgress from '@mui/material/CircularProgress';
import {  enrollUserTenant } from '@learner/utils/API/EnrollmentService';
import PersonIcon from '@mui/icons-material/Person';
import DynamicForm from '@shared-lib-v2/DynamicForm/components/DynamicForm';
import CongratulationsModal from './CongratulationsModal';
// Helper function to get field value from userData based on schema
const getFieldValue = (fieldName: string, fieldSchema: Record<string, unknown>, userData: Record<string, unknown>, customFields: Array<Record<string, unknown>> = []) => {
  // Check if it's a core field
  if (fieldSchema?.coreField === 1) {
    const value = userData[fieldName];
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
    return null;
  }

  // It's a custom field - find by fieldId
  if (fieldSchema?.fieldId) {
    const customField = customFields.find((f: Record<string, unknown>) => f.fieldId === fieldSchema.fieldId);
    if (customField?.selectedValues && Array.isArray(customField.selectedValues) && customField.selectedValues.length > 0) {
      const firstValue = customField.selectedValues[0] as Record<string, unknown> | string;
      // For drop_down and radio fields, return the label
      if (fieldSchema.field_type === 'drop_down' || fieldSchema.field_type === 'radio') {
        if (typeof firstValue === 'object' && firstValue !== null) {
          return (firstValue as Record<string, unknown>).label || (firstValue as Record<string, unknown>).value || firstValue;
        }
        return firstValue;
      }
      // For text/numeric fields, return the value
      if (typeof firstValue === 'object' && firstValue !== null) {
        return (firstValue as Record<string, unknown>).value || firstValue;
      }
      return firstValue;
    }
  }

  return null;
};

// Helper function to format field value for display
const formatFieldValue = (value: unknown, fieldSchema: Record<string, unknown>, t: (key: string, options?: { defaultValue?: string }) => string) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  // Handle date fields
  if (fieldSchema?.field_type === 'date' || fieldSchema?.format === 'date') {
    try {
      return new Date(value as string).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return value;
    }
  }

  // Handle array fields (for multi-select)
  if (Array.isArray(value)) {
    return value.map((v: unknown) => {
      const label = typeof v === 'object' && v !== null ? ((v as Record<string, unknown>).label || (v as Record<string, unknown>).value || v) : v;
      return t(`FORM.${String(label)}`, { defaultValue: toPascalCase(String(label)) });
    }).join(', ');
  }

  // Handle enum fields - try to translate
  if (fieldSchema?.enum && Array.isArray(fieldSchema.enum) && fieldSchema?.enumNames && Array.isArray(fieldSchema.enumNames)) {
    const enumIndex = (fieldSchema.enum as unknown[]).indexOf(value);
    if (enumIndex !== -1) {
      const enumName = (fieldSchema.enumNames as string[])[enumIndex];
      return t(`FORM.${enumName}`, { defaultValue: toPascalCase(enumName) });
    }
  }

  // For text values, apply toPascalCase
  if (typeof value === 'string') {
    return toPascalCase(value);
  }

  return value;
};
const UserProfileCard = ({ maxWidth = '600px' }) => {
  const router = useRouter();
  const [userData, setUserData] = useState<Record<string, unknown> | null>(null); // User data state
  const [formSchema, setFormSchema] = useState<Record<string, unknown> | null>(null); // Form schema state
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState<string>('');
  const [villageId, setVillageId] = useState<number | null>(null);
  const [mentorData, setMentorData] = useState<Record<string, unknown> | null>(null);
  
  // PTM Registration Modal States
  const [ptmModalOpen, setPtmModalOpen] = useState(false);
  const [ptmNextModalOpen, setPtmNextModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [addSchema, setAddSchema] = useState<Record<string, unknown> | null>(null);
  const [addUiSchema, setAddUiSchema] = useState<Record<string, unknown> | null>(null);
  const [roleId, setRoleId] = useState<string>('');
  const [tenantId, setTenantId] = useState<string>('');
  const [isEditInProgress, setIsEditInProgress] = useState(false);
  const [isVolunteerProgramLead, setIsVolunteerProgramLead] = useState(false);
  const [isPragyanpathLearner, setIsPragyanpathLearner] = useState(false);
  const [otherRegisterVolunteerProgram, setOtherRegisterVolunteerProgram] = useState(false);
  const [userDetailsForPtm, setUserDetailsForPtm] = useState<any>(null);
  const [subProgramFormData, setSubProgramFormData] = useState<any>(null);
  const [congratulationsModalOpen, setCongratulationsModalOpen] = useState(false);


  const storedConfig =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('uiConfig') || '{}')
      : {};
      const subProgramSchema = {
        type: 'object',
        properties: {
          sub_program: {
            "type": "array", // Always use array type, even for single selection
            "items": {
              "type": "string"
            },
          },
        },
        "required": [
          "sub_program",
        ]
      };
      const subProgramUISchema = {
        sub_program: {
          'ui:widget': 'SubProgramListWidget',
          'ui:options': {
            multiple: true,
          },
        },
      };

  const options = [
    // t('LEARNER_APP.USER_PROFILE_CARD.EDIT_PROFILE'),
    // t('LEARNER_APP.USER_PROFILE_CARD.CHANGE_USERNAME'),
    // t('LEARNER_APP.USER_PROFILE_CARD.CHANGE_PASSWORD'),
    t('LEARNER_APP.USER_PROFILE_CARD.PRIVACY_GUIDELINES'),
    t('LEARNER_APP.USER_PROFILE_CARD.CONSENT_FORM'),
    t('COMMON.FAQS'),
    t('COMMON.SUPPORT_REQUEST'),
  ];
  if (storedConfig?.isEditProfile) {
    options.push(t('LEARNER_APP.USER_PROFILE_CARD.EDIT_PROFILE'));
  }
  if(!storedConfig?.restrictChangePassword)
  {
    options.push(t('LEARNER_APP.USER_PROFILE_CARD.CHANGE_PASSWORD'));
  }
  const isBelow18 = (dob: string): boolean => {
    const birthDate = new Date(dob);
    const today = new Date();

    const age =
      today.getFullYear() -
      birthDate.getFullYear() -
      (today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
        ? 1
        : 0);

    return age < 18;
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        // Initialize tenantId state from localStorage
        const storedTenantId = localStorage.getItem('tenantId');
        if (storedTenantId) {
          setTenantId(storedTenantId);
        }

        // Fetch user data, form schema, and tenant info in parallel
        const [userInfoResponse, formResponse, tenantInfoResponse] = await Promise.all([
          getUserDetails(userId, true),
          fetchForm([
            {
              fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.learner.context}&contextType=${FormContext.learner.contextType}`,
              header: {},
            },
            {
              fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.learner.context}&contextType=${FormContext.learner.contextType}`,
              header: {
                tenantid: localStorage.getItem('tenantId'),
              },
            },
          ]),
          getTenantInfo(),
        ]);

        console.log('useInfo', userInfoResponse?.result?.userData);
        console.log('responseForm', formResponse);
        const tenants = userInfoResponse?.result?.userData?.tenantData;
        const isVolunteerProgramLeadExists = tenants.some((tenant : any) =>
          tenant.tenantType === 'VolunteerOnboarding' &&
          tenant.roles?.some((role : any) => role.roleName?.toLowerCase() === 'lead')
        );
        console.log('isVolunteerProgramLeadExists', isVolunteerProgramLeadExists);
        setIsVolunteerProgramLead(isVolunteerProgramLeadExists)

        const isPragyanpathLearnerExists = tenants.some((tenant : any) =>
          tenant.tenantName === 'Pragyanpath' &&
          tenant.roles?.some((role : any) => role.roleName?.toLowerCase() === 'learner')
        );
        console.log('isPragyanpathLearnerExists', isPragyanpathLearnerExists);
        setIsPragyanpathLearner(isPragyanpathLearnerExists)

        // Check for other VolunteerOnboarding tenants available for registration
        const volunteerProgramLeadTenantIds = tenants
          .filter((tenant: any) =>
            tenant.tenantType === 'VolunteerOnboarding' &&
            tenant.roles?.some(
              (role: any) => role.roleName?.toLowerCase() === 'lead'
            )
          )
          .map((tenant: any) => tenant.tenantId);

        console.log('volunteerProgramLeadTenantIds', volunteerProgramLeadTenantIds);

        // Check if there are other VolunteerOnboarding tenants in getTenantInfo API response
        const availableVolunteerTenants = tenantInfoResponse?.result?.filter((tenant: any) => 
          tenant.tenantType === 'VolunteerOnboarding'
        ) || [];

        const availableVolunteerTenantIds = availableVolunteerTenants.map((tenant: any) => tenant.tenantId);
        console.log('availableVolunteerTenantIds', availableVolunteerTenantIds);

        // Check if there are other VolunteerOnboarding tenants apart from the ones user already has
        const otherVolunteerTenants = availableVolunteerTenantIds.filter(
          (tenantId: string) => !volunteerProgramLeadTenantIds.includes(tenantId)
        );

        console.log('otherVolunteerTenants', otherVolunteerTenants);
        const hasOtherVolunteerPrograms = otherVolunteerTenants.length > 0;
        setOtherRegisterVolunteerProgram(hasOtherVolunteerPrograms);
        console.log('otherRegisterVolunteerProgram set to:', hasOtherVolunteerPrograms);

        // Extract village ID for mentor lookup
        const extractedVillageId =
          userInfoResponse?.result?.userData?.customFields?.find(
            (f: Record<string, unknown>) => f.label === 'VILLAGE'
          )?.selectedValues?.[0]?.id ?? null;
        setVillageId(extractedVillageId);
        
        setUserData(userInfoResponse?.result?.userData);
        setFormSchema(formResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Fetch mentor data based on village ID
  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        if (villageId) {
          const mentorResponse = await getMentorList({
            limit: 100,
            filters: {
              working_village: [String(villageId)],
              role: 'Mobilizer',
            },
            sort: ['createdAt', 'asc'],
            offset: 0,
          });

          // Handle different possible response structures
          const mentorList =
            mentorResponse?.getUserDetails ||
            mentorResponse?.userDetails ||
            mentorResponse?.results ||
            [];

          // Get the first mentor from the list if available
          if (Array.isArray(mentorList) && mentorList.length > 0) {
            setMentorData(mentorList[0] as Record<string, unknown>);
          } else {
            setMentorData(null);
          }
        }
      } catch (error) {
        console.error('Error fetching mentor data:', error);
        setMentorData(null);
      }
    };

    fetchMentorData();
  }, [villageId]);

  // Fetch teamLead form schema for PTM registration
  useEffect(() => {
    const fetchTeamLeadSchema = async () => {
      try {
        const responseForm = await fetchForm([
          {
            fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.teamLead.context}&contextType=${FormContext.teamLead.contextType}`,
            header: {},
          },
          {
            fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.teamLead.context}&contextType=${FormContext.teamLead.contextType}`,
            header: {
              tenantid: localStorage.getItem('tenantId'),
            },
          },
        ]) as { schema?: Record<string, unknown>; uiSchema?: Record<string, unknown> } | null;

        if (!responseForm || !responseForm.schema || !responseForm.uiSchema) {
          console.error('Invalid response form structure');
          return;
        }

        const alterSchema = { ...responseForm.schema } as Record<string, unknown>;
        let alterUISchema = { ...responseForm.uiSchema } as Record<string, unknown>;
        
        // Disable certain fields similar to user-leader.tsx
        if (alterUISchema?.firstName) {
          (alterUISchema.firstName as Record<string, unknown>)['ui:disabled'] = true;
        }
        if (alterUISchema?.lastName) {
          (alterUISchema.lastName as Record<string, unknown>)['ui:disabled'] = true;
        }
        if (alterUISchema?.dob) {
          (alterUISchema.dob as Record<string, unknown>)['ui:disabled'] = true;
        }
        if (alterUISchema?.email) {
          (alterUISchema.email as Record<string, unknown>)['ui:disabled'] = true;
        }
        if (alterUISchema?.mobile) {
          (alterUISchema.mobile as Record<string, unknown>)['ui:disabled'] = true;
        }

        // Remove duplicates from requiredArray
        let requiredArray = alterSchema?.required;
        if (Array.isArray(requiredArray)) {
          requiredArray = Array.from(new Set(requiredArray));
          alterSchema.required = requiredArray;
        }

        // Set 2 grid layout
        alterUISchema = enhanceUiSchemaWithGrid(alterUISchema);

        setAddSchema(alterSchema);
        setAddUiSchema(alterUISchema);
        setRoleId(RoleId.TEAM_LEADER);
        setTenantId(localStorage.getItem('tenantId') || '');
      } catch (error) {
        console.error('Error fetching teamLead schema:', error);
      }
    };

    fetchTeamLeadSchema();
  }, []);

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handlePreview = (url: string, title: string) => {
    setPreviewUrl(url);
    setPreviewTitle(title);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewUrl(null);
    setPreviewTitle('');
  };

  const handlePtmRegistration = async ( payload: any) => {
    console.log('######### payload', payload);
    if (!selectedUserId || !userDetailsForPtm) {
      showToastMessage('User details not available', 'error');
      return;
    }

    setIsEditInProgress(true);
    try {
      const { userData, customFields } = splitUserData(userDetailsForPtm);

      delete userData.email;

      const object = {
        userData: userData,
        customFields: customFields,
      };

      // Update user details
      const updateUserResponse = await updateUser(selectedUserId, object);
      
      // Iterate over payload.sub_program and call enrollUserTenant for each element
      const enrollmentResponses = [];
      if (payload.sub_program && Array.isArray(payload.sub_program)) {
        for (const subProgram of payload.sub_program) {
          try {
            // Set onboardTenantId in localStorage for each sub-program before API call
            const tenantIdToUse =  subProgram || '';
            if (tenantIdToUse) {
              localStorage.setItem('onboardTenantId', tenantIdToUse);
              console.log(`######### Set onboardTenantId: ${tenantIdToUse}`);
            }

            const endrollResponse = await enrollUserTenant({
              userId: selectedUserId,
              tenantId: tenantIdToUse,
              roleId: roleId,
              customField: customFields,
              userData: userData,
            });
            enrollmentResponses.push(endrollResponse);
            console.log(`######### Enrolled user in tenant: ${tenantIdToUse}`, endrollResponse);
          } catch (error: unknown) {
            console.error(`Error enrolling user in tenant ${subProgram.tenantId || subProgram}:`, error);
            // Continue with other enrollments even if one fails
          }
        }
      }

      setPtmNextModalOpen(false);
      setPtmModalOpen(false)

      // Check if all enrollment responses were successful
      const allEnrollmentsSuccessful = enrollmentResponses.length > 0 && 
        enrollmentResponses.every(response => 
          response?.responseCode === 200 || response?.responseCode === 201
        );
        console.log('######### enrollmentResponses', enrollmentResponses);
console.log('######### allEnrollmentsSuccessful', allEnrollmentsSuccessful);
console.log('######### updateUserResponse', updateUserResponse);
      if (
        updateUserResponse &&
        updateUserResponse?.status === 200 && 
        allEnrollmentsSuccessful
      ) {
        // Show congratulations modal on success
        setCongratulationsModalOpen(true);
        setSelectedUserId(null);
        setUserDetailsForPtm(null);
        setSubProgramFormData(null);
      } else {
        showToastMessage(
          t('TEAM_LEADERS.NOT_ABLE_UPDATE_TEAM_LEADER', { defaultValue: 'Failed to update user' }),
          'error'
        );
      }


    } catch (error: unknown) {
      console.error('Error updating user:', error);
      const errorMessage = 'Failed to update user'
      showToastMessage(errorMessage, 'error');
    } finally {
      setIsEditInProgress(false);
        
    }
  };

  // Helper function to check if a field is a file field
  const isFileField = (fieldSchema: Record<string, unknown>): boolean => {
    return (
      fieldSchema?.field_type === 'file_upload' ||
      fieldSchema?.field_type === 'file' ||
      fieldSchema?.type === 'array' && (fieldSchema?.items as Record<string, unknown>)?.type === 'string' && 
      ((fieldSchema?.items as Record<string, unknown>)?.format === 'data-url' || (fieldSchema?.items as Record<string, unknown>)?.format === 'uri')
    );
  };

  // Helper function to check if a value is a valid URL
  const isValidUrl = (value: unknown): boolean => {
    if (typeof value !== 'string') return false;
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleOpen = (option: string) => {
    console.log(option);
    if (option === t('LEARNER_APP.USER_PROFILE_CARD.EDIT_PROFILE')) {
      router.push('/profile-complition');
    }
    if (option === t('LEARNER_APP.USER_PROFILE_CARD.CHANGE_PASSWORD')) {
      router.push('/change-password');
    }
    if (option === 'Change Username') {
      router.push('/change-username');
    }
    if (option === t('LEARNER_APP.USER_PROFILE_CARD.PRIVACY_GUIDELINES')) {
      window.open('https://www.pratham.org/privacy-guidelines/', '_blank');
    } else if (
      option === t('LEARNER_APP.USER_PROFILE_CARD.CONSENT_FORM') &&
      dob
    ) {
      // Get the selected language from localStorage (same key as Header.jsx uses)
      const selectedLanguage =
        typeof window !== 'undefined'
          ? localStorage.getItem('lang') || 'en'
          : 'en';

      // Map language codes to lowercase language names for PDF file naming
      const languageFileMap: { [key: string]: string } = {
        en: 'english',
        hi: 'hindi',
        mr: 'marathi',
        bn: 'bengali',
        as: 'assamese',
        guj: 'gujarati',
        kan: 'kannada',
        odi: 'odia',
        tam: 'tamil',
        tel: 'telugu',
        ur: 'urdu',
      };

      // Get the language name from the map, default to 'hindi'
      const languageName = languageFileMap[selectedLanguage] || 'hindi';

      // Open appropriate consent form based on age
      if (isBelow18(String(dob))) {
        window.open(`/files/consent_form_below_18_${languageName}.pdf`, '_blank');
      } else {
        window.open(`/files/consent_form_above_18_${languageName}.pdf`, '_blank');
      }
    } else if (option === t('COMMON.FAQS')) {
      router.push('/faqs');
    } else if (option === t('COMMON.SUPPORT_REQUEST')) {
      router.push('/support-request');
    }

    setAnchorEl(null); // Close the menu
  };


  if (!userData || !formSchema) {
    return (
      <Loader isLoading={true} layoutHeight={0}>
        {/* Your actual content goes here, even if it's an empty div */}
        <div />
      </Loader>
    ); // Show loading while data is being fetched
  }

  const {
    firstName,
    middleName,
    lastName,
    dob,
    mobile,
    username,
    customFields = [],
  } = userData as {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    dob?: string;
    mobile?: string | number;
    username?: string;
    email?: string;
    customFields?: Array<Record<string, unknown>>;
  };

  console.log('userData==========>', userData);
  console.log('formSchema==========>', formSchema);

  if (typeof window !== 'undefined' && mobile) {
    localStorage.setItem('usermobile', String(mobile));
  }
  const fullName = [
    firstName ? toPascalCase(String(firstName)) : '',
    middleName ? toPascalCase(String(middleName)) : '',
    lastName ? toPascalCase(String(lastName)) : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (typeof window !== 'undefined' && fullName) {
    localStorage.setItem('userfullname', fullName);
  }

  // Smart name truncation - preserve all names but handle very long ones
  const getDisplayName = (name: string) => {
    if (name.length <= 35) return name;

    const nameParts = name.split(' ');
    if (nameParts.length <= 3) return name;

    // For very long names with more than 3 parts, show first, middle, and last
    const firstName = nameParts[0];
    const middleName = nameParts[1];
    const lastName = nameParts[nameParts.length - 1];

    // If middle name is very long, abbreviate it
    const middleInitial =
      middleName && middleName.length > 8
        ? middleName.charAt(0) + '.'
        : middleName;

    return `${firstName} ${middleInitial} ${lastName}`.trim();
  };

  // Get fields to display based on schema
  const getFieldsToDisplay = () => {
    const schema = formSchema as Record<string, unknown>;
    if (!schema?.schema || !(schema.schema as Record<string, unknown>)?.properties || 
        !schema?.uiSchema || !((schema.uiSchema as Record<string, unknown>)['ui:order'])) {
      return [];
    }

    const fieldOrder = (schema.uiSchema as Record<string, unknown>)['ui:order'] as string[];
    const schemaProperties = ((schema.schema as Record<string, unknown>).properties as Record<string, Record<string, unknown>>);
    const fields: Array<{ name: string; schema: Record<string, unknown>; value: unknown; rawValue: unknown }> = [];

    // Fields to exclude from display
    const excludeFields = ['password', 'confirm_password', 'username', 'program', 'batch', 'center'];

    fieldOrder.forEach((fieldName: string) => {
      if (excludeFields.includes(fieldName)) {
        return;
      }

      const fieldSchema = schemaProperties[fieldName];
      if (!fieldSchema) {
        return;
      }

      const value = getFieldValue(fieldName, fieldSchema, userData as Record<string, unknown>, (customFields || []) as Array<Record<string, unknown>>);
      const formattedValue = formatFieldValue(value, fieldSchema, t);

      // Only include fields that have values
      if (formattedValue !== null && formattedValue !== '') {
        fields.push({
          name: fieldName,
          schema: fieldSchema,
          value: String(formattedValue),
          rawValue: value,
        });
      }
    });

    return fields;
  };

  const displayFields = getFieldsToDisplay();

  // Group fields into sections
  const contactFields = ['mobile', 'phone_type_accessible', 'own_phone_check', 'parent_phone', 'guardian_name', 'guardian_relation'];
  const personalFields = ['firstName', 'middleName', 'lastName', 'dob', 'gender', 'class', 'marital_status', 'state', 'district', 'block', 'village', 'mother_name', 'father_name', 'spouse_name', 'family_member_details'];

  const getSectionFields = (sectionFieldNames: string[]) => {
    return displayFields.filter((field) => sectionFieldNames.includes(field.name));
  };

  const contactSectionFields = getSectionFields(contactFields);
  const personalSectionFields = getSectionFields(personalFields);
  const otherSectionFields = displayFields.filter(
    (field) => !contactFields.includes(field.name) && !personalFields.includes(field.name)
  );

  // Helper to get location fields combined
  const getLocationFields = () => {
    const locationFieldNames = ['state', 'district', 'block', 'village'];
    const locationFields = personalSectionFields.filter((f) =>
      locationFieldNames.includes(f.name)
    );
    return locationFields.map((f) => f.value).filter(Boolean);
  };

  // Helper to get name fields combined
  const getNameFields = () => {
    const nameFieldNames = ['firstName', 'middleName', 'lastName'];
    const nameFields = personalSectionFields.filter((f) =>
      nameFieldNames.includes(f.name)
    );
    return nameFields.map((f) => f.value).filter(Boolean);
  };

  // Filter out location and name fields from personal section (they'll be rendered separately)
  const personalFieldsFiltered = personalSectionFields.filter(
    (field) => !['state', 'district', 'block', 'village', 'firstName', 'middleName', 'lastName'].includes(field.name)
  );
  {console.log('personalFieldsFiltered==========>', personalFieldsFiltered)
    console.log('getLocationFields==========>', getLocationFields())
    console.log('getNameFields==========>', getNameFields())
    }

  const sectionCardStyle = {
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    padding: '12px',
    marginBottom: '16px',
  };

  const sectionTitleStyle = {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: '6px',
    color: '#000',
  };

  const labelStyle = {
    fontSize: '0.85rem',
    fontWeight: 500,
    color: '#7c7c7c',
  };

  const valueStyle = {
    fontSize: '0.95rem',
    fontWeight: 500,
    color: '#333',
  };

  return (
    <Box sx={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}>
      <Box
        sx={{
          background: 'linear-gradient(to bottom, #FFFDF6, #F8EFDA)',
          maxWidth: { maxWidth },
          padding: '20px',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight="600"
            fontSize="1rem"
            sx={{ mb: 1 }}
          >
            {t('LEARNER_APP.USER_PROFILE_CARD.MY_PROFILE')}
          </Typography>
          <IconButton onClick={handleSettingsClick}>
            <Image
              src={settingImage}
              alt="Setting Icon"
              width={24}
              height={24}
            />
          </IconButton>{' '}
        </Box>

        <Typography
          fontWeight="600"
          sx={{
            mb: 1,
            fontSize: {
              xs: '0.9rem',
              sm: '1rem',
              md: '1.1rem',
            },
            lineHeight: 1.2,
            wordBreak: 'break-word',
            hyphens: 'auto',
          }}
        >
          {getDisplayName(fullName)}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {username}
          {/* • Joined on June 16, 2024 */}
        </Typography>
        {isPragyanpathLearner && (
          <Box>
            {!isVolunteerProgramLead ? (
              <Button
                variant="contained"
                onClick={() => {
                  const userId = localStorage.getItem('userId');
                  const tenantIdValue = localStorage.getItem('tenantId');
                  if (userId) {
                    if (tenantIdValue) {
                      setTenantId(tenantIdValue);
                      if (!roleId) {
                        setRoleId(RoleId.TEAM_LEADER);
                      }
                      setSelectedUserId(userId);
                      setPtmModalOpen(true);
                    } else {
                      showToastMessage('Tenant ID not found', 'error');
                    }
                  } else {
                    showToastMessage('User ID not found', 'error');
                  }
                }}
                startIcon={<PersonAddIcon />}
                sx={{
                  backgroundColor: '#FF8C00',
                  color: '#FFFFFF',
                  textTransform: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  px: 3,
                  py: 1.5,
                  borderRadius: '8px',
                  minWidth: '200px',
                  '&:hover': {
                    backgroundColor: '#FF7700',
                  },
                }}
              >
                {t('LEARNER_APP.USER_PROFILE_CARD.REGISTER_AS_PTM', { defaultValue: 'Register as PTM' })}
              </Button>
            ) : (
              <Box>
                <Button
                  variant="contained"
                  onClick={() => {
                    const lmpDomain = process.env.NEXT_PUBLIC_LMP_DOMAIN;
                    if (lmpDomain) {
                      window.open(lmpDomain, '_blank');
                    } else {
                      showToastMessage('PTM Portal URL not configured', 'error');
                    }
                  }}
                  startIcon={<PersonIcon />}
                  sx={{
                    backgroundColor: '#FFE4B5',
                    color: '#FF8C00',
                    textTransform: 'none',
                    fontSize: '14px',
                    fontWeight: 500,
                    px: 3,
                    py: 1.5,
                    borderRadius: '8px',
                  //  mb: 1,
                    minWidth: '200px',
                    width: 'fit-content',
                    '&:hover': {
                      backgroundColor: '#FFD700',
                    },
                  }}
                >
                  {t('LEARNER_APP.USER_PROFILE_CARD.GO_TO_PTM_PORTAL')} 
                </Button>
                {otherRegisterVolunteerProgram && (
                  <Button
                    variant="contained"
                    onClick={() => {
                      const userId = localStorage.getItem('userId');
                      const tenantIdValue = localStorage.getItem('tenantId');
                      if (userId) {
                        if (tenantIdValue) {
                          setTenantId(tenantIdValue);
                          if (!roleId) {
                            setRoleId(RoleId.TEAM_LEADER);
                          }
                          setSelectedUserId(userId);
                          setPtmModalOpen(true);
                        } else {
                          showToastMessage('Tenant ID not found', 'error');
                        }
                      } else {
                        showToastMessage('User ID not found', 'error');
                      }
                    }}
                    startIcon={<PersonAddIcon />}
                    sx={{
                      backgroundColor: '#FFE4B5',
                      color: '#FF8C00',
                      textTransform: 'none',
                      fontSize: '14px',
                      fontWeight: 500,
                      px: 3,
                      py: 1.5,
                      ml:1,
                      borderRadius: '8px',
                      minWidth: '200px',
                      width: 'fit-content',
                      '&:hover': {
                        backgroundColor: '#FFD700',
                      },
                    }}
                  >
                    {t('LEARNER_APP.USER_PROFILE_CARD.ADD_MORE_PROGRAMS', { defaultValue: 'Add More Programs' })} 
                  </Button>
                )}
              </Box>
            )}
          </Box>
        )}

      </Box>

      <Box
        sx={{
          padding: '16px',
          backgroundColor: '#FFF8F2',
          maxWidth: { maxWidth },
        }}
      >
        {/* Contact Information / Guardian Details Section */}
        {contactSectionFields.length > 0 && (
          <>
            <Typography sx={sectionTitleStyle}>
              {dob && !isUnderEighteen(String(dob))
                ? t('LEARNER_APP.USER_PROFILE_CARD.CONTACT_INFORMATION')
                : t('LEARNER_APP.USER_PROFILE_CARD.GUARDIAN_DETAILS')}
            </Typography>
            <Box sx={sectionCardStyle}>
              <Grid container spacing={1.5}>
                {contactSectionFields
                  .filter((field) => !['state', 'district', 'block', 'village'].includes(field.name))
                  .map((field) => {
                    const fieldTitle = (field.schema.title as string) || field.name;
                    const labelKey = `FORM.${fieldTitle}`;
                    
                    return (
                      <Grid item xs={6} key={field.name}>
                        <Typography sx={labelStyle}>
                          {t(labelKey, { defaultValue: toPascalCase(String(fieldTitle).replace(/_/g, ' ')) })}
                        </Typography>
                        <Typography
                          sx={{
                            ...valueStyle,
                            fontSize: field.name === 'guardian_relation' || field.name === 'guardian_name' ? {
                              xs: '0.75rem',
                              sm: '0.8rem',
                              md: '0.85rem',
                            } : undefined,
                            lineHeight: field.name === 'guardian_relation' || field.name === 'guardian_name' ? 1.0 : undefined,
                            wordBreak: field.name === 'guardian_relation' || field.name === 'guardian_name' ? 'keep-all' : undefined,
                            overflowWrap: field.name === 'guardian_relation' || field.name === 'guardian_name' ? 'normal' : undefined,
                          }}
                        >
                          {t(`FORM.${String(field.value).toUpperCase()}`, { defaultValue: toPascalCase(String(field.value)) })}
                        </Typography>
                      </Grid>
                    );
                  })}
              </Grid>
            </Box>
          </>
        )}

        {/* Personal Information Section */}
        {(personalFieldsFiltered.length > 0 || getLocationFields().length > 0 || getNameFields().length > 0) && (
          <>
            <Typography sx={sectionTitleStyle}>
              {t('LEARNER_APP.USER_PROFILE_CARD.PERSONAL_INFORMATION')}
            </Typography>
            <Box sx={sectionCardStyle}>
              <Grid container spacing={1.5}>
                {/* Name fields combined */}
                {/* {getNameFields().length > 0 && (
                  <Grid item xs={6} key="name">
                    <Typography sx={labelStyle}>
                      {t('LEARNER_APP.USER_PROFILE_CARD.NAME')}
                    </Typography>
                    <Typography sx={valueStyle}>
                      {getNameFields().join(' ')}
                    </Typography>
                  </Grid>
                )} */}

                {/* Other personal fields */}
                {personalFieldsFiltered.map((field) => {
                  const fieldTitle = (field.schema.title as string) || field.name;
                  const labelKey = `FORM.${fieldTitle}`;
                  
                  return (
                    <Grid item xs={6} key={field.name}>
                      <Typography sx={labelStyle}>
                        {t(labelKey, { defaultValue: toPascalCase(String(fieldTitle).replace(/_/g, ' ')) })}
                      </Typography>
                      <Typography sx={valueStyle}>{t(`FORM.${String(field.value).toUpperCase()}`, { defaultValue: toPascalCase(String(field.value)) })}</Typography>
                    </Grid>
                  );
                })}

                {/* Location fields combined */}
                {getLocationFields().length > 0 && (
                  <Grid item xs={12} key="location">
                    <Typography sx={labelStyle}>
                      {t('LEARNER_APP.USER_PROFILE_CARD.LOCATION')}
                    </Typography>
                    <Typography sx={valueStyle}>
                      {getLocationFields().join(', ')}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          </>
        )}

        {/* Other Fields Section */}
        {otherSectionFields.length > 0 && (
          <>
            <Typography sx={sectionTitleStyle}>
              {t('NAVAPATHAM.ADDITIONAL_INFORMATION')}
            </Typography>
            <Box sx={sectionCardStyle}>
              <Grid container spacing={1.5}>
                {otherSectionFields.map((field) => {
                  const fieldTitle = (field.schema.title as string) || field.name;
                  const labelKey = `FORM.${fieldTitle}`;
                  const isFile = isFileField(field.schema);
                  const hasValidUrl = isValidUrl(field.rawValue);
                  
                  return (
                    <Grid item xs={6} key={field.name}>
                      <Typography sx={labelStyle}>
                        {t(labelKey, { defaultValue: toPascalCase(String(fieldTitle).replace(/_/g, ' ')) })}
                      </Typography>
                      {isFile && hasValidUrl ? (
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 0.5,
                            cursor: 'pointer',
                            '&:hover': {
                              '& .view-text': {
                                textDecoration: 'underline',
                              }
                            }
                          }}
                          onClick={() => handlePreview(String(field.rawValue), fieldTitle)}
                        >
                          <VisibilityIcon sx={{ fontSize: '1rem', color: 'primary.main' }} />
                          <Typography 
                            className="view-text"
                            sx={{ 
                              ...valueStyle, 
                              color: 'primary.main',
                              fontWeight: 500
                            }}
                          >
                            {t('VIEW_FILE', { defaultValue: 'View File' })}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography sx={valueStyle}>
                          {t(`FORM.${String(field.value).toUpperCase()}`, { defaultValue: toPascalCase(String(field.value)) })}
                        </Typography>
                      )}
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </>
        )}

        {/* My Mentor Details Section */}
        {mentorData && (
          <>
            <Typography sx={sectionTitleStyle}>
              {t('LEARNER_APP.USER_PROFILE_CARD.MY_MENTOR_DETAILS')}
            </Typography>
            <Box sx={sectionCardStyle}>
              <Grid container spacing={1.5}>
                {(mentorData.firstName || mentorData.lastName) ? (
                  <Grid item xs={6}>
                    <Typography sx={labelStyle}>
                      {t('LEARNER_APP.USER_PROFILE_CARD.MENTOR_NAME')}
                    </Typography>
                    <Typography sx={valueStyle}>
                      {toPascalCase(
                        [String(mentorData.firstName || ''), String(mentorData.lastName || '')]
                          .filter(Boolean)
                          .join(' ')
                      )}
                    </Typography>
                  </Grid>
                ) : null}
                {mentorData.email ? (
                  <Grid item xs={6}>
                    <Typography sx={labelStyle}>
                      {t('LEARNER_APP.USER_PROFILE_CARD.MENTOR_EMAIL')}
                    </Typography>
                    <Typography sx={valueStyle}>{String(mentorData.email)}</Typography>
                  </Grid>
                ) : null}
                {mentorData.mobile ? (
                  <Grid item xs={6}>
                    <Typography sx={labelStyle}>
                      {t('LEARNER_APP.USER_PROFILE_CARD.PHONE_NUMBER')}
                    </Typography>
                    <Typography sx={valueStyle}>{String(mentorData.mobile)}</Typography>
                  </Grid>
                ) : null}
              </Grid>
            </Box>
          </>
        )}

        {/* Register as PTM Button */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                 </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            borderRadius: 2,
            mt: 1,
            minWidth: 250,
          },
        }}
      >
        <MenuItem onClick={() => handleOpen(options[0])}>
          <ListItemText>{options[0]}</ListItemText>
          <ListItemIcon sx={{ minWidth: 30 }}>
            <ChevronRightIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>

        {options.slice(1).map((option) => (
          <MenuItem key={option} onClick={() => handleOpen(option)}>
            <ListItemText>{option}</ListItemText>
            <ListItemIcon sx={{ minWidth: 30 }}>
              <ChevronRightIcon fontSize="small" />
            </ListItemIcon>
          </MenuItem>
        ))}
      </Menu>
      {/* <a
        href="/files/consent_form_above_18_hindi.pdf"
        target="_blank"
        rel="noopener noreferrer"
      >
        Open PDF
      </a> */}

      {/* File Preview Dialog */}
      <Dialog
        open={isPreviewOpen}
        onClose={handleClosePreview}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            height: '90vh',
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle>
          {t('FILE_PREVIEW', { defaultValue: 'File Preview' })} - {t(`FORM.${previewTitle}`, { defaultValue: toPascalCase(String(previewTitle).replace(/_/g, ' ')) })}
        </DialogTitle>
        <DialogContent
          sx={{
            p: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {previewUrl && (
            <DocumentViewer
              url={previewUrl}
              width="100%"
              height="100%"
              showError={true}
              showDownloadButton={false}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>{t('COMMON.CLOSE', { defaultValue: 'Close' })}</Button>
          {/* {previewUrl && (
            <Button
              variant="contained"
              href={previewUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('COMMON.DOWNLOAD', { defaultValue: 'Download' })}
            </Button> */}
          
        </DialogActions>
      </Dialog>

      {/* Register as PTM Modal Dialog */}
      <Dialog
        open={ptmModalOpen}
        onClose={(event, reason) => {
          // Prevent closing on backdrop click
          if (reason !== 'backdropClick') {
            setPtmModalOpen(false);
            setSelectedUserId(null);
            setIsEditInProgress(false);
          }
        }}
        maxWidth={false}
        fullWidth={true}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: '100%',
            maxHeight: '100vh',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #eee',
            p: 2,
          }}
        >
          <Typography variant="h1" component="div">
            {t('LEARNER_APP.USER_PROFILE_CARD.REGISTER_AS_PTM', { defaultValue: 'Register as PTM' })}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => {
              setPtmModalOpen(false);
              setSelectedUserId(null);
              setIsEditInProgress(false);
            }}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, overflowY: 'auto' }}>
          {isEditInProgress ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '150px' }}>
              <CircularProgress />
              <Typography variant="body1" sx={{ mt: 2 }}>
                {t('COMMON.LOADING', { defaultValue: 'Loading...' })}
              </Typography>
            </Box>
          ) : (
            addSchema && addUiSchema && selectedUserId && (
              <Box sx={{ mb: 3 }}>
                <EditSearchUser
                  onUserDetails=
                  {async (userDetails) => {
                    console.log('############# userDetails', userDetails);
                    if (selectedUserId) {
                      setIsEditInProgress(true);
                      try {
                        // Store user details for use in second modal
                        setUserDetailsForPtm(userDetails);
                       // setPtmModalOpen(false);
                        setPtmNextModalOpen(true);
                      } catch (error: unknown) {
                        console.error('Error processing user details:', error);
                        const errorMessage = (error as { response?: { data?: { params?: { errmsg?: string } } } })?.response?.data?.params?.errmsg ||
                          t('TEAM_LEADERS.NOT_ABLE_UPDATE_TEAM_LEADER', { defaultValue: 'Failed to process user details' });
                        showToastMessage(errorMessage, 'error');
                      } finally {
                        setIsEditInProgress(false);
                      }
                    }
                  }}
                  selectedUserRow={userData}
                  schema={addSchema}
                  uiSchema={addUiSchema}
                  userId={selectedUserId}
                  roleId={roleId}
                  tenantId={tenantId}
                  type="leader"
                />
              </Box>
            )
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee', display: 'flex', gap: 2 }}>
          {!isEditInProgress && selectedUserId && (
            <>
              <Button
                sx={{
                  backgroundColor: '#FFC107',
                  color: '#000',
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  fontSize: '14px',
                  height: '40px',
                  lineHeight: '20px',
                  letterSpacing: '0.1px',
                  textAlign: 'center',
                  verticalAlign: 'middle',
                  '&:hover': {
                    backgroundColor: '#ffb300',
                  },
                  flex: 1,
                }}
                disabled={!selectedUserId || isEditInProgress}
                form="dynamic-form-id"
                type="submit"
              >
                {t('COMMON.NEXT', { defaultValue: 'Next' })}
              </Button>
              {/* <Button
                variant="contained"
                color="primary"
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  fontSize: '14px',
                  height: '40px',
                  flex: 1,
                }}
                disabled={!selectedUserId || isEditInProgress}
                onClick={() => {
                  setPtmModalOpen(false);
                  setPtmNextModalOpen(true);
                }}
              >
                {t('COMMON.NEXT', { defaultValue: 'Next' })}
              </Button> */}
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* PTM Next Step Modal - Empty modal for future data */}
      <Dialog
        open={ptmNextModalOpen}
        onClose={(event, reason) => {
          // Prevent closing on backdrop click
          if (reason !== 'backdropClick') {
            setPtmModalOpen(false);
            setPtmNextModalOpen(false);
          }
        }}
        maxWidth={false}
        fullWidth={true}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: '100%',
            maxHeight: '100vh',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #eee',
            p: 2,
          }}
        >
          <Typography variant="h1" component="div">
            {t('LEARNER_APP.USER_PROFILE_CARD.REGISTER_AS_PTM', { defaultValue: 'Register as PTM' })}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => {
              setPtmNextModalOpen(false);
            }}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, overflowY: 'auto' }}>
          <Box sx={{ mb: 3 }}>
          <DynamicForm
                  schema={subProgramSchema}
                  uiSchema={subProgramUISchema}
                  FormSubmitFunction={(formData: any, payload: any) => {
                    console.log('########## debug payload', payload);
                    console.log('########## debug formdata', formData);
                    // Store form data for use in onClick handler
                 //  setSubProgramFormData({ formData, payload });
                   handlePtmRegistration( payload);
                  }}
                  prefilledFormData={{}}
                  hideSubmit={true}
                  type={''}
                  id="submit-ptm-form"
                />
                  {/* <Button type="submit">{t('COMMON.NEXT', { defaultValue: 'Next' })}</Button> */}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button
            variant="outlined"
            onClick={() => {
              
              setPtmNextModalOpen(false);
            }}
            sx={{
              mr: 2,
            }}
          >
            {t('COMMON.BACK', { defaultValue: 'Back' })}
          </Button>
          <Button
            variant="contained"
            color="primary"
         //   onClick={handlePtmRegistration}
            disabled={isEditInProgress || !selectedUserId || !userDetailsForPtm}
            form="submit-ptm-form"
            type="submit"
          >
            {t('LEARNER_APP.USER_PROFILE_CARD.REGISTER_AS_PTM', { defaultValue: 'Register as PTM' })}
            </Button>
        </DialogActions>
      </Dialog>

      {/* Congratulations Modal */}
      <CongratulationsModal
        open={congratulationsModalOpen}
        onClose={() => setCongratulationsModalOpen(false)}
      />
    </Box>
  );
};

export default UserProfileCard;