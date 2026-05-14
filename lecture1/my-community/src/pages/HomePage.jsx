import { useState, useEffect } from 'react';
import { Box, Container, Grid, Tab, Tabs, Typography, Skeleton } from '@mui/material';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PostCard from '../components/feed/PostCard';
import BoardSidebar from '../components/feed/BoardSidebar';
import CommunityInfo from '../components/feed/CommunityInfo';
import { supabase } from '../lib/supabase';

const SORT_TABS = [
  { value: 'hot', label: '핫', icon: <WhatshotIcon sx={{ fontSize: '1rem' }} /> },
  { value: 'new', label: '새글', icon: <NewReleasesIcon sx={{ fontSize: '1rem' }} /> },
  { value: 'top', label: '탑', icon: <TrendingUpIcon sx={{ fontSize: '1rem' }} /> },
];

function HomePage() {
  const [sortTab, setSortTab] = useState('hot');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  useEffect(() => {
    fetchPosts(sortTab);
  }, [sortTab]);

  const fetchPosts = async (sort) => {
    setLoading(true);
    let query = supabase
      .from('roundit_posts')
      .select(`
        *,
        roundit_users(id, username, profile_img),
        roundit_boards(id, name, icon_img)
      `);

    if (sort === 'hot') query = query.order('vote_score', { ascending: false });
    else if (sort === 'new') query = query.order('created_at', { ascending: false });
    else if (sort === 'top') query = query.order('vote_score', { ascending: false });

    const { data } = await query.limit(20);
    setPosts(data ?? []);
    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: 2 }}>
      <Container maxWidth='lg' sx={{ px: { xs: 1, md: 2 } }}>
        <Grid container spacing={2}>
          {/* 왼쪽 사이드바 */}
          <Grid size={{ xs: 12, md: 2.5 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <BoardSidebar />
          </Grid>

          {/* 중앙 피드 */}
          <Grid size={{ xs: 12, md: 6.5 }}>
            {/* 정렬 탭 */}
            <Box sx={{ bgcolor: '#fff', border: '1px solid #EDEFF1', borderRadius: 1, mb: 1 }}>
              <Tabs
                value={sortTab}
                onChange={(_, v) => setSortTab(v)}
                sx={{ minHeight: 40, '& .MuiTab-root': { minHeight: 40, py: 0.5 } }}
              >
                {SORT_TABS.map((tab) => (
                  <Tab
                    key={tab.value}
                    value={tab.value}
                    label={tab.label}
                    icon={tab.icon}
                    iconPosition='start'
                    sx={{ fontWeight: 700, fontSize: '0.875rem', textTransform: 'none', gap: 0.5 }}
                  />
                ))}
              </Tabs>
            </Box>

            {/* 게시물 목록 */}
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                <Box key={i} sx={{ bgcolor: '#fff', border: '1px solid #EDEFF1', borderRadius: 1, p: 1, mb: 1, display: 'flex', gap: 1 }}>
                  <Skeleton variant='rectangular' width={40} height={80} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton width='60%' height={12} sx={{ mb: 0.5 }} />
                    <Skeleton width='90%' height={20} sx={{ mb: 0.5 }} />
                    <Skeleton width='40%' height={12} />
                  </Box>
                </Box>
              ))
              : posts.length === 0
                ? (
                  <Box sx={{ bgcolor: '#fff', border: '1px solid #EDEFF1', borderRadius: 1, p: 4, textAlign: 'center' }}>
                    <Typography sx={{ color: '#878A8C', fontWeight: 700 }}>아직 게시물이 없습니다</Typography>
                    <Typography variant='caption' sx={{ color: '#878A8C' }}>첫 번째 게시물을 작성해보세요!</Typography>
                  </Box>
                )
                : posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    isBookmarked={bookmarkedIds.includes(post.id)}
                  />
                ))
            }
          </Grid>

          {/* 오른쪽 사이드바 */}
          <Grid size={{ xs: 12, md: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <CommunityInfo />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default HomePage;
