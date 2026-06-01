'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Dialog,
  Typography,
  Grid,
  ButtonBase,
} from '@mui/material';
import type { DialogProps } from '@mui/material/Dialog';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from '@shared-lib';
import {
  PLP_LANGUAGE_OPTIONS,
  PLP_LANGUAGE_POPUP_DISMISSED_KEY,
} from './languageOptions';

export type LanguageSelectionPopupSize = NonNullable<DialogProps['maxWidth']>;

interface LanguageSelectionPopupProps {
  /** MUI Dialog maxWidth — xs (444px), sm (600px), md (900px), etc. */
  size?: LanguageSelectionPopupSize;
}

const LanguageSelectionPopup: React.FC<LanguageSelectionPopupProps> = ({
  size = 'xs',
}) => {
  const { setLanguage } = useTranslation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem('isAndroidApp') === 'yes') return;
    const dismissed = sessionStorage.getItem(PLP_LANGUAGE_POPUP_DISMISSED_KEY);
    if (!dismissed) {
      setOpen(true);
    }
  }, []);

  const persistLanguage = (code: string) => {
    setLanguage(code);
    localStorage.setItem('lang', code);
    localStorage.setItem('preferredLanguage', code);

    if (localStorage.getItem('isAndroidApp') === 'yes' && window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: 'LANGUAGE_CHANGE_EVENT',
          data: { language: code },
        })
      );
    }
  };

  const handleLanguageSelect = (code: string) => {
    persistLanguage(code);
    sessionStorage.setItem(PLP_LANGUAGE_POPUP_DISMISSED_KEY, 'true');
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      maxWidth={size}
      fullWidth
      onClose={(_, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          return;
        }
      }}
      aria-labelledby="language-selection-title"
      aria-describedby="language-selection-description"
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(4px)',
          },
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
          m: { xs: 2, sm: 3 },
        },
      }}
    >
      <Box sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 2.5,
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1.5,
            }}
          >
          <LanguageIcon sx={{ color: '#FDBE16', fontSize: 55 }} />
          </Box>
          <Typography
            id="language-selection-title"
            sx={{
              fontFamily: 'Poppins, Arial, sans-serif',
              fontWeight: 500,
              fontSize: { xs: '18px', sm: '20px' },
              color: '#49454F',
              textAlign: 'center',
            }}
          >
            Select your language
          </Typography>
        </Box>

        <Grid
          container
          spacing={1.5}
          id="language-selection-description"
        >
          {PLP_LANGUAGE_OPTIONS.map((option) => (
            <Grid item xs={4} key={option.code}>
              <ButtonBase
                onClick={() => handleLanguageSelect(option.code)}
                sx={{
                  width: '100%',
                  border: '1px solid #E0E0E0',
                  borderRadius: '12px',
                  py: 1.5,
                  px: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 72,
                  transition: 'border-color 0.2s, background-color 0.2s',
                  '&:hover': {
                    borderColor: '#BDBDBD',
                    backgroundColor: '#FAFAFA',
                  },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Poppins, Arial, sans-serif',
                    fontWeight: option.code === 'en' ? 600 : 500,
                    fontSize: option.code === 'en' ? '15px' : '16px',
                    color: '#1F1B13',
                    lineHeight: 1.3,
                    textAlign: 'center',
                  }}
                >
                  {option.nativeLabel}
                </Typography>
                {option.englishLabel && (
                  <Typography
                    sx={{
                      fontFamily: 'Poppins, Arial, sans-serif',
                      fontWeight: 400,
                      fontSize: '12px',
                      color: '#79747E',
                      mt: 0.25,
                      lineHeight: 1.3,
                      textAlign: 'center',
                    }}
                  >
                    {option.englishLabel}
                  </Typography>
                )}
              </ButtonBase>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Dialog>
  );
};

export default LanguageSelectionPopup;
