// libs/ui-theme/src/lib/theme.ts
import { createTheme, Theme } from '@mui/material/styles';

const commonComponents = {
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8, // Add rounded corners
          backgroundColor: '#f9f9f9', // Light background
          '& fieldset': {
            borderColor: '#1976d2', // Primary border color
          },
          '&:hover fieldset': {
            borderColor: '#115293', // Darker primary on hover
          },
          '&.Mui-focused fieldset': {
            borderColor: '#004ba0', // Even darker on focus
          },
        },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none', // Disable uppercase text
        borderRadius: 12, // Rounded corners
        fontWeight: 'bold', // Bold text
        padding: '8px 16px', // Adjust padding
        variants: [],
      },
      containedPrimary: {
        backgroundColor: (theme: any) => theme.palette.primary.main, // Primary background
        '&:hover': {
          backgroundColor: (theme: any) => theme.palette.primary.dark, // Darker shade on hover
        },
      },
      containedSecondary: {
        backgroundColor: (theme: any) => theme.palette.secondary.main, // Secondary background
        '&:hover': {
          backgroundColor: (theme: any) => theme.palette.secondary.dark, // Darker shade on hover
        },
      },
    },
  },
};
// Light and dark mode palettes
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#fff',
      paper: '#f5f5f5',
    },
  },
  //@ts-ignore
  components: commonComponents,
  typography: {
    fontFamily: 'inherit',
    h1: { fontSize: '22px', fontWeight: 400 },
    // other typography settings...
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FDBE16',
    },
    secondary: {
      main: '#0D599E',
    },
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
  },
  //@ts-ignore
  components: commonComponents,
  typography: {
    fontFamily: 'inherit',
    h1: { fontSize: '22px', fontWeight: 400 },
    // other typography settings...
  },
});

export const theme: Theme = lightTheme;
