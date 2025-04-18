// app/theme/ThemeRegistry.tsx or MuiThemeProvider.tsx
'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
// import { yellow, red } from '@mui/material/colors';
import React from 'react';
import { LanguageProvider } from '@shared-lib';
import { CssBaseline } from '@mui/material';

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
  palette: {
    primary: {
      main: '#FDBE16',
    },
    secondary: {
      main: '#f50057',
      contrastText: '#fff',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          paddingTop: '18px',
          paddingBottom: '18px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {},
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '50px',
          color: '#1E1B16',
        },
      },
      variants: [
        {
          props: { variant: 'top-bar-link-text' },
          style: {
            color: '#1F1B13',
            padding: 14,
            borderRadius: 8,
            '& .MuiButton-startIcon': {
              color: '#635E57',
            },
          },
        },
        {
          props: { variant: 'top-bar-link-button' }, // custom variant name
          style: {
            fontWeight: 600,
            padding: 14,
            gap: 8,
            borderRadius: 8,
            borderBottomWidth: 3,
            // border: '2px dashed #1976d2',
            color: '#987100',
            backgroundColor: '#F7ECDF',
            '&:hover': {
              backgroundColor: '#fbf7f1',
            },
            '& .MuiButton-startIcon': {
              marginRight: 0,
            },
          },
        },
      ],
    },
  },
});

export default function ThemeRegistry({
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
