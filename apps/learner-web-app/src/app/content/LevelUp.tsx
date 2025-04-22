import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import React from 'react';

interface LevelUpProps {
  handleTopicChange: (event: SelectChangeEvent) => void;
  selectedTopic: string;
}

const LevelUp: React.FC<LevelUpProps> = ({
  handleTopicChange,
  selectedTopic,
}) => {
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
        Great! We're Excited to Help You Level Up!
      </Typography>

      <Typography
        variant="h2"
        sx={{
          color: '#1F1B13',
          textAlign: 'center',
        }}
        mb={2}
      >
        Which topic are you most interested in?
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
            <em>Topics</em>
          </MenuItem>
          <MenuItem value="plumbing">Plumbing</MenuItem>
          <MenuItem value="electrical">Electrical</MenuItem>
          <MenuItem value="carpentry">Carpentry</MenuItem>
          <MenuItem value="masonry">Masonry</MenuItem>
          <MenuItem value="painting">Painting</MenuItem>
        </Select>
      </Box>

          <Typography variant="h4" color="#635E57" mb={3}>
        Once you select a course, our expert will contact you with more
        information!
      </Typography>
    </div>
  );
};

export default LevelUp;
