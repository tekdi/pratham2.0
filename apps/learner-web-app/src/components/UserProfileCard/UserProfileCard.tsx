import {
  Box,
  Typography,
  Grid,
  Divider,
  ListItemText,
  ListItemIcon,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import { useEffect, useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import settingImage from '../../../public/images/settings.png';
import Image from 'next/image';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useRouter } from 'next/navigation';
import { getUserDetails } from '@learner/utils/API/userService';
import { Loader, useTranslation } from '@shared-lib';
import { toPascalCase } from '@learner/utils/helper';

// Assuming an API function fetchUserData is available
// Example: const fetchUserData = async () => { ... };

const getCustomFieldValue = (customFields: any, label: string) => {
  console.log(customFields);
  const field = customFields.find((f: any) => f.label === label);
  return field?.selectedValues?.[0]?.value || field?.selectedValues?.[0] || '-';
};

const UserProfileCard = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null); // User data state
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const options = [
    t('LEARNER_APP.USER_PROFILE_CARD.EDIT_PROFILE'),
    // t('LEARNER_APP.USER_PROFILE_CARD.CHANGE_USERNAME'),
    t('LEARNER_APP.USER_PROFILE_CARD.CHANGE_PASSWORD'),
    t('LEARNER_APP.USER_PROFILE_CARD.PRIVACY_GUIDELINES'),
    t('LEARNER_APP.USER_PROFILE_CARD.CONSENT_FORM'),
  ];
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
    const fetchUserData = async () => {
      try {
        // Replace this with actual API call to fetch user data
        const userId = localStorage.getItem('userId');
        if (userId) {
          const useInfo = await getUserDetails(userId, true);
          console.log('useInfo', useInfo?.result?.userData);
          setUserData(useInfo?.result?.userData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
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
      isBelow18(userData.dob)
    ) {
      window.open('/files/consent_form_below_18_hindi.pdf', '_blank');
    } else if (
      option === t('LEARNER_APP.USER_PROFILE_CARD.CONSENT_FORM') &&
      !isBelow18(userData.dob)
    ) {
      window.open('/files/consent_form_above_18_hindi.pdf', '_blank');
    }

    setSelectedOption(option);
    setOpen(true);
    setAnchorEl(null); // Close the menu
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  if (!userData) {
    return (
      <Loader isLoading={true} layoutHeight={0}>
        {/* Your actual content goes here, even if it's an empty div */}
        <div />
      </Loader>
    ); // Show loading while data is being fetched
  }
  console.log(userData);
  const {
    firstName,
    middleName,
    lastName,
    gender,
    dob,
    email,
    mobile,
    username,
    customFields = [],
  } = userData;
  if (typeof window !== 'undefined' && mobile) {
    localStorage.setItem('usermobile', mobile);
  }
  const fullName = [
    toPascalCase(firstName),
    toPascalCase(middleName),
    toPascalCase(lastName),
  ]
    .filter(Boolean)
    .join(' ');
  const maritalStatus = getCustomFieldValue(customFields, 'MARITAL_STATUS');
  const qualification = getCustomFieldValue(
    customFields,
    'HIGHEST_EDCATIONAL_QUALIFICATION_OR_LAST_PASSED_GRADE'
  );
  const phoneOwnership = getCustomFieldValue(
    customFields,
    'DOES_THIS_PHONE_BELONG_TO_YOU'
  );
  const priorTraining = getCustomFieldValue(
    customFields,
    'HAVE_YOU_RECEIVE_ANY_PRIOR_TRAINING'
  );
  const currentWork = getCustomFieldValue(
    customFields,
    'ARE_YOU_CURRENTLY_WORKING_IF_YES_CHOOSE_THE_DOMAIN'
  );
  const futureWork = getCustomFieldValue(
    customFields,
    'WHAT_DO_YOU_WANT_TO_BECOME'
  );
  const motherName = getCustomFieldValue(customFields, 'MOTHER_NAME');
  const state = getCustomFieldValue(customFields, 'STATE');
  const district = getCustomFieldValue(customFields, 'DISTRICT');
  const village = getCustomFieldValue(customFields, 'VILLAGE');

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
          maxWidth: '600px',
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

        <Typography fontSize="1.25rem" fontWeight="600" sx={{ mb: 1 }}>
          {fullName}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {username}
          {/* • Joined on June 16, 2024 */}
        </Typography>
      </Box>

      <Box
        sx={{ padding: '16px', backgroundColor: '#FFF8F2', maxWidth: '600px' }}
      >
        <Typography sx={sectionTitleStyle}>
          {t('LEARNER_APP.USER_PROFILE_CARD.CONTACT_INFORMATION')}
        </Typography>
        <Box sx={sectionCardStyle}>
          {/* <Box sx={{ mb: 1.5 }}>
            <Typography sx={labelStyle}>
              {t('LEARNER_APP.USER_PROFILE_CARD.EMAIL_ADDRESS')}
            </Typography>
            <Typography sx={valueStyle}>{email || '-'}</Typography>
          </Box> */}

          <Grid container spacing={1.5}>
            <Grid item xs={6}>
              <Typography sx={labelStyle}>
                {t('LEARNER_APP.USER_PROFILE_CARD.PHONE_NUMBER')}
              </Typography>
              <Typography sx={valueStyle}>{mobile}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={labelStyle}>
                {t('LEARNER_APP.USER_PROFILE_CARD.PHONE_BELONGS_TO_YOU')}
              </Typography>
              <Typography sx={valueStyle}>
                {toPascalCase(phoneOwnership)}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Typography sx={sectionTitleStyle}>
          {t('LEARNER_APP.USER_PROFILE_CARD.PERSONAL_INFORMATION')}
        </Typography>
        <Box sx={sectionCardStyle}>
          <Grid container spacing={1.5}>
            <Grid item xs={6}>
              <Typography sx={labelStyle}>
                {t('LEARNER_APP.USER_PROFILE_CARD.GENDER')}
              </Typography>
              <Typography sx={valueStyle}>{toPascalCase(gender)}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={labelStyle}>
                {t('LEARNER_APP.USER_PROFILE_CARD.DOB')}
              </Typography>
              <Typography sx={valueStyle}>
                {new Date(dob).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={labelStyle}>
                {t('LEARNER_APP.USER_PROFILE_CARD.MARITAL_STATUS')}
              </Typography>
              <Typography sx={valueStyle}>
                {toPascalCase(maritalStatus)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={labelStyle}>
                {t('LEARNER_APP.USER_PROFILE_CARD.MOTHER_NAME')}
              </Typography>
              <Typography sx={valueStyle}>
                {toPascalCase(motherName) || '-'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography sx={labelStyle}>
                {t('LEARNER_APP.USER_PROFILE_CARD.HIGHEST_QUALIFICATION')}
              </Typography>
              <Typography sx={valueStyle}>
                {/* {t(`form.${qualification}`)} */}
                {t(`form.${qualification}`, { defaultValue: qualification })}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography sx={labelStyle}>
                {t('LEARNER_APP.USER_PROFILE_CARD.LOCATION')}
              </Typography>
              <Typography sx={valueStyle}>
                {[state, district, village].filter(Boolean).join(', ') || '-'}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Typography sx={sectionTitleStyle}>Aspiration & Experience</Typography>
        <Box sx={sectionCardStyle}>
          <Box sx={{ mb: 1.5 }}>
            <Typography sx={labelStyle}>
              Have you received any prior training?
            </Typography>
            <Typography sx={valueStyle}>{priorTraining}</Typography>
          </Box>
          <Box sx={{ mb: 1.5 }}>
            <Typography sx={labelStyle}>
              Have you ever worked or are you currently working?
            </Typography>
            <Typography sx={valueStyle}>
              {toPascalCase(currentWork).replaceAll('_', ' ')}
            </Typography>
          </Box>
          <Box>
            <Typography sx={labelStyle}>What do you want to become?</Typography>
            <Typography sx={valueStyle}>
              I want to become {futureWork}
            </Typography>
          </Box>
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
    </Box>
  );
};

export default UserProfileCard;
