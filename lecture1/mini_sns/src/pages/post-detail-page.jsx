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
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { supabase } from '../utils/supabase.js';
import CommentItem from '../components/ui/CommentItem.jsx';
import { useSession } from '../context/SessionContext.jsx';
import useLike from '../hooks/useLike.js';
import { removePostHashtags } from '../utils/hashtag.js';

/**
 * 게시물 상세 페이지 (수정/삭제 + 대댓글 포함)
 *
 * Props: 없음 (useParams로 id 수신)
 */
const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSession();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editCaption, setEditCaption] = useState('');

  const { liked, likesCount, toggleLike } = useLike(
    post?.id,
    post?.likes_count,
    user?.id
  );

  useEffect(() => {
    const fetchData = async () => {
      const { data: postData } = await supabase
        .from('sns_posts')
        .select('*, sns_users(id, username, display_name, profile_image)')
        .eq('id', id)
        .eq('is_deleted', 0)
        .single();
      setPost(postData);

      // 최상위 댓글 + 대댓글 함께 로드
      const { data: allComments } = await supabase
        .from('sns_comments')
        .select('*, sns_users(id, username, display_name, profile_image)')
        .eq('post_id', id)
        .order('created_at', { ascending: true });

      const commentData = allComments || [];
      const topLevel = commentData.filter((c) => !c.parent_comment_id);
      const replies = commentData.filter((c) => c.parent_comment_id);
      const withReplies = topLevel.map((c) => ({
        ...c,
        replies: replies.filter((r) => r.parent_comment_id === c.id),
      }));
      setComments(withReplies);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleComment = async () => {
    if (!newComment.trim() || !user) return;
    setSubmitting(true);
    const { data } = await supabase
      .from('sns_comments')
      .insert([{
        content: newComment.trim(),
        user_id: user.id,
        post_id: Number(id),
        parent_comment_id: replyTo?.id || null,
      }])
      .select('*, sns_users(id, username, display_name, profile_image)')
      .single();

    if (data) {
      if (replyTo) {
        // 대댓글: 해당 댓글의 replies에 추가
        setComments((prev) =>
          prev.map((c) =>
            c.id === replyTo.id
              ? { ...c, replies: [...(c.replies || []), data] }
              : c
          )
        );
      } else {
        setComments((prev) => [...prev, { ...data, replies: [] }]);
      }
    }
    setNewComment('');
    setReplyTo(null);
    setSubmitting(false);
  };

  const handleDelete = async () => {
    await removePostHashtags(post.id);
    await supabase
      .from('sns_posts')
      .update({ is_deleted: 1 })
      .eq('id', post.id);
    navigate('/');
  };

  const handleEditSave = async () => {
    await supabase
      .from('sns_posts')
      .update({ caption: editCaption.trim(), updated_at: new Date().toISOString() })
      .eq('id', post.id);
    setPost((prev) => ({ ...prev, caption: editCaption.trim() }));
    setEditMode(false);
  };

  const isMyPost = post && user && post.user_id === user.id;

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
          { isMyPost && (
            <>
              <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={() => setMenuAnchor(null)}
              >
                <MenuItem onClick={() => { setEditMode(true); setEditCaption(post.caption || ''); setMenuAnchor(null); }}>
                  수정
                </MenuItem>
                <MenuItem onClick={() => { setDeleteDialogOpen(true); setMenuAnchor(null); }} sx={{ color: '#E53935' }}>
                  삭제
                </MenuItem>
              </Menu>
            </>
          )}
          { !isMyPost && <Box sx={{ width: 40 }} /> }
        </Toolbar>
      </AppBar>

      <Container maxWidth='sm' sx={{ px: { xs: 0, sm: 2 } }}>
        {/* 작성자 정보 */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5, cursor: 'pointer' }}
          onClick={() => navigate(`/profile/${author.id}`)}
        >
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
          <IconButton onClick={toggleLike} sx={{ p: '6px' }} disabled={!user}>
            { liked
              ? <FavoriteIcon sx={{ color: '#E53935', fontSize: 28 }} />
              : <FavoriteBorderIcon sx={{ fontSize: 28 }} />
            }
          </IconButton>
          <Typography variant='body2' fontWeight={600} sx={{ mr: 2 }}>
            { likesCount }
          </Typography>
        </Box>

        {/* 캡션 */}
        { editMode ? (
          <Box sx={{ px: 2, pb: 2 }}>
            <TextField
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
              multiline
              rows={3}
              fullWidth
              size='small'
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button size='small' onClick={() => setEditMode(false)}>취소</Button>
              <Button size='small' variant='contained' onClick={handleEditSave}>저장</Button>
            </Box>
          </Box>
        ) : post.caption && (
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
            <CommentItem
              key={c.id}
              comment={c}
              currentUserId={user?.id}
              onReply={(comment) => {
                setReplyTo(comment);
                setNewComment('');
              }}
            />
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
          flexDirection: 'column',
          gap: 0.5,
        }}
      >
        { replyTo && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant='caption' color='text.secondary'>
              @{ replyTo.sns_users?.display_name }에게 답글
            </Typography>
            <Typography
              variant='caption'
              sx={{ color: '#FF8C42', cursor: 'pointer' }}
              onClick={() => setReplyTo(null)}
            >
              취소
            </Typography>
          </Box>
        )}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            placeholder={ user ? (replyTo ? '답글 달기...' : '댓글 달기...') : '로그인 후 댓글을 달 수 있어요' }
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

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>게시물 삭제</DialogTitle>
        <DialogContent>
          <Typography>이 게시물을 삭제할까요? 삭제 후에는 복구가 어렵습니다.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>취소</Button>
          <Button onClick={handleDelete} sx={{ color: '#E53935' }}>삭제</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostDetailPage;
