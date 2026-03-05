import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';

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
    value: 'skadnjs153@naver.com',
    copyText: 'skadnjs153@naver.com',
  },
];

const snsItems = [
  {
    icon: <GitHubIcon sx={{ fontSize: 18 }} />,
    label: 'GitHub',
    copyText: 'https://github.com/Kyo1901',
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
              bgcolor: 'var(--color-bg-primary)',
              border: '1px solid var(--color-border)',
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              '&:hover': {
                borderColor: 'var(--color-primary)',
                boxShadow: '0 2px 12px rgba(0,113,227,0.1)',
              },
            }}
          >
            <Box sx={{ color: 'var(--color-primary)' }}>{item.icon}</Box>
            <Box>
              <Typography sx={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', mb: 0.2 }}>
                {item.label}
              </Typography>
              <Typography sx={{ color: 'var(--color-text-primary)', fontSize: '0.9rem', fontWeight: 500 }}>
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
              color: 'var(--color-text-secondary)',
              borderColor: 'var(--color-border)',
              bgcolor: 'var(--color-bg-primary)',
              borderRadius: 1.5,
              textTransform: 'none',
              fontSize: '0.85rem',
              px: 2.5,
              py: 1,
              '&:hover': {
                borderColor: 'var(--color-primary)',
                color: 'var(--color-primary)',
                bgcolor: 'var(--color-bg-primary)',
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
            bgcolor: 'var(--color-secondary)',
            color: '#FFFFFF',
            borderRadius: 2,
            fontSize: '0.85rem',
          },
        }}
      />
    </Box>
  );
}

export default ContactInfo;
