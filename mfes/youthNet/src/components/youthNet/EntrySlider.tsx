import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface EntrySliderProps {
  children: React.ReactNode | React.ReactNode[]; // Accept single or multiple children
}

const EntrySlider: React.FC<EntrySliderProps> = ({ children }) => {
  const entries = Array.isArray(children) ? children : [children]; // Ensure always an array
  const [currentEntry, setCurrentEntry] = useState(1);
  const totalEntries = entries.length;

  const handlePrev = () => {
    if (currentEntry > 1) {
      setCurrentEntry((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentEntry < totalEntries) {
      setCurrentEntry((prev) => prev + 1);
    }
  };

  return (
    <Box
      sx={{
        border: '1px solid #EBE1D4',
        padding: '10px 20px',
        backgroundColor: '#FCF7F0',
        width: '100%',
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
        {totalEntries > 1 && (
          <IconButton onClick={handlePrev} disabled={currentEntry === 1}>
            <ArrowBackIosIcon sx={{ color: currentEntry === 1 ? '#E0E0E0' : '#000' }} />
          </IconButton>
        )}

        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#4D4639',
            margin: '0 10px',
          }}
        >
          Entry {currentEntry} of {totalEntries}
        </Typography>

        {totalEntries > 1 && (
          <IconButton onClick={handleNext} disabled={currentEntry === totalEntries}>
            <ArrowForwardIosIcon sx={{ color: currentEntry === totalEntries ? '#E0E0E0' : '#000' }} />
          </IconButton>
        )}
      </Box>

      <Box display="flex" flexDirection="column" sx={{ marginTop: '20px', width: '100%' }}>
        {entries[currentEntry - 1]}
      </Box>
    </Box>
  );
};

export default EntrySlider;
