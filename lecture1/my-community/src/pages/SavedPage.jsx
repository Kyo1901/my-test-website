import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Skeleton } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import PostCard from '../components/feed/PostCard';

function SavedPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchSavedPosts();
  }, [user]);

  const fetchSavedPosts = async () => {
    const { data } = await supabase
      .from('roundit_bookmarks')
      .select(`
        post_id,
        roundit_posts(
          *,
          roundit_users(id, username),
          roundit_boards(id, name)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setPosts((data ?? []).map((d) => d.roundit_posts).filter(Boolean));
    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: 2 }}>
      <Container maxWidth='md' sx={{ px: { xs: 1, md: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <BookmarkIcon sx={{ color: 'primary.main' }} />
          <Typography variant='h2' sx={{ color: '#1C1C1C' }}>저장된 게시물</Typography>
        </Box>

        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant='rectangular' height={100} sx={{ borderRadius: 1, mb: 1 }} />
          ))
        ) : posts.length === 0 ? (
          <Box sx={{ bgcolor: '#fff', border: '1px solid #EDEFF1', borderRadius: 1, p: 4, textAlign: 'center' }}>
            <Typography sx={{ color: '#878A8C', fontWeight: 700, mb: 1 }}>저장된 게시물이 없습니다</Typography>
            <Button variant='contained' onClick={() => navigate('/')} sx={{ borderRadius: '20px' }}>
              게시물 둘러보기
            </Button>
          </Box>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} isBookmarked={true} />
          ))
        )}
      </Container>
    </Box>
  );
}

export default SavedPage;
