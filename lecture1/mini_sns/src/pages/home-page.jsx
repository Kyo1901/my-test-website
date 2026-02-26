import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import Card from '@mui/material/Card';
import { supabase } from '../utils/supabase.js';
import PostCard from '../components/ui/PostCard.jsx';
import BottomNav from '../components/common/BottomNav.jsx';

/**
 * 메인 피드 페이지 (홈)
 *
 * Props: 없음 (라우터로 접근)
 */
const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('sns_posts')
      .select('*, sns_users(id, username, display_name, profile_image)')
      .order('created_at', { ascending: false })
      .limit(30);
    setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#FFFDF6', pb: 10 }}>
      {/* 상단 앱바 */}
      <AppBar position='sticky' elevation={0} sx={{ bgcolor: '#fff', borderBottom: '1px solid #f0e8e0' }}>
        <Toolbar sx={{ justifyContent: 'center', minHeight: 52 }}>
          <Typography variant='h6' fontWeight={700} color='primary'>
            🐾 PawLog
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth='sm' sx={{ pt: 2, px: { xs: 1.5, sm: 2 } }}>
        { loading ? (
          [1, 2, 3].map((i) => (
            <Card key={i} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', p: 2, gap: 1.5 }}>
                <Skeleton variant='circular' width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant='text' width='40%' />
                  <Skeleton variant='text' width='25%' />
                </Box>
              </Box>
              <Skeleton variant='rectangular' sx={{ aspectRatio: '1/1' }} />
              <Box sx={{ p: 2 }}>
                <Skeleton variant='text' />
                <Skeleton variant='text' width='80%' />
              </Box>
            </Card>
          ))
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant='h1' sx={{ fontSize: '3rem' }}>🐾</Typography>
            <Typography variant='body1' color='text.secondary' sx={{ mt: 2 }}>
              아직 게시물이 없어요.<br />첫 번째 게시물을 올려보세요!
            </Typography>
          </Box>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </Container>

      <BottomNav />
    </Box>
  );
};

export default HomePage;
