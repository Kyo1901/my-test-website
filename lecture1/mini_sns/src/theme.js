import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF8C42',
      light: '#FFB07A',
      dark: '#E06A1E',
      contrastText: '#fff',
    },
    secondary: {
      main: '#B5EAD7',
      light: '#D4F5EC',
      dark: '#7ECDB0',
      contrastText: '#333',
    },
    background: {
      default: '#FFFDF6',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2D2D2D',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: '"Noto Sans KR", "Roboto", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        },
      },
    },
  },
});

export default theme;
