import { useState } from 'react';
import {
  Box, Container, Card, Typography, TextField, Button,
  Alert, CircularProgress, Link, Stepper, Step, StepLabel,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const INTEREST_BOARDS = ['일상', '기술/IT', '게임', '스포츠', '음식', '영화/드라마', '음악', '여행', '패션', '독서'];
const STEPS = ['계정 정보', '관심 게시판 선택'];

function RegisterPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [interests, setInterests] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStep1 = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password || !username) { setError('모든 필드를 입력해주세요.'); return; }
    if (password !== confirmPassword) { setError('비밀번호가 일치하지 않습니다.'); return; }
    if (password.length < 6) { setError('비밀번호는 6자 이상이어야 합니다.'); return; }
    if (username.length < 3) { setError('닉네임은 3자 이상이어야 합니다.'); return; }
    setActiveStep(1);
  };

  const handleRegister = async () => {
    if (interests.length < 1) { setError('관심 게시판을 1개 이상 선택해주세요.'); return; }
    setLoading(true);
    setError('');
    try {
      await signUp(email, password, username);
      navigate('/');
    } catch (err) {
      setError(err.message ?? '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (board) => {
    setInterests((prev) =>
      prev.includes(board) ? prev.filter((b) => b !== board) : [...prev, board]
    );
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

          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {STEPS.map((label) => (
              <Step key={label}><StepLabel>{label}</StepLabel></Step>
            ))}
          </Stepper>

          {error && <Alert severity='error' sx={{ mb: 2 }}>{error}</Alert>}

          {activeStep === 0 ? (
            <Box component='form' onSubmit={handleStep1} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
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
                label='닉네임 (3자 이상)'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                size='small'
                fullWidth
                required
              />
              <TextField
                label='비밀번호 (6자 이상)'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size='small'
                fullWidth
                required
              />
              <TextField
                label='비밀번호 확인'
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                size='small'
                fullWidth
                required
              />
              <Button type='submit' variant='contained' fullWidth sx={{ borderRadius: '20px', fontWeight: 700, py: 1.2 }}>
                다음
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant='body2' sx={{ color: '#878A8C' }}>
                관심 있는 게시판을 선택하세요 (최소 1개)
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {INTEREST_BOARDS.map((board) => (
                  <Chip
                    key={board}
                    label={board}
                    onClick={() => toggleInterest(board)}
                    color={interests.includes(board) ? 'primary' : 'default'}
                    variant={interests.includes(board) ? 'filled' : 'outlined'}
                    sx={{ cursor: 'pointer', fontWeight: interests.includes(board) ? 700 : 400 }}
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant='outlined'
                  fullWidth
                  onClick={() => setActiveStep(0)}
                  sx={{ borderRadius: '20px', fontWeight: 700 }}
                >
                  이전
                </Button>
                <Button
                  variant='contained'
                  fullWidth
                  onClick={handleRegister}
                  disabled={loading}
                  sx={{ borderRadius: '20px', fontWeight: 700 }}
                >
                  {loading ? <CircularProgress size={20} color='inherit' /> : '가입 완료'}
                </Button>
              </Box>
            </Box>
          )}

          <Typography variant='body2' sx={{ textAlign: 'center', mt: 2, color: '#878A8C' }}>
            이미 계정이 있으신가요?{' '}
            <Link
              component='button'
              onClick={() => navigate('/login')}
              sx={{ color: 'primary.main', fontWeight: 700, cursor: 'pointer' }}
            >
              로그인
            </Link>
          </Typography>
        </Card>
      </Container>
    </Box>
  );
}

export default RegisterPage;
