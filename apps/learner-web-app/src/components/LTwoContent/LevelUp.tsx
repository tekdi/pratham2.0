import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import React from 'react';
import { Layout, useTranslation } from '@shared-lib';

interface LevelUpProps {
  handleTopicChange: (event: SelectChangeEvent) => void;
  selectedTopic: string;
}

const LevelUp: React.FC<LevelUpProps> = ({
  handleTopicChange,
  selectedTopic,
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <Typography
        sx={{
          color: '#1F1B13',
          textAlign: 'center',
        }}
        variant="h1"
        mb={3}
        id="modal-title"
      >
        {t('LEARNER_APP.LEVEL_UP.TITLE')}
      </Typography>

      <Typography
        variant="h2"
        sx={{
          color: '#1F1B13',
          textAlign: 'center',
        }}
        mb={2}
      >
        {t('LEARNER_APP.LEVEL_UP.SUB_TITLE')}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Select
          value={selectedTopic}
          onChange={handleTopicChange}
          displayEmpty
          fullWidth
          sx={{ textAlign: 'left' }}
        >
          <MenuItem disabled value="">
            <em>{t('LEARNER_APP.LEVEL_UP.TOPICS_PLACEHOLDER')}</em>
          </MenuItem>
          <MenuItem value="plumbing">
            {t('LEARNER_APP.LEVEL_UP.TOPIC_PLUMBING')}
          </MenuItem>
          <MenuItem value="electrical">
            {t('LEARNER_APP.LEVEL_UP.TOPIC_ELECTRICAL')}
          </MenuItem>
          <MenuItem value="carpentry">
            {t('LEARNER_APP.LEVEL_UP.TOPIC_CARPENTRY')}
          </MenuItem>
          <MenuItem value="masonry">
            {t('LEARNER_APP.LEVEL_UP.TOPIC_MASONRY')}
          </MenuItem>
          <MenuItem value="painting">
            {t('LEARNER_APP.LEVEL_UP.TOPIC_PAINTING')}
          </MenuItem>
        </Select>
      </Box>

      <Typography variant="h4" color="#635E57" mb={3}>
        {t('LEARNER_APP.LEVEL_UP.FOOTER_TEXT')}
      </Typography>
    </div>
  );
};

export default LevelUp;
