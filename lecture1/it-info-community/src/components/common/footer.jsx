import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

/**
 * Footer 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <Footer />
 */
function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.dark',
        color: 'white',
        py: { xs: 3, md: 4 },
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="body2"
          sx={{ textAlign: 'center', opacity: 0.9 }}
        >
          &copy; 2025 IT Info Community. All rights reserved.
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'center',
            mt: 1,
            opacity: 0.7,
          }}
        >
          전자기기 정보 교류 커뮤니티
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
