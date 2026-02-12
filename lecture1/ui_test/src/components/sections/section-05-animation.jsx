import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';
import Slide from '@mui/material/Slide';
import Divider from '@mui/material/Divider';

const DEMO_BOX_SX = {
  width: '100%',
  height: 120,
  borderRadius: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

/**
 * Section05Animation 컴포넌트
 *
 * MUI Fade, Grow, Slide 트랜지션과 CSS keyframe 애니메이션을
 * 버튼 토글로 재생/정지하는 섹션
 *
 * Example usage:
 * <Section05Animation />
 */
function Section05Animation() {
  const [isVisible, setIsVisible] = useState({
    fade: true,
    grow: true,
    slide: true,
    pulse: true,
  });

  const handleToggle = (key) => {
    setIsVisible((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleAll = () => {
    const allVisible = Object.values(isVisible).every(Boolean);
    const next = {};
    Object.keys(isVisible).forEach((key) => {
      next[key] = !allVisible;
    });
    setIsVisible(next);
  };

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
        05. Animation
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: 'text.secondary', mb: 3 }}
      >
        Fade, Grow, Slide 트랜지션 + CSS keyframe 애니메이션
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          onClick={handleToggleAll}
          sx={{ mr: 1, mb: 1 }}
        >
          전체 토글
        </Button>
        {['fade', 'grow', 'slide', 'pulse'].map((key) => (
          <Button
            key={key}
            variant={isVisible[key] ? 'outlined' : 'contained'}
            color={isVisible[key] ? 'primary' : 'secondary'}
            onClick={() => handleToggle(key)}
            sx={{ mr: 1, mb: 1, textTransform: 'capitalize' }}
          >
            {key} {isVisible[key] ? 'OFF' : 'ON'}
          </Button>
        ))}
      </Box>

      <Grid container spacing={3}>
        {/* Fade */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{
              mb: 1.5,
              textTransform: 'uppercase',
              color: 'text.secondary',
              letterSpacing: 1,
            }}
          >
            Fade
          </Typography>
          <Box sx={{ minHeight: 136 }}>
            <Fade in={isVisible.fade} timeout={800}>
              <Paper elevation={3} sx={{ ...DEMO_BOX_SX, backgroundColor: 'primary.main' }}>
                <Typography variant="body1" sx={{ color: 'primary.contrastText', fontWeight: 500 }}>
                  Fade
                </Typography>
              </Paper>
            </Fade>
          </Box>
        </Grid>

        {/* Grow */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{
              mb: 1.5,
              textTransform: 'uppercase',
              color: 'text.secondary',
              letterSpacing: 1,
            }}
          >
            Grow
          </Typography>
          <Box sx={{ minHeight: 136 }}>
            <Grow in={isVisible.grow} timeout={800}>
              <Paper elevation={3} sx={{ ...DEMO_BOX_SX, backgroundColor: 'secondary.main' }}>
                <Typography variant="body1" sx={{ color: 'secondary.contrastText', fontWeight: 500 }}>
                  Grow
                </Typography>
              </Paper>
            </Grow>
          </Box>
        </Grid>

        {/* Slide */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{
              mb: 1.5,
              textTransform: 'uppercase',
              color: 'text.secondary',
              letterSpacing: 1,
            }}
          >
            Slide
          </Typography>
          <Box sx={{ minHeight: 136, overflow: 'hidden' }}>
            <Slide direction="up" in={isVisible.slide} timeout={800} mountOnEnter unmountOnExit>
              <Paper elevation={3} sx={{ ...DEMO_BOX_SX, backgroundColor: 'error.main' }}>
                <Typography variant="body1" sx={{ color: 'error.contrastText', fontWeight: 500 }}>
                  Slide
                </Typography>
              </Paper>
            </Slide>
          </Box>
        </Grid>

        {/* CSS Pulse 애니메이션 */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{
              mb: 1.5,
              textTransform: 'uppercase',
              color: 'text.secondary',
              letterSpacing: 1,
            }}
          >
            CSS Pulse
          </Typography>
          <Box sx={{ minHeight: 136 }}>
            <Paper
              elevation={3}
              sx={{
                ...DEMO_BOX_SX,
                backgroundColor: 'success.main',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)', opacity: 1 },
                  '50%': { transform: 'scale(1.05)', opacity: 0.8 },
                  '100%': { transform: 'scale(1)', opacity: 1 },
                },
                animation: isVisible.pulse
                  ? 'pulse 1.5s ease-in-out infinite'
                  : 'none',
                transition: 'transform 0.3s ease',
              }}
            >
              <Typography variant="body1" sx={{ color: 'success.contrastText', fontWeight: 500 }}>
                Pulse
              </Typography>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ mt: 6 }} />
    </Box>
  );
}

export default Section05Animation;
