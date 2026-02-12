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
import { useRouter } from 'next/navigation';
import { getUserDetails, getMentorList } from '@learner/utils/API/userService';
import { Loader, useTranslation } from '@shared-lib';
import { isUnderEighteen, toPascalCase } from '@learner/utils/helper';
import { fetchForm } from '@shared-lib-v2/DynamicForm/components/DynamicFormCallback';
import { FormContext } from '@shared-lib-v2/DynamicForm/components/DynamicFormConstant';
import DocumentViewer from '@shared-lib-v2/DynamicForm/components/DocumentViewer/DocumentViewer';

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

  const storedConfig =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('uiConfig') || '{}')
      : {};

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

        // Fetch both user data and form schema in parallel
        const [userInfoResponse, formResponse] = await Promise.all([
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
        ]);

        console.log('useInfo', userInfoResponse?.result?.userData);
        console.log('responseForm', formResponse);
        
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
    </Box>
  );
};

export default UserProfileCard;