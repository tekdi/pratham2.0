'use client';
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import React, { useState, useEffect } from 'react';

interface PDFViewerWithLanguageProps {
  getPdfUrl: (language: string) => string;
  title?: string;
}

const PDFViewerWithLanguage: React.FC<PDFViewerWithLanguageProps> = ({
  getPdfUrl,
  title = 'FAQs',
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleMediaChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  const handleLanguageChange = (event: any) => {
    setSelectedLanguage(event.target.value);
  };

  const pdfUrl = getPdfUrl(selectedLanguage);

  return (
    <Box sx={{ position: 'relative', px: 2 }}>
      {/* Title */}
      <Typography
        variant="h2"
        sx={{ color: 'warning.A200', fontWeight: 500, mt: 3, mb: 2 }}
      >
        {title}
      </Typography>

      {/* Language Selector */}
      <Box
        sx={{
          position: 'fixed',
          top: 80,
          right: 24,
         // zIndex: 9999,
          mt:"12px",
        //  backgroundColor: 'white',
          padding: 1,
          borderRadius: 1,
        //  boxShadow: 2,
        }}
      >
        <FormControl size="small">
          <InputLabel id="language-select-label">Select Language</InputLabel>
          <Select
            labelId="language-select-label"
            value={selectedLanguage}
            label="Select Language"
            onChange={handleLanguageChange}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="english">English</MenuItem>
            <MenuItem value="hindi">Hindi</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* PDF Viewer */}
      <Box
        sx={{
          height: 'calc(100vh - 200px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mt: 4,
        }}
      >
        {isMobile ? (
          <Card sx={{ maxWidth: 340, width: '100%', textAlign: 'center', p: 2, boxShadow: 4 }}>
            <CardMedia sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <PictureAsPdfIcon sx={{ fontSize: 60, color: 'error.main' }} />
            </CardMedia>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                {selectedLanguage === 'english'
                  ? 'Consent Form (English)'
                  : 'Consent Form (Hindi)'}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Tap below to view the PDF in a new tab.
              </Typography>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => window.open(pdfUrl, '_blank')}
              >
                View PDF
              </Button>
            </CardContent>
          </Card>
        ) : (
          <iframe
            src={pdfUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
            title="PDF Viewer"
          />
        )}
      </Box>
    </Box>
  );
};

export default PDFViewerWithLanguage;
