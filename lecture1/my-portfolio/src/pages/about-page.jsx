import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function AboutPage() {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'var(--color-bg-primary)',
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Typography
          variant="overline"
          sx={{
            color: 'var(--color-primary)',
            fontWeight: 600,
            letterSpacing: 2,
          }}
        >
          About Me
        </Typography>
        <Box
          sx={{
            width: 40,
            height: 3,
            bgcolor: 'var(--color-primary)',
            borderRadius: 2,
            mx: 'auto',
            my: 2,
          }}
        />
        <Typography
          variant="h5"
          sx={{
            color: 'var(--color-text-primary)',
            fontWeight: 500,
            mb: 2,
            fontSize: { xs: '1.1rem', md: '1.4rem' },
          }}
        >
          About Me 페이지가 개발될 공간입니다.
        </Typography>
        <Typography
          sx={{
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
          }}
        >
          상세한 자기소개가 들어갈 예정입니다.
        </Typography>
      </Container>
    </Box>
  );
}

export default AboutPage;
