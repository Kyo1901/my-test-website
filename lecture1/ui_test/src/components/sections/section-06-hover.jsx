import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

const CARD_BASE_SX = {
  height: 160,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 2,
  cursor: 'pointer',
  transition: 'all 0.35s ease',
  userSelect: 'none',
};

const HOVER_CARDS = [
  {
    title: 'Scale Up',
    description: '크기 확대',
    sx: {
      backgroundColor: 'primary.main',
      color: 'primary.contrastText',
      '&:hover': {
        transform: 'scale(1.08)',
      },
    },
  },
  {
    title: 'Shadow Lift',
    description: '그림자 부상',
    sx: {
      backgroundColor: 'background.paper',
      color: 'text.primary',
      boxShadow: 1,
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: 12,
      },
    },
  },
  {
    title: 'Color Shift',
    description: '배경색 전환',
    sx: {
      backgroundColor: 'grey.200',
      color: 'text.primary',
      '&:hover': {
        backgroundColor: 'secondary.main',
        color: 'secondary.contrastText',
      },
    },
  },
  {
    title: 'Border Glow',
    description: '테두리 강조',
    sx: {
      backgroundColor: 'background.paper',
      color: 'text.primary',
      border: '2px solid transparent',
      '&:hover': {
        borderColor: 'primary.main',
        boxShadow: '0 0 16px rgba(25, 118, 210, 0.4)',
      },
    },
  },
  {
    title: 'Rotate',
    description: '회전 효과',
    sx: {
      backgroundColor: 'error.main',
      color: 'error.contrastText',
      '&:hover': {
        transform: 'rotate(3deg) scale(1.04)',
      },
    },
  },
  {
    title: 'Blur Reveal',
    description: '흐림 해제',
    sx: {
      backgroundColor: 'success.main',
      color: 'success.contrastText',
      filter: 'blur(2px)',
      opacity: 0.7,
      '&:hover': {
        filter: 'blur(0px)',
        opacity: 1,
      },
    },
  },
];

/**
 * Section06Hover 컴포넌트
 *
 * 6가지 호버 효과를 카드 형태로 보여주는 섹션
 * Scale, Shadow, Color, Border, Rotate, Blur 효과 구현
 *
 * Example usage:
 * <Section06Hover />
 */
function Section06Hover() {
  return (
    <Box sx={{ mb: 6 }}>
      <Typography
        variant="h5"
        component="h2"
        sx={{
          fontWeight: 600,
          mb: 1,
          fontSize: { xs: '1.2rem', md: '1.5rem' },
        }}
      >
        06. Hover Effects
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: 'text.secondary', mb: 3 }}
      >
        마우스를 올려 6가지 호버 효과를 확인하세요
      </Typography>

      <Grid container spacing={3}>
        {HOVER_CARDS.map((card) => (
          <Grid key={card.title} size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper
              elevation={2}
              sx={{ ...CARD_BASE_SX, ...card.sx }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {card.title}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                {card.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ mt: 6 }} />
    </Box>
  );
}

export default Section06Hover;
