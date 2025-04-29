import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import CommonModal from '@learner/components/Modal/CommonModal';
import LevelUp from '@learner/components/LTwoContent/LevelUp';
import ResponseRecorded from '@learner/components/LTwoContent/ResponseRecorded';
import { useTranslation } from '@shared-lib';
import {
  fetchUserCoursesWithContent,
  createL2Course,
} from '@learner/utils/API/contentService';
import { checkAuth } from '@shared-lib-v2/utils/AuthService';
import { getUserId } from '@learner/utils/API/LoginService';
import { showToastMessage } from '@learner/components/ToastComponent/Toastify';

export interface TopicProp {
  topic: string;
  courses?: any[];
}

const LTwoCourse: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [topics, setTopics] = useState<TopicProp[]>([]);
  const [selectedTopic, setSelectedTopic] = React.useState<
    TopicProp | undefined
  >(undefined);

  useEffect(() => {
    const fetchTopics = async () => {
      if (checkAuth()) {
        const userId = localStorage.getItem('userId');
        const tenantId = localStorage.getItem('tenantId');
        if (userId && tenantId) {
          try {
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

  // Return null if there are no topics
  if (topics.length === 0) {
    return null;
  }

  const handleInterestClick = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      // Get user data
      const userResponse = await getUserId();
      const userData = {
        first_name: userResponse?.firstName ?? '',
        middle_name: userResponse?.middleName ?? '',
        last_name: userResponse?.lastName ?? '',
        mother_name: '',
        gender: userResponse?.gender ?? '',
        email_address: userResponse?.email ?? '',
        dob: userResponse?.dob ?? '',
        qualification: '',
        phone_number: userResponse?.mobile?.toString() ?? '',
        state: '',
        district: '',
        block: '',
        village: '',
        blood_group: '',
        userId: userResponse?.userId ?? '',
        courseId: selectedTopic?.courses?.[0]?.name ?? '',
        courseName: selectedTopic?.courses?.[0]?.courseId ?? '',
        topicName: selectedTopic?.topic ?? '',
      };

      // Call createL2Course API
      await createL2Course(userData);

      setCount(1);
      if (count == 1) {
        setIsModalOpen(false);
        setCount(0);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      showToastMessage(`Error in handleSubmit: ${error}`, 'error');
      // Handle error appropriately
    }
  };

  const handleCloseResponse = () => {
    setIsModalOpen(false);
    setCount(0);
  };

  const handleTopicChange = (event: TopicProp) => {
    setSelectedTopic(event);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setCount(0);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h1" gutterBottom sx={{ color: '#78590C' }}>
        {t('LEARNER_APP.L_TWO_COURSE.TITLE')}
      </Typography>
      <Box
        sx={{
          width: '100%',
          mb: 2,
          background: '#F3EDF7',
          padding: '24px 56px 24px 56px',
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
        <Box
          sx={{ width: '38%', '@media (max-width: 600px)': { width: '100%' } }}
        >
          <Typography variant="h1" sx={{ color: '#1F1B13' }} gutterBottom>
            {t('LEARNER_APP.L_TWO_COURSE.DESCRIPTION')}
          </Typography>
          <Typography variant="body1" color="#635E57" gutterBottom>
            {t('LEARNER_APP.L_TWO_COURSE.SUB_DESCRIPTION')}
          </Typography>
        </Box>
        <Box>
          <Button
            sx={{ padding: '10px 55px', fontSize: '16px', fontWeight: '500' }}
            variant="contained"
            color="primary"
            onClick={handleInterestClick}
          >
            {t('LEARNER_APP.L_TWO_COURSE.INTEREST_BUTTON')}
          </Button>
        </Box>
        {count == 0 ? (
          <CommonModal
            handleSubmit={handleSubmit}
            isOpen={isModalOpen}
            onClose={handleClose}
            submitText={t('LEARNER_APP.L_TWO_COURSE.SUBMIT_BUTTON')}
          >
            <LevelUp
              handleTopicChange={handleTopicChange}
              selectedTopic={selectedTopic?.topic || ''}
              topics={topics}
            />
          </CommonModal>
        ) : (
          <CommonModal
            handleSubmit={handleCloseResponse}
            isOpen={isModalOpen}
            onClose={handleClose}
            submitText={t('LEARNER_APP.L_TWO_COURSE.OKAY_BUTTON')}
          >
            <ResponseRecorded />
          </CommonModal>
        )}
      </Box>
    </Box>
  );
};

export default LTwoCourse;
