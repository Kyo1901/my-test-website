import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import SearchIcon from '@mui/icons-material/Search';
import { supabase } from '../utils/supabase.js';
import BottomNav from '../components/common/BottomNav.jsx';

const POPULAR_TAGS = ['#골든리트리버', '#고양이', '#강아지일상', '#반려토끼', '#산책', '#펫스타그램', '#냥스타그램', '#집사생활'];

/**
 * 탐색 / 검색 페이지
 *
 * Props: 없음 (라우터로 접근)
 */
const SearchPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async (keyword = '') => {
    setLoading(true);
    const cleanKeyword = keyword.replace('#', '').trim();

    if (cleanKeyword) {
      // 해시태그 테이블 먼저 검색
      const { data: hashtagData } = await supabase
        .from('sns_hashtags')
        .select('id')
        .ilike('tag_name', `%${cleanKeyword}%`)
        .limit(10);

      if (hashtagData && hashtagData.length > 0) {
        const hashtagIds = hashtagData.map((h) => h.id);
        const { data: linkData } = await supabase
          .from('sns_post_hashtags')
          .select('post_id')
          .in('hashtag_id', hashtagIds);
        const postIds = [...new Set((linkData || []).map((l) => l.post_id))];

        if (postIds.length > 0) {
          const { data } = await supabase
            .from('sns_posts')
            .select('id, image_url, caption, likes_count')
            .in('id', postIds)
            .eq('is_deleted', 0)
            .order('likes_count', { ascending: false })
            .limit(30);
          setPosts(data || []);
          setLoading(false);
          return;
        }
      }

      // 해시태그 없으면 caption 텍스트 검색
      const { data } = await supabase
        .from('sns_posts')
        .select('id, image_url, caption, likes_count')
        .ilike('caption', `%${cleanKeyword}%`)
        .eq('is_deleted', 0)
        .order('likes_count', { ascending: false })
        .limit(30);
      setPosts(data || []);
    } else {
      const { data } = await supabase
        .from('sns_posts')
        .select('id, image_url, caption, likes_count')
        .eq('is_deleted', 0)
        .order('likes_count', { ascending: false })
        .limit(30);
      setPosts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = (keyword) => {
    setSearch(keyword);
    fetchPosts(keyword.replace('#', ''));
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#FFFDF6', pb: 10 }}>
      <AppBar position='sticky' elevation={0} sx={{ bgcolor: '#fff', borderBottom: '1px solid #f0e8e0' }}>
        <Toolbar sx={{ minHeight: 52, px: 2 }}>
          <TextField
            placeholder='해시태그, 반려동물 검색...'
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            size='small'
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon sx={{ color: '#aaa' }} />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 6, bgcolor: '#f5f5f5' } }}
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth='sm' sx={{ pt: 2, px: { xs: 1.5, sm: 2 } }}>
        {/* 인기 태그 */}
        { !search && (
          <Box sx={{ mb: 2 }}>
            <Typography variant='subtitle2' fontWeight={700} sx={{ mb: 1 }}>
              인기 태그
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
              { POPULAR_TAGS.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size='small'
                  onClick={() => handleSearch(tag)}
                  sx={{
                    bgcolor: '#FFF0E4',
                    color: '#E06A1E',
                    fontWeight: 600,
                    '&:hover': { bgcolor: '#FFD6B3' },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* 게시물 격자 */}
        { loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress color='primary' />
          </Box>
        ) : (
          <Grid container spacing={0.5}>
            { posts.map((post) => (
              <Grid key={post.id} size={{ xs: 4 }}>
                <Box
                  onClick={() => navigate(`/post/${post.id}`)}
                  sx={{
                    aspectRatio: '1/1',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    bgcolor: '#eee',
                    position: 'relative',
                  }}
                >
                  { post.image_url ? (
                    <Box
                      component='img'
                      src={post.image_url}
                      alt='post'
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: '#f5f0eb',
                      }}
                    >
                      <Typography fontSize='1.5rem'>🐾</Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        { !loading && posts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant='body1' color='text.secondary'>
              검색 결과가 없어요 🐾
            </Typography>
          </Box>
        )}
      </Container>

      <BottomNav />
    </Box>
  );
};

export default SearchPage;
