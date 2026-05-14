import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF4500',
      light: '#FF6434',
      dark: '#CC3700',
      contrastText: '#fff',
    },
    secondary: {
      main: '#0079D3',
      contrastText: '#fff',
    },
    background: {
      default: '#DAE0E6',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1C1C1C',
      secondary: '#878A8C',
    },
    divider: '#EDEFF1',
  },
  typography: {
    fontFamily: '"IBM Plex Sans", "Noto Sans KR", "Roboto", sans-serif',
    h1: { fontSize: '1.5rem', fontWeight: 700 },
    h2: { fontSize: '1.25rem', fontWeight: 700 },
    h3: { fontSize: '1.125rem', fontWeight: 600 },
    body1: { fontSize: '0.9375rem' },
    body2: { fontSize: '0.875rem' },
    caption: { fontSize: '0.75rem', color: '#878A8C' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '20px',
          fontWeight: 700,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          boxShadow: 'none',
          border: '1px solid #EDEFF1',
          '&:hover': {
            border: '1px solid #818384',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          fontWeight: 700,
          fontSize: '0.75rem',
        },
      },
    },
  },
  spacing: 8,
});

export default theme;
