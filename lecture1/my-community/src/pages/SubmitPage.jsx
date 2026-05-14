import { useState, useEffect } from 'react';
import {
  Box, Container, Card, Typography, TextField, Button,
  Select, MenuItem, FormControl, InputLabel, Tabs, Tab,
  Alert, CircularProgress,
} from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

const POST_TYPES = [
  { value: 'text', label: '텍스트', icon: <TextFieldsIcon sx={{ fontSize: '1rem' }} /> },
  { value: 'image', label: '이미지', icon: <ImageIcon sx={{ fontSize: '1rem' }} /> },
  { value: 'link', label: '링크', icon: <LinkIcon sx={{ fontSize: '1rem' }} /> },
];

function SubmitPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [postType, setPostType] = useState('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [flair, setFlair] = useState('');
  const [boardId, setBoardId] = useState(location.state?.boardId ?? '');
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchBoards();
  }, [user]);

  const fetchBoards = async () => {
    const { data } = await supabase
      .from('roundit_boards')
      .select('id, name')
      .order('member_cnt', { ascending: false });
    setBoards(data ?? []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) { setError('제목을 입력해주세요.'); return; }
    if (!boardId) { setError('게시판을 선택해주세요.'); return; }
    if (postType === 'image' && !imageUrl.trim()) { setError('이미지 URL을 입력해주세요.'); return; }
    if (postType === 'link' && !linkUrl.trim()) { setError('링크 URL을 입력해주세요.'); return; }

    setLoading(true);
    const { data, error: err } = await supabase
      .from('roundit_posts')
      .insert({
        title: title.trim(),
        content: postType === 'text' ? content.trim() : null,
        post_type: postType,
        image_url: postType === 'image' ? imageUrl.trim() : null,
        link_url: postType === 'link' ? linkUrl.trim() : null,
        flair: flair.trim() || null,
        author_id: user.id,
        board_id: Number(boardId),
      })
      .select()
      .single();

    if (err) {
      setError('게시물 작성 중 오류가 발생했습니다.');
      setLoading(false);
      return;
    }
    navigate(`/post/${data.id}`);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 3 }}>
      <Container maxWidth='md' sx={{ px: { xs: 1, md: 2 } }}>
        <Typography variant='h2' sx={{ mb: 2, color: '#1C1C1C' }}>게시물 작성</Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Card sx={{ p: 2, border: '1px solid #EDEFF1', mb: 2 }}>
              {/* 게시판 선택 */}
              <FormControl fullWidth size='small' sx={{ mb: 2 }}>
                <InputLabel>게시판 선택</InputLabel>
                <Select
                  value={boardId}
                  onChange={(e) => setBoardId(e.target.value)}
                  label='게시판 선택'
                  sx={{ borderRadius: 2 }}
                >
                  {boards.map((b) => (
                    <MenuItem key={b.id} value={b.id}>b/{b.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* 게시물 타입 */}
              <Tabs
                value={postType}
                onChange={(_, v) => setPostType(v)}
                sx={{ mb: 2, '& .MuiTab-root': { minHeight: 40 } }}
              >
                {POST_TYPES.map((pt) => (
                  <Tab
                    key={pt.value}
                    value={pt.value}
                    label={pt.label}
                    icon={pt.icon}
                    iconPosition='start'
                    sx={{ fontSize: '0.875rem', textTransform: 'none', fontWeight: 700 }}
                  />
                ))}
              </Tabs>

              {error && <Alert severity='error' sx={{ mb: 2 }}>{error}</Alert>}

              <Box component='form' onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <TextField
                  label='제목'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  size='small'
                  fullWidth
                  required
                  inputProps={{ maxLength: 300 }}
                  helperText={`${title.length}/300`}
                />

                {postType === 'text' && (
                  <TextField
                    label='내용 (선택)'
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    multiline
                    rows={6}
                    size='small'
                    fullWidth
                    placeholder='내용을 입력하세요...'
                  />
                )}

                {postType === 'image' && (
                  <TextField
                    label='이미지 URL'
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    size='small'
                    fullWidth
                    required
                    placeholder='https://example.com/image.jpg'
                  />
                )}

                {postType === 'link' && (
                  <TextField
                    label='링크 URL'
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    size='small'
                    fullWidth
                    required
                    placeholder='https://example.com'
                  />
                )}

                <TextField
                  label='플레어/태그 (선택)'
                  value={flair}
                  onChange={(e) => setFlair(e.target.value)}
                  size='small'
                  fullWidth
                  placeholder='예: 질문, 정보, 유머'
                  inputProps={{ maxLength: 20 }}
                />

                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button
                    variant='outlined'
                    onClick={() => navigate(-1)}
                    sx={{ borderRadius: '20px', fontWeight: 700 }}
                  >
                    취소
                  </Button>
                  <Button
                    type='submit'
                    variant='contained'
                    disabled={loading}
                    sx={{ borderRadius: '20px', fontWeight: 700 }}
                  >
                    {loading ? <CircularProgress size={20} color='inherit' /> : '게시물 올리기'}
                  </Button>
                </Box>
              </Box>
            </Card>
          </Box>

          {/* 작성 가이드 */}
          <Box sx={{ width: 260, display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ bgcolor: '#fff', border: '1px solid #EDEFF1', borderRadius: 1, p: 2 }}>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>게시물 작성 가이드</Typography>
              {['서로를 존중하세요', '규칙을 준수하세요', '스팸을 올리지 마세요', '허위 정보를 퍼뜨리지 마세요'].map((rule, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                  <Typography variant='body2' sx={{ color: '#878A8C' }}>{i + 1}.</Typography>
                  <Typography variant='body2' sx={{ color: '#878A8C' }}>{rule}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default SubmitPage;
