import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ReplyIcon from '@mui/icons-material/Reply';
import supabase from '../utils/supabase-client.js';

/**
 * CommunityPostPage 컴포넌트
 *
 * Props: 없음 (URL 파라미터로 postId 사용)
 *
 * Example usage:
 * <CommunityPostPage />
 */
function CommunityPostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [postId]);

  const fetchPost = async () => {
    const { data } = await supabase
      .from('it_info_posts')
      .select('*, it_info_users(name)')
      .eq('post_id', postId)
      .single();
    if (data) setPost(data);
  };

  const fetchComments = async () => {
    const { data } = await supabase
      .from('it_info_comments')
      .select('*, it_info_users(name)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    if (data) setComments(data);
  };

  const handleLike = async () => {
    if (!post) return;
    const newLikes = isLiked ? post.likes - 1 : post.likes + 1;
    await supabase
      .from('it_info_posts')
      .update({ likes: newLikes })
      .eq('post_id', postId);
    setPost({ ...post, likes: newLikes });
    setIsLiked(!isLiked);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    await supabase
      .from('it_info_comments')
      .insert([{
        content: newComment,
        user_id: 2,
        post_id: Number(postId),
      }]);
    setNewComment('');
    fetchComments();
  };

  const handleAddReply = async (parentId) => {
    if (!replyContent.trim()) return;
    await supabase
      .from('it_info_comments')
      .insert([{
        content: replyContent,
        user_id: 2,
        post_id: Number(postId),
        parent_comment_id: parentId,
      }]);
    setReplyTo(null);
    setReplyContent('');
    fetchComments();
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  /** 댓글을 트리 구조로 변환 */
  const getTopComments = () => comments.filter((c) => !c.parent_comment_id);
  const getReplies = (commentId) => comments.filter((c) => c.parent_comment_id === commentId);

  if (!post) {
    return (
      <Box sx={{ width: '100%', py: 4 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            로딩 중...
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', py: { xs: 2, md: 4 } }}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/community')}
          sx={{ mb: 2 }}
        >
          목록으로
        </Button>

        {/* 게시글 */}
        <Paper sx={{ p: { xs: 2, md: 4 }, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Chip
              label={post.board_type}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mr: 1 }}
            />
          </Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.3rem', md: '1.5rem' } }}
          >
            {post.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, color: 'text.secondary', mb: 2 }}>
            <Typography variant="body2">
              {post.it_info_users?.name}
            </Typography>
            <Typography variant="body2">
              {formatDate(post.created_at)}
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Typography
            variant="body1"
            sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, minHeight: 100 }}
          >
            {post.content}
          </Typography>

          {post.image_url && (
            <Box
              component="img"
              src={post.image_url}
              alt="게시글 이미지"
              sx={{ mt: 2, maxWidth: '100%', borderRadius: 1 }}
            />
          )}

          <Divider sx={{ my: 2 }} />

          {/* 추천 버튼 */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant={isLiked ? 'contained' : 'outlined'}
              startIcon={isLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
              onClick={handleLike}
            >
              추천 {post.likes || 0}
            </Button>
          </Box>
        </Paper>

        {/* 댓글 섹션 */}
        <Paper sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            댓글 ({comments.length})
          </Typography>

          {/* 댓글 입력 */}
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="댓글을 입력하세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
            />
            <Button
              variant="contained"
              onClick={handleAddComment}
              sx={{ flexShrink: 0 }}
            >
              등록
            </Button>
          </Box>

          {/* 댓글 목록 */}
          {getTopComments().map((comment) => (
            <Box key={comment.comment_id} sx={{ mb: 2 }}>
              {/* 댓글 */}
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {comment.it_info_users?.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {formatDate(comment.created_at)}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {comment.content}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setReplyTo(replyTo === comment.comment_id ? null : comment.comment_id)}
                >
                  <ReplyIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>

              {/* 대댓글 입력 */}
              {replyTo === comment.comment_id && (
                <Box sx={{ display: 'flex', gap: 1, mt: 1, ml: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="답글을 입력하세요..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddReply(comment.comment_id);
                      }
                    }}
                  />
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleAddReply(comment.comment_id)}
                  >
                    등록
                  </Button>
                </Box>
              )}

              {/* 대댓글 목록 */}
              {getReplies(comment.comment_id).map((reply) => (
                <Box
                  key={reply.comment_id}
                  sx={{
                    ml: 4,
                    mt: 1,
                    p: 2,
                    bgcolor: 'secondary.light',
                    borderRadius: 1,
                    borderLeft: '3px solid',
                    borderLeftColor: 'primary.main',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {reply.it_info_users?.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {formatDate(reply.created_at)}
                    </Typography>
                  </Box>
                  <Typography variant="body2">{reply.content}</Typography>
                </Box>
              ))}
            </Box>
          ))}
        </Paper>
      </Container>
    </Box>
  );
}

export default CommunityPostPage;
