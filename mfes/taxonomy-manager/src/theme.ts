import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", Arial, Helvetica, sans-serif',
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
      dark: '#dba403',
      contrastText: '#1E1B16',
    },
    secondary: {
      main: '#0D599E',
      light: '#E7F3F8',
      dark: '#064471',
      contrastText: '#ffffff',
    },
    success: {
      main: '#1A8825',
      light: '#C0FFC7',
      dark: '#00964b',
      contrastText: '#ffffff',
    },
    info: {
      main: '#064471',
      light: '#D6EEFF',
      dark: '#0bb2fb',
    },
    error: {
      main: '#BA1A1A',
      light: '#FFDAD6',
      dark: '#e45a68',
    },
    warning: {
      main: '#FDBE16',
      light: '#F8EFE7',
      dark: '#987100',
      contrastText: '#1E1B16',
      A100: '#D0C5B4',
      A200: '#4d4639',
      A400: '#FFFFFF',
      A700: '#EDEDED',
    },
    text: {
      primary: '#1E1B16',
      secondary: '#7C766F',
    },
    grey: {
      A100: '#ecf0f2',
      A200: '#99abb4',
      A400: '#767e89',
      A700: '#e6f4ff',
    },
    action: {
      disabledBackground: 'rgba(73,82,88,0.12)',
      hoverOpacity: 0.02,
      hover: 'rgba(0, 0, 0, 0.03)',
    },
    background: {
      default: '#FFFFFF',
      paper: '#fff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 100,
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '1rem',
          boxShadow: 'none',
          border: '1px solid #1E1B16',
          color: '#1E1B16',
        },
        containedPrimary: {
          backgroundColor: '#FDBE16',
          border: 'none',
          color: '#1E1B16',
          '&:hover': { backgroundColor: '#dba403' },
        },
        containedError: {
          backgroundColor: '#BA1A1A',
          border: 'none',
          color: '#FFDAD6',
          '&:hover': { backgroundColor: '#e45a68' },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontSize: '0.75rem',
          height: 20,
          minWidth: 20,
          backgroundColor: '#F8EFE7',
          color: '#FDBE16',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 8px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: '#F8EFE7',
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          // Modal overlay and content styling
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          padding: '8px 12px',
        },
      },
    },
  },
  mixins: {
    toolbar: {
      color: '#7C766F',
      '@media(min-width:1280px)': {
        minHeight: '64px',
        padding: '0 30px',
      },
      '@media(max-width:1280px)': {
        minHeight: '64px',
      },
    },
  },
});

export default theme;
