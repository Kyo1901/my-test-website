import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import DevicesIcon from '@mui/icons-material/Devices';
import useAuth from '../hooks/use-auth.jsx';

/**
 * RegisterPage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <RegisterPage />
 */
function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    email: '',
    name: '',
    password: '',
    passwordConfirm: '',
    phone: '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!form.email.trim() || !form.name.trim() || !form.password.trim()) {
      setErrorMsg('이메일, 이름, 비밀번호는 필수 입력 항목입니다.');
      return;
    }

    if (form.password !== form.passwordConfirm) {
      setErrorMsg('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (form.password.length < 4) {
      setErrorMsg('비밀번호는 4자 이상이어야 합니다.');
      return;
    }

    setIsSubmitting(true);
    const result = await register({
      email: form.email,
      name: form.name,
      password: form.password,
      phone: form.phone || null,
    });
    setIsSubmitting(false);

    if (result.success) {
      navigate('/');
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="xs">
        <Paper sx={{ p: { xs: 3, md: 4 } }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <DevicesIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              회원가입
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              IT Info 커뮤니티에 가입하세요
            </Typography>
          </Box>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMsg}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="이메일"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              sx={{ mb: 2 }}
              autoComplete="email"
              required
            />
            <TextField
              fullWidth
              label="이름"
              value={form.name}
              onChange={handleChange('name')}
              sx={{ mb: 2 }}
              autoComplete="name"
              required
            />
            <TextField
              fullWidth
              label="비밀번호"
              type="password"
              value={form.password}
              onChange={handleChange('password')}
              sx={{ mb: 2 }}
              autoComplete="new-password"
              required
            />
            <TextField
              fullWidth
              label="비밀번호 확인"
              type="password"
              value={form.passwordConfirm}
              onChange={handleChange('passwordConfirm')}
              sx={{ mb: 2 }}
              autoComplete="new-password"
              required
              error={form.passwordConfirm.length > 0 && form.password !== form.passwordConfirm}
              helperText={
                form.passwordConfirm.length > 0 && form.password !== form.passwordConfirm
                  ? '비밀번호가 일치하지 않습니다'
                  : ''
              }
            />
            <TextField
              fullWidth
              label="전화번호"
              value={form.phone}
              onChange={handleChange('phone')}
              sx={{ mb: 3 }}
              placeholder="010-0000-0000"
              autoComplete="tel"
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              size="large"
              disabled={isSubmitting}
              sx={{ mb: 2 }}
            >
              {isSubmitting ? '가입 중...' : '회원가입'}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              이미 계정이 있으신가요?{' '}
              <Link component={RouterLink} to="/login" underline="hover">
                로그인
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default RegisterPage;
