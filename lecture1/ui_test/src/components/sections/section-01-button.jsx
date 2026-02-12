import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

/**
 * Section01Button 컴포넌트
 *
 * MUI Button의 variant(contained, outlined, text)와
 * color(primary, secondary, error) 조합을 보여주는 섹션
 *
 * Example usage:
 * <Section01Button />
 */
function Section01Button() {
  const variants = ['contained', 'outlined', 'text'];
  const colors = ['primary', 'secondary', 'error'];

  const handleClick = (variant, color) => {
    alert(`${variant} / ${color} 버튼이 클릭되었습니다!`);
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
        01. Button
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: 'text.secondary', mb: 3 }}
      >
        variant (contained, outlined, text) × color (primary, secondary, error)
      </Typography>

      <Grid container spacing={4}>
        {variants.map((variant) => (
          <Grid key={variant} size={{ xs: 12, md: 4 }}>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 1.5,
                textTransform: 'uppercase',
                color: 'text.secondary',
                letterSpacing: 1,
              }}
            >
              {variant}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {colors.map((color) => (
                <Button
                  key={`${variant}-${color}`}
                  variant={variant}
                  color={color}
                  onClick={() => handleClick(variant, color)}
                >
                  {color}
                </Button>
              ))}
            </Box>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ mt: 6 }} />
    </Box>
  );
}

export default Section01Button;
