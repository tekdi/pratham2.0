import React, { useState } from 'react';
import { Box, Typography, Button, SelectChangeEvent } from '@mui/material';
import CommonModal from '@learner/components/Modal/CommonModal';
import LevelUp from '@learner/components/LTwoContent/LevelUp';
import ResponseRecorded from '@learner/components/LTwoContent/ResponseRecorded';
import { useTranslation } from '@shared-lib';

interface LTwoCourseProps {
  onSubmit?: () => void;
}

const LTwoCourse: React.FC<LTwoCourseProps> = ({ onSubmit }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [count, setCount] = useState(0);

  const handleInterestClick = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    }
    setCount(1);
    if (count == 1) {
      setIsModalOpen(false);
      setCount(0);
    }
  };

  const handleCloseResponse = () => {
    setIsModalOpen(false);
    setCount(0);
  };

  const [selectedTopic, setSelectedTopic] = React.useState('');

  const handleTopicChange = (event: SelectChangeEvent) => {
    setSelectedTopic(event.target.value);
  };

  return (
    <>
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
        }}
      >
        <Box sx={{ width: '38%' }}>
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
            onClose={() => setIsModalOpen(false)}
            submitText={t('LEARNER_APP.L_TWO_COURSE.SUBMIT_BUTTON')}
          >
            <LevelUp
              handleTopicChange={handleTopicChange}
              selectedTopic={selectedTopic}
            />
          </CommonModal>
        ) : (
          <CommonModal
            handleSubmit={handleCloseResponse}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            submitText={t('LEARNER_APP.L_TWO_COURSE.OKAY_BUTTON')}
          >
            <ResponseRecorded />
          </CommonModal>
        )}
      </Box>
    </>
  );
};

export default LTwoCourse;
