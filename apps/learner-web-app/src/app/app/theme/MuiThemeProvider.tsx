// app/theme/ThemeRegistry.tsx or MuiThemeProvider.tsx
'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import { LanguageProvider } from '@shared-lib';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FDBE16',
      // contrastText: '#fff',
      light: '#FFDEA1',
    },

    secondary: {
      main: '#0D599E',
      light: '#E7F3F8',
      // contrastText: '#fff',
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {},
          // background: '#BA1A1A'
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '50px',
          textTransform: 'none',
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
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
}
