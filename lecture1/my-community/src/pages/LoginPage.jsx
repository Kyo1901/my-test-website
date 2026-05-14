import { useState } from 'react';
import {
  Box, Container, Card, Typography, TextField, Button,
  Divider, Alert, CircularProgress, Link,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('이메일과 비밀번호를 입력해주세요.'); return; }
    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      setError('구글 로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
      <Container maxWidth='sm'>
        <Card sx={{ p: { xs: 3, md: 4 }, border: '1px solid #EDEFF1' }}>
          {/* 로고 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, justifyContent: 'center' }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.25rem' }}>R</Typography>
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#1C1C1C' }}>roundit</Typography>
          </Box>

          <Typography variant='h2' sx={{ textAlign: 'center', mb: 3, color: '#1C1C1C' }}>로그인</Typography>

          {error && <Alert severity='error' sx={{ mb: 2 }}>{error}</Alert>}

          {/* 구글 로그인 */}
          <Button
            fullWidth
            variant='outlined'
            startIcon={<GoogleIcon />}
            onClick={handleGoogle}
            sx={{ mb: 2, borderRadius: '20px', fontWeight: 700, textTransform: 'none', py: 1.2 }}
          >
            Google로 계속하기
          </Button>

          <Divider sx={{ mb: 2 }}>
            <Typography variant='caption' sx={{ color: '#878A8C' }}>또는</Typography>
          </Divider>

          {/* 이메일 로그인 */}
          <Box component='form' onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <TextField
              label='이메일'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size='small'
              fullWidth
              required
            />
            <TextField
              label='비밀번호'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size='small'
              fullWidth
              required
            />
            <Button
              type='submit'
              variant='contained'
              fullWidth
              disabled={loading}
              sx={{ borderRadius: '20px', fontWeight: 700, py: 1.2 }}
            >
              {loading ? <CircularProgress size={20} color='inherit' /> : '로그인'}
            </Button>
          </Box>

          <Typography variant='body2' sx={{ textAlign: 'center', mt: 2, color: '#878A8C' }}>
            계정이 없으신가요?{' '}
            <Link
              component='button'
              onClick={() => navigate('/register')}
              sx={{ color: 'primary.main', fontWeight: 700, cursor: 'pointer' }}
            >
              회원가입
            </Link>
          </Typography>
        </Card>
      </Container>
    </Box>
  );
}

export default LoginPage;
