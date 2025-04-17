// app/theme/ThemeRegistry.tsx or MuiThemeProvider.tsx
'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import React from 'react';
import { LanguageProvider } from '@shared-lib';

const theme = createTheme({
  palette: {
    primary: {
      main: red[500],
      contrastText: '#fff',
    },
    secondary: {
      main: '#f50057',
      contrastText: '#fff',
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: red[500],
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '50px', // Makes the primary button rounded
        },
      },
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
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
}
