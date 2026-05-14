import { useState } from 'react';
import {
  Box, Container, Card, Typography, TextField, Button,
  Alert, CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

function CreateBoardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setError('');

    if (!name.trim()) { setError('게시판 이름을 입력해주세요.'); return; }
    if (!/^[a-zA-Z0-9가-힣_]+$/.test(name)) {
      setError('게시판 이름은 영문, 숫자, 한글, 언더스코어만 사용 가능합니다.');
      return;
    }

    setLoading(true);
    const { data, error: err } = await supabase
      .from('roundit_boards')
      .insert({
        name: name.trim(),
        description: description.trim() || null,
        created_by: user.id,
        member_cnt: 1,
      })
      .select()
      .single();

    if (err) {
      if (err.code === '23505') setError('이미 존재하는 게시판 이름입니다.');
      else setError('게시판 생성 중 오류가 발생했습니다.');
      setLoading(false);
      return;
    }

    await supabase.from('roundit_board_members').insert({ user_id: user.id, board_id: data.id });
    navigate(`/b/${data.name}`);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
      <Container maxWidth='sm'>
        <Card sx={{ p: { xs: 3, md: 4 }, border: '1px solid #EDEFF1' }}>
          <Typography variant='h2' sx={{ mb: 3, color: '#1C1C1C' }}>게시판 만들기</Typography>

          {error && <Alert severity='error' sx={{ mb: 2 }}>{error}</Alert>}

          <Box component='form' onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant='body2' sx={{ mb: 0.5, fontWeight: 700 }}>게시판 이름</Typography>
              <TextField
                value={name}
                onChange={(e) => setName(e.target.value)}
                size='small'
                fullWidth
                required
                placeholder='예: 게임, 맛집, 여행'
                InputProps={{
                  startAdornment: <Typography sx={{ color: '#878A8C', mr: 0.5 }}>b/</Typography>,
                }}
                inputProps={{ maxLength: 50 }}
                helperText='영문, 숫자, 한글, 언더스코어 사용 가능 (최대 50자)'
              />
            </Box>
            <Box>
              <Typography variant='body2' sx={{ mb: 0.5, fontWeight: 700 }}>설명 (선택)</Typography>
              <TextField
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
                size='small'
                fullWidth
                placeholder='게시판을 소개해주세요...'
                inputProps={{ maxLength: 500 }}
                helperText={`${description.length}/500`}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button variant='outlined' onClick={() => navigate(-1)} sx={{ borderRadius: '20px', fontWeight: 700 }}>
                취소
              </Button>
              <Button
                type='submit'
                variant='contained'
                disabled={loading}
                sx={{ borderRadius: '20px', fontWeight: 700 }}
              >
                {loading ? <CircularProgress size={20} color='inherit' /> : '게시판 만들기'}
              </Button>
            </Box>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}

export default CreateBoardPage;
