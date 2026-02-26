import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import { supabase } from '../utils/supabase.js';
import CommentItem from '../components/ui/CommentItem.jsx';
import useSession from '../hooks/useSession.js';

/**
 * 게시물 상세 페이지
 *
 * Props: 없음 (useParams로 id 수신)
 */
const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSession();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: postData } = await supabase
        .from('sns_posts')
        .select('*, sns_users(id, username, display_name, profile_image)')
        .eq('id', id)
        .single();
      setPost(postData);

      const { data: commentData } = await supabase
        .from('sns_comments')
        .select('*, sns_users(id, username, display_name, profile_image)')
        .eq('post_id', id)
        .order('created_at', { ascending: true });
      setComments(commentData || []);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleLike = async () => {
    if (!post) return;
    const newCount = liked ? post.likes_count - 1 : post.likes_count + 1;
    setLiked(!liked);
    setPost({ ...post, likes_count: newCount });
    await supabase.from('sns_posts').update({ likes_count: newCount }).eq('id', post.id);
  };

  const handleComment = async () => {
    if (!newComment.trim() || !user) return;
    setSubmitting(true);
    const { data } = await supabase
      .from('sns_comments')
      .insert([{ content: newComment.trim(), user_id: user.id, post_id: Number(id) }])
      .select('*, sns_users(id, username, display_name, profile_image)')
      .single();
    if (data) setComments([...comments, data]);
    setNewComment('');
    setSubmitting(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress color='primary' />
      </Box>
    );
  }

  if (!post) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography>게시물을 찾을 수 없습니다.</Typography>
      </Box>
    );
  }

  const author = post.sns_users || {};

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#FFFDF6', pb: 10 }}>
      <AppBar position='sticky' elevation={0} sx={{ bgcolor: '#fff', borderBottom: '1px solid #f0e8e0' }}>
        <Toolbar sx={{ minHeight: 52 }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant='h6' fontWeight={700} sx={{ flex: 1, textAlign: 'center' }}>
            게시물
          </Typography>
          <Box sx={{ width: 40 }} />
        </Toolbar>
      </AppBar>

      <Container maxWidth='sm' sx={{ px: { xs: 0, sm: 2 } }}>
        {/* 작성자 정보 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5 }}>
          <Avatar src={author.profile_image} sx={{ bgcolor: '#FF8C42', width: 42, height: 42 }}>
            { (author.display_name || 'U')[0] }
          </Avatar>
          <Box>
            <Typography variant='subtitle2' fontWeight={700}>{ author.display_name }</Typography>
            <Typography variant='caption' color='text.secondary'>@{ author.username }</Typography>
          </Box>
        </Box>

        {/* 이미지 */}
        { post.image_url && (
          <Box
            component='img'
            src={post.image_url}
            alt='게시물'
            sx={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }}
          />
        )}

        {/* 액션 버튼 */}
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pt: 1 }}>
          <IconButton onClick={handleLike} sx={{ p: '6px' }}>
            { liked
              ? <FavoriteIcon sx={{ color: '#E53935', fontSize: 28 }} />
              : <FavoriteBorderIcon sx={{ fontSize: 28 }} />
            }
          </IconButton>
          <Typography variant='body2' fontWeight={600} sx={{ mr: 2 }}>
            { post.likes_count }
          </Typography>
        </Box>

        {/* 캡션 */}
        { post.caption && (
          <Box sx={{ px: 2, pb: 2 }}>
            <Typography component='span' variant='body2' fontWeight={700} sx={{ mr: 1 }}>
              { author.display_name }
            </Typography>
            <Typography component='span' variant='body2'>
              { post.caption }
            </Typography>
          </Box>
        )}

        <Divider />

        {/* 댓글 목록 */}
        <Box sx={{ px: 2 }}>
          <Typography variant='subtitle2' fontWeight={700} sx={{ py: 1.5 }}>
            댓글 { comments.length }개
          </Typography>
          { comments.map((c) => (
            <CommentItem key={c.id} comment={c} />
          ))}
        </Box>
      </Container>

      {/* 댓글 입력 (하단 고정) */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: '#fff',
          borderTop: '1px solid #f0e8e0',
          px: 2,
          py: 1,
          display: 'flex',
          gap: 1,
          alignItems: 'center',
        }}
      >
        <TextField
          placeholder={ user ? '댓글 달기...' : '로그인 후 댓글을 달 수 있어요' }
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!user}
          size='small'
          fullWidth
          onKeyDown={(e) => e.key === 'Enter' && handleComment()}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 6 } }}
        />
        <IconButton
          onClick={handleComment}
          disabled={!user || !newComment.trim() || submitting}
          sx={{ color: '#FF8C42' }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default PostDetailPage;
