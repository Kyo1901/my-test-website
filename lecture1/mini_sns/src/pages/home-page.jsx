import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Skeleton from '@mui/material/Skeleton';
import Card from '@mui/material/Card';
import { supabase } from '../utils/supabase.js';
import { useSession } from '../context/SessionContext.jsx';
import PostCard from '../components/ui/PostCard.jsx';
import StoryRow from '../components/ui/StoryRow.jsx';
import BottomNav from '../components/common/BottomNav.jsx';

/**
 * 메인 피드 페이지 (홈)
 *
 * Props: 없음 (라우터로 접근)
 */
const HomePage = () => {
  const { user } = useSession();
  const [tab, setTab] = useState(0);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async (feedType) => {
    setLoading(true);

    if (feedType === 1 && user) {
      // 팔로잉 기반 피드
      const { data: follows } = await supabase
        .from('sns_follows')
        .select('following_id')
        .eq('follower_id', user.id);

      const followingIds = follows ? follows.map((f) => f.following_id) : [];

      if (followingIds.length === 0) {
        setPosts([]);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('sns_posts')
        .select('*, sns_users(id, username, display_name, profile_image), sns_comments(count)')
        .in('user_id', followingIds)
        .eq('is_deleted', 0)
        .order('created_at', { ascending: false })
        .limit(30);
      setPosts(data || []);
    } else {
      // 전체 피드
      const { data } = await supabase
        .from('sns_posts')
        .select('*, sns_users(id, username, display_name, profile_image), sns_comments(count)')
        .eq('is_deleted', 0)
        .order('created_at', { ascending: false })
        .limit(30);
      setPosts(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPosts(tab);
  }, [tab, user?.id]);

  const skeletonCards = [1, 2, 3].map((i) => (
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
  ));

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#FFFDF6', pb: 10 }}>
      {/* 상단 앱바 */}
      <AppBar position='sticky' elevation={0} sx={{ bgcolor: '#fff', borderBottom: '1px solid #f0e8e0' }}>
        <Toolbar sx={{ justifyContent: 'center', minHeight: 52 }}>
          <Typography variant='h6' fontWeight={700} color='primary'>
            🐾 PawLog
          </Typography>
        </Toolbar>
        {/* 피드 탭 */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          centered
          textColor='primary'
          indicatorColor='primary'
          sx={{ minHeight: 40, '& .MuiTab-root': { minHeight: 40, fontSize: '0.85rem' } }}
        >
          <Tab label='전체' />
          <Tab label='팔로잉' />
        </Tabs>
      </AppBar>

      <Container maxWidth='sm' sx={{ pt: 1.5, px: { xs: 1.5, sm: 2 } }}>
        {/* 스토리 영역 */}
        <StoryRow />

        {/* 피드 */}
        { loading ? skeletonCards
          : tab === 1 && posts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant='h1' sx={{ fontSize: '3rem' }}>🐾</Typography>
              <Typography variant='body1' color='text.secondary' sx={{ mt: 2 }}>
                팔로잉한 사람이 없거나<br />아직 게시물이 없어요.
              </Typography>
            </Box>
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
