import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import ConfirmationModal from '@learner/components/ConfirmationModal/ConfirmationModal';
import { useTranslation } from '@shared-lib';
import { fetchUserCoursesWithContent } from '@learner/utils/API/contentService';
import { checkAuth } from '@shared-lib-v2/utils/AuthService';
import { showToastMessage } from '@learner/components/ToastComponent/Toastify';
import { getUserDetails, updateUser } from '@learner/utils/API/userService';
import { L2_INTEREST_FIELD_ID } from '@learner/utils/app.constant';

export interface TopicProp {
  topic: string;
  courses?: any[];
}

const getCustomFieldValueFromArray = (customFields: any, label: string[]) => {
  const fieldValue = label.reduce((acc, curr) => {
    const field = customFields.find((f: any) => f.label === curr);
    return { ...acc, [curr]: field?.selectedValues?.[0]?.value || '' };
  }, {});
  return JSON.parse(JSON.stringify(fieldValue));
};

const LTwoCourse: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topics, setTopics] = useState<TopicProp[]>([]);
  const [userResponse, setUserResponse] = useState<any>(null);
  const [isInterested, setIsInterested] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      if (checkAuth()) {
        const userId = localStorage.getItem('userId');
        const tenantId = localStorage.getItem('tenantId');
        if (userId && tenantId) {
          try {
            const { result } = await getUserDetails(userId, true);
            const customFieldsJson = getCustomFieldValueFromArray(
              result?.userData?.customFields,
              [
                'MOTHER_NAME',
                'STATE',
                'DISTRICT',
                'BLOCK',
                'VILLAGE',
                'HIGHEST_EDCATIONAL_QUALIFICATION_OR_LAST_PASSED_GRADE',
              ]
            );
            setUserResponse({
              ...(result.userData || {}),
              ...customFieldsJson,
            });
            const interestField = result?.userData?.customFields?.find(
              (field: any) => field?.fieldId === L2_INTEREST_FIELD_ID
            );
            const isAlreadyInterested = interestField?.selectedValues?.some(
              (selected: any) => selected?.value === 'yes'
            );
            setIsInterested(Boolean(isAlreadyInterested));
            const courses = await fetchUserCoursesWithContent(userId, tenantId);
            setTopics(courses);
          } catch (error) {
            console.error('Error fetching user courses:', error);
            showToastMessage(`Error fetching user courses: ${error}`, 'error');
          }
        }
      }
    };
    fetchTopics();
  }, []);

  // Return null if there are no topics, or the learner has already confirmed interest
  if (topics.length === 0 || isInterested) {
    return null;
  }

  const handleInterestClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmInterest = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      return;
    }
    try {
      const response = await updateUser(userId, {
        userData: {
          firstName: userResponse?.firstName ?? '',
          lastName: userResponse?.lastName ?? '',
          mobile: userResponse?.mobile ?? '',
          dob: userResponse?.dob ?? '',
          gender: userResponse?.gender ?? '',
        },
        customFields: [
          {
            fieldId: L2_INTEREST_FIELD_ID,
            value: 'yes',
          },
        ],
      });

      if (response?.data?.params?.err !== null) {
        throw new Error(response?.data?.params?.errmsg ?? 'Failed to update interest');
      }

      setIsInterested(true);
    } catch (error) {
      console.error('Error updating interest:', error);
      showToastMessage(t('LEARNER_APP.COMMON.REACHOUT_TO_MENTOR'), 'error');
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <Box
      sx={{
        padding: { md: '48px 56px', xs: '24px 16px' },
        bgcolor: 'white',
      }}
    >
      <Typography
        variant="h1"
        gutterBottom
        sx={{
          color: '#78590C',
          fontSize: { md: '22px', xs: '16px' },
          lineHeight: { md: '26px', xs: '20px' },
        }}
      >
        {t('LEARNER_APP.L_TWO_COURSE.TITLE')}
      </Typography>
      <Box
        sx={{
          gap: { md: 2, xs: 0 },
          width: '100%',
          mb: { md: 2, xs: 0 },
          background: '#F3EDF7',
          padding: { md: '24px 56px', xs: '16px' },
          borderRadius: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          '@media (max-width: 600px)': {
            flexDirection: 'column',
            alignItems: 'center',
          },
        }}
      >
        <Box>
          <Typography
            variant="h1"
            sx={{
              color: '#1F1B13',
              fontSize: { md: '22px', xs: '16px' },
              lineHeight: { md: '26px', xs: '20px' },
            }}
            gutterBottom
          >
            {t('LEARNER_APP.L_TWO_COURSE.DESCRIPTION')}
          </Typography>
          <Typography variant="body1" color="#635E57" gutterBottom>
            {t('LEARNER_APP.L_TWO_COURSE.SUB_DESCRIPTION')}
          </Typography>
        </Box>
        <Button
          sx={{
            minWidth: 'fit-content',
            padding: '10px 55px',
            fontSize: '16px',
            fontWeight: '500',
          }}
          variant="contained"
          color="primary"
          onClick={handleInterestClick}
        >
          {t('LEARNER_APP.L_TWO_COURSE.INTEREST_BUTTON')}
        </Button>
        <ConfirmationModal
          modalOpen={isModalOpen}
          message={t('LEARNER_APP.L_TWO_COURSE.CONFIRM_INTEREST_MESSAGE')}
          handleAction={handleConfirmInterest}
          buttonNames={{
            primary: t('LEARNER_APP.L_TWO_COURSE.CONFIRM_BUTTON'),
            secondary: t('COMMON.CANCEL'),
          }}
          handleCloseModal={handleClose}
        />
      </Box>
    </Box>
  );
};

export default React.memo(LTwoCourse);
