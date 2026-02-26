import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { supabase } from '../utils/supabase.js';
import useSession from '../hooks/useSession.js';

/**
 * 로그인 / 회원가입 페이지
 *
 * Props: 없음 (라우터로 접근)
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useSession();
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({ username: '', email: '', password: '', display_name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }
    setLoading(true);
    const { data, error: dbErr } = await supabase
      .from('sns_users')
      .select('*')
      .eq('email', form.email)
      .single();

    if (dbErr || !data) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      setLoading(false);
      return;
    }
    login(data);
    navigate('/');
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!form.username || !form.email || !form.password || !form.display_name) {
      setError('모든 항목을 입력해주세요.');
      return;
    }
    setLoading(true);
    const { data, error: dbErr } = await supabase
      .from('sns_users')
      .insert([{
        username: form.username,
        email: form.email,
        password: btoa(form.password),
        display_name: form.display_name,
      }])
      .select()
      .single();

    if (dbErr) {
      setError(dbErr.message.includes('unique') ? '이미 사용 중인 이메일 또는 아이디입니다.' : dbErr.message);
      setLoading(false);
      return;
    }
    login(data);
    navigate('/');
    setLoading(false);
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#FFFDF6',
        py: 4,
      }}
    >
      <Container maxWidth='xs'>
        {/* 로고 영역 */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant='h4' fontWeight={700} color='primary'>
            🐾 PawLog
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
            우리 아이의 하루를, 세상과 나눠요
          </Typography>
        </Box>

        <Box sx={{ bgcolor: '#fff', borderRadius: 3, p: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Tabs
            value={tab}
            onChange={(_, v) => { setTab(v); setError(''); }}
            centered
            textColor='primary'
            indicatorColor='primary'
            sx={{ mb: 3 }}
          >
            <Tab label='로그인' />
            <Tab label='회원가입' />
          </Tabs>

          { error && <Alert severity='error' sx={{ mb: 2 }}>{ error }</Alert> }

          { tab === 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label='이메일'
                name='email'
                type='email'
                value={form.email}
                onChange={handleChange}
                fullWidth
                size='small'
              />
              <TextField
                label='비밀번호'
                name='password'
                type='password'
                value={form.password}
                onChange={handleChange}
                fullWidth
                size='small'
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              <Button
                variant='contained'
                fullWidth
                onClick={handleLogin}
                disabled={loading}
                sx={{ py: 1.2, mt: 1 }}
              >
                { loading ? '로그인 중...' : '로그인' }
              </Button>

              <Divider sx={{ my: 1 }}>
                <Typography variant='caption' color='text.secondary'>또는 데모 계정</Typography>
              </Divider>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[
                  { label: '🐶 미아 (골든 리트리버)', email: 'mia@example.com' },
                  { label: '🐱 준 (고양이 아빠)', email: 'jun@example.com' },
                  { label: '🐰 소라 (토끼 집사)', email: 'sora@example.com' },
                ].map((demo) => (
                  <Button
                    key={demo.email}
                    variant='outlined'
                    size='small'
                    onClick={() => {
                      setForm({ ...form, email: demo.email, password: 'demo' });
                    }}
                    sx={{ justifyContent: 'flex-start', borderColor: '#FFB07A', color: '#E06A1E' }}
                  >
                    { demo.label }
                  </Button>
                ))}
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label='표시 이름'
                name='display_name'
                value={form.display_name}
                onChange={handleChange}
                fullWidth
                size='small'
              />
              <TextField
                label='아이디 (@username)'
                name='username'
                value={form.username}
                onChange={handleChange}
                fullWidth
                size='small'
              />
              <TextField
                label='이메일'
                name='email'
                type='email'
                value={form.email}
                onChange={handleChange}
                fullWidth
                size='small'
              />
              <TextField
                label='비밀번호'
                name='password'
                type='password'
                value={form.password}
                onChange={handleChange}
                fullWidth
                size='small'
              />
              <Button
                variant='contained'
                fullWidth
                onClick={handleRegister}
                disabled={loading}
                sx={{ py: 1.2, mt: 1 }}
              >
                { loading ? '가입 중...' : '회원가입' }
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
