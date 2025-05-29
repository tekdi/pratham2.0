import { Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import React, { useState } from 'react';

interface PDFViewerWithLanguageProps {
  getPdfUrl: (language: string) => string;
  title?: string;
}

const PDFViewerWithLanguage: React.FC<PDFViewerWithLanguageProps> = ({
  getPdfUrl,
  title = 'FAQs',
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('english');

  const handleLanguageChange = (event: any) => {
    setSelectedLanguage(event.target.value);
  };

  return (
    <Box sx={{ position: 'relative', px: '16px' }}>
      <Box
        sx={{
          color: 'warning.A200',
          fontSize: '22px',
          fontWeight: '400',
          mt: 3,
          mb: 2,
        }}
      >
        {title}
      </Box>
      <Box
        sx={{
          position: 'fixed',
          top: '80px',
          right: '32px',
          zIndex: 9999,
          backgroundColor: 'white',
          padding: '4px',
          borderRadius: '4px',
        }}
      >
        <FormControl>
          <InputLabel id="language-select-label">Select Language</InputLabel>
          <Select
            labelId="language-select-label"
            id="language-select"
            value={selectedLanguage}
            label="Select Language"
            onChange={handleLanguageChange}
            sx={{ minWidth: '150px' }}
          >
            <MenuItem value="english">English</MenuItem>
            <MenuItem value="hindi">Hindi</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box
        sx={{
          height: 'calc(100vh - 200px)',
          display: 'flex',
          justifyContent: 'center',
          mt: 4,
        }}
      >
        <iframe
          src={getPdfUrl(selectedLanguage)}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
          title="PDF Viewer"
        />
      </Box>
    </Box>
  );
};

export default PDFViewerWithLanguage;
