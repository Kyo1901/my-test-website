import { useState, useEffect } from 'react';
import {
  Box, Container, Grid, Typography, Button, Avatar,
  Tabs, Tab, Skeleton, Chip,
} from '@mui/material';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import PostCard from '../components/feed/PostCard';
import BoardSidebar from '../components/feed/BoardSidebar';

const SORT_TABS = [
  { value: 'hot', label: '핫', icon: <WhatshotIcon sx={{ fontSize: '1rem' }} /> },
  { value: 'new', label: '새글', icon: <NewReleasesIcon sx={{ fontSize: '1rem' }} /> },
  { value: 'top', label: '탑', icon: <TrendingUpIcon sx={{ fontSize: '1rem' }} /> },
];

function BoardPage() {
  const { boardName } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [board, setBoard] = useState(null);
  const [posts, setPosts] = useState([]);
  const [sortTab, setSortTab] = useState('hot');
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    fetchBoard();
  }, [boardName]);

  useEffect(() => {
    if (board) fetchPosts(sortTab);
  }, [board, sortTab]);

  const fetchBoard = async () => {
    const { data } = await supabase
      .from('roundit_boards')
      .select('*, roundit_users(username)')
      .eq('name', boardName)
      .single();
    setBoard(data);
    if (user && data) checkSubscription(data.id);
    setLoading(false);
  };

  const fetchPosts = async (sort) => {
    if (!board) return;
    let query = supabase
      .from('roundit_posts')
      .select('*, roundit_users(id, username), roundit_boards(id, name)')
      .eq('board_id', board.id);

    if (sort === 'new') query = query.order('created_at', { ascending: false });
    else query = query.order('vote_score', { ascending: false });

    const { data } = await query.limit(20);
    setPosts(data ?? []);
  };

  const checkSubscription = async (boardId) => {
    const { data } = await supabase
      .from('roundit_board_members')
      .select('id')
      .match({ user_id: user.id, board_id: boardId })
      .single();
    setIsSubscribed(!!data);
  };

  const handleSubscribe = async () => {
    if (!user) { navigate('/login'); return; }
    setSubscribing(true);
    if (isSubscribed) {
      await supabase.from('roundit_board_members').delete().match({ user_id: user.id, board_id: board.id });
      setIsSubscribed(false);
    } else {
      await supabase.from('roundit_board_members').insert({ user_id: user.id, board_id: board.id });
      setIsSubscribed(true);
    }
    setSubscribing(false);
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Skeleton variant='rectangular' height={200} />
        <Container maxWidth='lg' sx={{ mt: 2 }}>
          <Skeleton height={400} />
        </Container>
      </Box>
    );
  }

  if (!board) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: 4, textAlign: 'center' }}>
        <Typography sx={{ color: '#878A8C' }}>게시판을 찾을 수 없습니다.</Typography>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>홈으로</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* 게시판 배너 */}
      <Box sx={{ bgcolor: 'primary.main', height: 80 }} />
      <Box sx={{ bgcolor: '#fff', borderBottom: '1px solid #EDEFF1', mb: 2 }}>
        <Container maxWidth='lg' sx={{ px: { xs: 1, md: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
            <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.dark', fontSize: '1.5rem', border: '4px solid #fff', mt: -3 }}>
              {board.name[0].toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.5rem' }}>{board.name}</Typography>
              <Typography variant='caption' sx={{ color: '#878A8C' }}>b/{board.name}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant='contained'
                onClick={() => navigate('/submit', { state: { boardId: board.id, boardName: board.name } })}
                sx={{ borderRadius: '20px', fontWeight: 700 }}
              >
                게시물 작성
              </Button>
              <Button
                variant={isSubscribed ? 'outlined' : 'contained'}
                onClick={handleSubscribe}
                disabled={subscribing}
                sx={{ borderRadius: '20px', fontWeight: 700 }}
              >
                {isSubscribed ? '구독중' : '구독'}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth='lg' sx={{ px: { xs: 1, md: 2 } }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 2.5 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <BoardSidebar activeBoardName={boardName} />
          </Grid>

          <Grid size={{ xs: 12, md: 6.5 }}>
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
                    sx={{ fontWeight: 700, fontSize: '0.875rem', textTransform: 'none' }}
                  />
                ))}
              </Tabs>
            </Box>

            {posts.length === 0 ? (
              <Box sx={{ bgcolor: '#fff', border: '1px solid #EDEFF1', borderRadius: 1, p: 4, textAlign: 'center' }}>
                <Typography sx={{ color: '#878A8C', fontWeight: 700 }}>아직 게시물이 없습니다</Typography>
                <Button
                  variant='contained'
                  onClick={() => navigate('/submit', { state: { boardId: board.id, boardName: board.name } })}
                  sx={{ mt: 2, borderRadius: '20px' }}
                >
                  첫 게시물 작성하기
                </Button>
              </Box>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ bgcolor: '#fff', border: '1px solid #EDEFF1', borderRadius: 1, overflow: 'hidden' }}>
              <Box sx={{ bgcolor: 'primary.main', px: 2, py: 1.5 }}>
                <Typography sx={{ color: '#fff', fontWeight: 700 }}>b/{board.name} 소개</Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <Typography variant='body2' sx={{ mb: 1.5 }}>
                  {board.description ?? '게시판 소개가 없습니다.'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>{board.member_cnt?.toLocaleString() ?? 0}</Typography>
                    <Typography variant='caption' sx={{ color: '#878A8C' }}>구독자</Typography>
                  </Box>
                </Box>
                <Typography variant='caption' sx={{ color: '#878A8C' }}>
                  개설자: u/{board.roundit_users?.username ?? '알 수 없음'}
                </Typography>
                <Chip
                  label={`개설일: ${new Date(board.created_at).toLocaleDateString('ko-KR')}`}
                  size='small'
                  sx={{ mt: 1, fontSize: '0.7rem' }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default BoardPage;
