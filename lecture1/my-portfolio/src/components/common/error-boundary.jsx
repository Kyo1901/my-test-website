import { Component } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: 2,
            p: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" sx={{ color: '#E84469', fontWeight: 700 }}>
            앱 오류가 발생했습니다
          </Typography>
          <Typography
            component="pre"
            sx={{
              color: '#1D1D1F',
              fontSize: '0.8rem',
              bgcolor: '#F5F5F7',
              p: 2,
              borderRadius: 2,
              maxWidth: 600,
              overflow: 'auto',
              textAlign: 'left',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            { String(this.state.error) }
          </Typography>
          <Button
            variant="contained"
            onClick={ () => window.location.reload() }
            sx={{ borderRadius: '980px', textTransform: 'none', bgcolor: '#0071E3' }}
          >
            새로고침
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
