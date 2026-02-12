import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

/**
 * Section02Input 컴포넌트
 *
 * MUI TextField의 variant(standard, outlined, filled)를 보여주고
 * 입력값을 실시간으로 하단에 표시하는 섹션
 *
 * Example usage:
 * <Section02Input />
 */
function Section02Input() {
  const variants = ['standard', 'outlined', 'filled'];
  const [values, setValues] = useState({
    standard: '',
    outlined: '',
    filled: '',
  });

  const handleChange = (variant) => (e) => {
    setValues((prev) => ({ ...prev, [variant]: e.target.value }));
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
        02. Input (TextField)
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: 'text.secondary', mb: 3 }}
      >
        variant (standard, outlined, filled) + 실시간 입력값 표시
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
            <TextField
              variant={variant}
              label={`${variant} label`}
              placeholder={`${variant} 입력...`}
              value={values[variant]}
              onChange={handleChange(variant)}
              fullWidth
            />
            <Box
              sx={{
                mt: 1.5,
                p: 1.5,
                borderRadius: 1,
                backgroundColor: 'action.hover',
                minHeight: 40,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: values[variant] ? 'text.primary' : 'text.disabled' }}
              >
                {values[variant] || '입력값이 여기에 표시됩니다.'}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ mt: 6 }} />
    </Box>
  );
}

export default Section02Input;
