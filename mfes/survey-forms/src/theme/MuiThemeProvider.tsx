'use client';

import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import { LanguageProvider } from '@shared-lib';

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, Arial, sans-serif',
    allVariants: {
      fontFamily: 'Poppins, Arial, sans-serif',
    },
    h1: {
      fontSize: '22px',
      fontWeight: 400,
      lineHeight: '28px',
      marginBottom: '1rem',
    },
    h2: {
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: '24px',
    },
    h3: {
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: '20px',
      marginBottom: '0.5rem',
    },
    h4: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '20px',
      letterSpacing: '0.1px',
    },
    h5: {
      fontSize: '12px',
      fontWeight: 500,
      lineHeight: '16px',
      letterSpacing: '0.5px',
    },
    h6: {
      fontSize: '11px',
      fontWeight: 500,
      lineHeight: '16px',
      letterSpacing: '0.5px',
    },
    body1: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '24px',
      letterSpacing: '0.5px',
    },
    body2: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '20px',
      letterSpacing: '0.25px',
      marginBottom: '1rem',
    },
    button: {
      textTransform: 'none',
      fontSize: '14px',
      fontWeight: 600,
    },
  },
  palette: {
    primary: {
      main: '#FDBE16',
      light: '#FFDEA1',
    },
    secondary: {
      main: '#0D599E',
      light: '#E7F3F8',
    },
    success: {
      main: '#00c292',
      contrastText: '#ffffff',
    },
    error: {
      main: '#e46a76',
      contrastText: '#ffffff',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          '& > :last-child': {
            paddingBottom: 16,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '50px',
          color: '#1E1B16',
          textTransform: 'none',
          boxShadow: 'unset !important',
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: '#1E1B16',
          fontSize: '14px',
          fontWeight: 600,
          '&.Mui-focused': {
            color: '#1E1B16',
          },
          '&.Mui-error': {
            color: '#e46a76',
          },
        },
      },
    },
  },
});

export default function MuiThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
}
