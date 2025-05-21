// app/theme/ThemeRegistry.tsx or MuiThemeProvider.tsx
'use client';

import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import { LanguageProvider } from '@shared-lib';
import FontSizeTheme from '../../context/FontSizeTheme';

// Add module augmentation for custom typography variants
declare module '@mui/material/styles' {
  interface TypographyVariants {
    body3: React.CSSProperties;
    body4: React.CSSProperties;
    body5: React.CSSProperties;
    body6: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    body3?: React.CSSProperties;
    body4?: React.CSSProperties;
    body5?: React.CSSProperties;
    body6?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    body3: true;
    body4: true;
    body5: true;
    body6: true;
  }
}

export const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, Arial, sans-serif',
    allVariants: {
      fontFamily: 'Poppins, Arial, sans-serif',
    },
    h1: {
      fontSize: 'calc(22px * var(--font-size-scale))',
      fontWeight: 400,
      lineHeight: 1.27,
      marginBottom: '1rem',
    },
    h2: {
      fontSize: 'calc(16px * var(--font-size-scale))',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h3: {
      fontSize: 'calc(14px * var(--font-size-scale))',
      fontWeight: 500,
      lineHeight: 1.43,
      marginBottom: '0.5rem',
    },
    h4: {
      //h4 is a large label style
      fontSize: 'calc(14px * var(--font-size-scale))',
      fontWeight: 400,
      lineHeight: 1.43,
      letterSpacing: '0.1px',
    },
    h5: {
      //h5 is a medium label style
      fontSize: 'calc(12px * var(--font-size-scale))',
      fontWeight: 500,
      lineHeight: 1.33,
      letterSpacing: '0.5px',
    },
    h6: {
      //h6 is a small label style
      fontSize: 'calc(11px * var(--font-size-scale))',
      fontWeight: 500,
      lineHeight: 1.45,
      letterSpacing: '0.5px',
    },
    body1: {
      fontSize: 'calc(16px * var(--font-size-scale))',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.5px',
    },
    body2: {
      fontSize: 'calc(14px * var(--font-size-scale))',
      fontWeight: 400,
      lineHeight: 1.43,
      letterSpacing: '0.25px',
      marginBottom: '1rem',
    },
    body3: {
      fontSize: 'calc(72px * var(--font-size-scale))',
      fontWeight: 700,
      lineHeight: 2.43,
      letterSpacing: '0.25px',
      marginBottom: '1.5rem',
    },
    body4: {
      fontSize: 'calc(12px * var(--font-size-scale))',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.25px',
      marginBottom: '1rem',
    },
    body5: {
      fontSize: 'calc(12px * var(--font-size-scale))',
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0.15px',
      marginBottom: '1rem',
    },
    body6: {
      fontSize: 'calc(10px * var(--font-size-scale))',
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: '0.4px',
      marginBottom: '0.75rem',
    },
    button: {
      textTransform: 'none',
      fontSize: 'calc(14px * var(--font-size-scale))',
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
      main: '#50EE42',
    },
    error: {
      main: '#ff0000',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          '& > :last-child': {
            paddingBottom: '16px !important',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          paddingTop: '18px',
          paddingBottom: '18px',
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {},
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
          textTransform: 'none',
          boxShadow: 'unset !important',
        },
      },
      variants: [
        {
          props: { variant: 'top-bar-link-text' },
          style: {
            fontSize: 'calc(16px * var(--font-size-scale))',
            lineHeight: '24px',
            fontWeight: 400,
            color: '#1F1B13',
            padding: 14,
            borderRadius: 8,
            '& .MuiButton-startIcon': {
              color: '#635E57',
            },
          },
        },
        {
          props: { variant: 'top-bar-link-button' },
          style: {
            fontSize: 'calc(16px * var(--font-size-scale))',
            lineHeight: '24px',
            fontWeight: 600,
            padding: 14,
            gap: 8,
            borderRadius: 8,
            borderBottomWidth: 3,
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
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          '&.Mui-error': {
            backgroundColor: '#ff0000',
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
    <FontSizeTheme baseTheme={theme}>
      <CssBaseline />
      {children}
    </FontSizeTheme>
  );
}

export const MuiThemeProviderWithLanguage = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <LanguageProvider>{children}</LanguageProvider>;
};
