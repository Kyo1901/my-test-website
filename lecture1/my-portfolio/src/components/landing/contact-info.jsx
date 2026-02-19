import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

/**
 * ContactInfo 컴포넌트
 * 연락처 카드 및 SNS 링크 버튼 표시
 *
 * Props: 없음 (정적 데이터)
 *
 * Example usage:
 * <ContactInfo />
 */

const contactItems = [
  {
    icon: <EmailIcon sx={{ fontSize: 20 }} />,
    label: 'Email',
    value: 'your@email.com',
    copyText: 'your@email.com',
  },
];

const snsItems = [
  {
    icon: <GitHubIcon sx={{ fontSize: 18 }} />,
    label: 'GitHub',
    copyText: 'https://github.com/Kyo1901',
  },
  {
    icon: <LinkedInIcon sx={{ fontSize: 18 }} />,
    label: 'LinkedIn',
    copyText: 'https://linkedin.com/in/yourprofile',
  },
  {
    icon: <InstagramIcon sx={{ fontSize: 18 }} />,
    label: 'Instagram',
    copyText: 'https://instagram.com/yourhandle',
  },
];

function ContactInfo() {
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setSnackbarMsg(`${label} 클립보드에 복사됐어요!`);
      setSnackbarOpen(true);
    });
  };

  return (
    <Box>
      {/* 연락처 카드 */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 4,
        }}
      >
        {contactItems.map((item) => (
          <Box
            key={item.label}
            onClick={() => handleCopy(item.copyText, item.label)}
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 3,
              py: 2.5,
              bgcolor: '#111111',
              border: '1px solid #2A2A2A',
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'border-color 0.2s, background-color 0.2s',
              '&:hover': {
                borderColor: '#0071E3',
                bgcolor: '#161616',
              },
            }}
          >
            <Box sx={{ color: '#0071E3' }}>{item.icon}</Box>
            <Box>
              <Typography sx={{ color: '#6E6E73', fontSize: '0.7rem', mb: 0.2 }}>
                {item.label}
              </Typography>
              <Typography sx={{ color: '#F5F5F7', fontSize: '0.9rem', fontWeight: 500 }}>
                {item.value}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* SNS 버튼 */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
        {snsItems.map((item) => (
          <Button
            key={item.label}
            onClick={() => handleCopy(item.copyText, item.label)}
            startIcon={item.icon}
            variant="outlined"
            sx={{
              color: '#A1A1A6',
              borderColor: '#2A2A2A',
              borderRadius: 1.5,
              textTransform: 'none',
              fontSize: '0.85rem',
              px: 2.5,
              py: 1,
              '&:hover': {
                borderColor: '#0071E3',
                color: '#FFFFFF',
                bgcolor: 'transparent',
              },
            }}
          >
            {item.label}
          </Button>
        ))}
      </Box>

      {/* 클립보드 복사 알림 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            bgcolor: '#1C1C1E',
            color: '#F5F5F7',
            borderRadius: 2,
            fontSize: '0.85rem',
          },
        }}
      />
    </Box>
  );
}

export default ContactInfo;
