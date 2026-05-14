import { useState, useEffect } from 'react';
import {
  Box, Container, Grid, Typography, IconButton, Avatar, Button,
  TextField, Divider, Chip, Skeleton, CircularProgress,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { formatRelativeTime } from '../utils/formatDate';
import CommentItem from '../components/post/CommentItem';
import BoardSidebar from '../components/feed/BoardSidebar';

function buildCommentTree(comments) {
  const map = {};
  const roots = [];
  comments.forEach((c) => { map[c.id] = { ...c, replies: [] }; });
  comments.forEach((c) => {
    if (c.parent_id) map[c.parent_id]?.replies.push(map[c.id]);
    else roots.push(map[c.id]);
  });
  return roots;
}

function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voteScore, setVoteScore] = useState(0);
  const [userVote, setUserVote] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPost();
    fetchComments();
    if (user) checkUserInteractions();
  }, [postId, user]);

  const fetchPost = async () => {
    const { data } = await supabase
      .from('roundit_posts')
      .select('*, roundit_users(id, username, karma), roundit_boards(id, name)')
      .eq('id', postId)
      .single();
    if (data) { setPost(data); setVoteScore(data.vote_score); }
    setLoading(false);
  };

  const fetchComments = async () => {
    const { data } = await supabase
      .from('roundit_comments')
      .select('*, roundit_users(id, username)')
      .eq('post_id', postId)
      .order('vote_score', { ascending: false });
    setComments(buildCommentTree(data ?? []));
  };

  const checkUserInteractions = async () => {
    const { data: bm } = await supabase
      .from('roundit_bookmarks')
      .select('id')
      .match({ user_id: user.id, post_id: postId })
      .single();
    setBookmarked(!!bm);

    const { data: vote } = await supabase
      .from('roundit_votes')
      .select('vote_type')
      .match({ user_id: user.id, target_type: 'post', target_id: postId })
      .single();
    if (vote) setUserVote(vote.vote_type);
  };

  const handleVote = async (type) => {
    if (!user) { navigate('/login'); return; }
    const newType = userVote === type ? null : type;
    const delta = newType === 'up' ? 1 : newType === 'down' ? -1 : userVote === 'up' ? -1 : 1;
    setVoteScore((prev) => prev + delta);
    setUserVote(newType);
    if (newType) {
      await supabase.from('roundit_votes').upsert({ user_id: user.id, target_type: 'post', target_id: postId, vote_type: newType });
    } else {
      await supabase.from('roundit_votes').delete().match({ user_id: user.id, target_type: 'post', target_id: postId });
    }
    await supabase.from('roundit_posts').update({ vote_score: voteScore + delta }).eq('id', postId);
  };

  const handleBookmark = async () => {
    if (!user) { navigate('/login'); return; }
    if (bookmarked) {
      await supabase.from('roundit_bookmarks').delete().match({ user_id: user.id, post_id: postId });
    } else {
      await supabase.from('roundit_bookmarks').insert({ user_id: user.id, post_id: postId });
    }
    setBookmarked((prev) => !prev);
  };

  const handleCommentSubmit = async () => {
    if (!commentContent.trim()) return;
    setSubmitting(true);
    const { data, error } = await supabase
      .from('roundit_comments')
      .insert({ content: commentContent.trim(), author_id: user.id, post_id: postId })
      .select('*, roundit_users(id, username)')
      .single();
    if (!error) {
      setComments((prev) => [{ ...data, replies: [] }, ...prev]);
      setCommentContent('');
      await supabase.from('roundit_posts').update({ comment_cnt: (post?.comment_cnt ?? 0) + 1 }).eq('id', postId);
    }
    setSubmitting(false);
  };

  const voteColor = userVote === 'up' ? '#FF4500' : userVote === 'down' ? '#7193FF' : '#878A8C';

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: 2 }}>
        <Container maxWidth='lg'>
          <Skeleton variant='rectangular' height={400} sx={{ borderRadius: 1 }} />
        </Container>
      </Box>
    );
  }

  if (!post) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: 4, textAlign: 'center' }}>
        <Typography sx={{ color: '#878A8C' }}>게시물을 찾을 수 없습니다.</Typography>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>홈으로 돌아가기</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: 2 }}>
      <Container maxWidth='lg' sx={{ px: { xs: 1, md: 2 } }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 2.5 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <BoardSidebar activeBoardName={post.roundit_boards?.name} />
          </Grid>

          <Grid size={{ xs: 12, md: 6.5 }}>
            {/* 뒤로가기 */}
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ mb: 1, borderRadius: '20px', textTransform: 'none', color: '#878A8C' }}
            >
              뒤로가기
            </Button>

            {/* 게시물 */}
            <Box sx={{ bgcolor: '#fff', border: '1px solid #EDEFF1', borderRadius: 1, display: 'flex' }}>
              {/* 투표 사이드바 */}
              <Box sx={{ width: 40, bgcolor: '#F8F9FA', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2, gap: 0.5, flexShrink: 0 }}>
                <IconButton size='small' onClick={() => handleVote('up')} sx={{ p: 0.5 }}>
                  <ArrowUpwardIcon sx={{ fontSize: '1.25rem', color: userVote === 'up' ? '#FF4500' : '#878A8C' }} />
                </IconButton>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: voteColor }}>
                  {voteScore}
                </Typography>
                <IconButton size='small' onClick={() => handleVote('down')} sx={{ p: 0.5 }}>
                  <ArrowDownwardIcon sx={{ fontSize: '1.25rem', color: userVote === 'down' ? '#7193FF' : '#878A8C' }} />
                </IconButton>
              </Box>

              {/* 내용 */}
              <Box sx={{ flex: 1, p: 2, minWidth: 0 }}>
                {/* 메타 */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                  <Typography
                    variant='caption'
                    sx={{ fontWeight: 700, color: '#1C1C1C', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                    onClick={() => navigate(`/b/${post.roundit_boards?.name}`)}
                  >
                    b/{post.roundit_boards?.name}
                  </Typography>
                  <Typography variant='caption' sx={{ color: '#878A8C' }}>•</Typography>
                  <Typography variant='caption' sx={{ color: '#878A8C' }}>
                    u/{post.roundit_users?.username} · {formatRelativeTime(post.created_at)}
                  </Typography>
                  {post.flair && <Chip label={post.flair} size='small' sx={{ height: 18, fontSize: '0.625rem' }} />}
                </Box>

                {/* 제목 */}
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, mb: 1.5, lineHeight: 1.4 }}>
                  {post.title}
                </Typography>

                {/* 본문 */}
                {post.content && (
                  <Typography variant='body2' sx={{ mb: 2, whiteSpace: 'pre-wrap', lineHeight: 1.7, color: '#1C1C1C' }}>
                    {post.content}
                  </Typography>
                )}

                {/* 이미지 */}
                {post.post_type === 'image' && post.image_url && (
                  <Box component='img' src={post.image_url} alt={post.title} sx={{ maxWidth: '100%', borderRadius: 1, mb: 2 }} />
                )}

                {/* 링크 */}
                {post.post_type === 'link' && post.link_url && (
                  <Button
                    variant='outlined'
                    size='small'
                    href={post.link_url}
                    target='_blank'
                    rel='noopener noreferrer'
                    sx={{ mb: 2, borderRadius: '20px', textTransform: 'none' }}
                  >
                    링크 열기: {post.link_url}
                  </Button>
                )}

                {/* 액션 */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant='caption' sx={{ color: '#878A8C', fontWeight: 700 }}>
                    💬 {post.comment_cnt} 댓글
                  </Typography>
                  <IconButton size='small' onClick={handleBookmark}>
                    {bookmarked
                      ? <BookmarkIcon sx={{ fontSize: '1rem', color: 'primary.main' }} />
                      : <BookmarkBorderIcon sx={{ fontSize: '1rem', color: '#878A8C' }} />
                    }
                  </IconButton>
                  <IconButton size='small' onClick={() => navigator.clipboard.writeText(window.location.href)}>
                    <ShareIcon sx={{ fontSize: '1rem', color: '#878A8C' }} />
                  </IconButton>
                </Box>
              </Box>
            </Box>

            {/* 댓글 입력 */}
            <Box sx={{ bgcolor: '#fff', border: '1px solid #EDEFF1', borderRadius: 1, p: 2, mt: 1 }}>
              {user ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant='caption' sx={{ color: '#878A8C' }}>
                    u/{user.email}로 댓글 작성
                  </Typography>
                  <TextField
                    multiline
                    rows={3}
                    placeholder='댓글을 작성하세요...'
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    size='small'
                    fullWidth
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant='contained'
                      onClick={handleCommentSubmit}
                      disabled={submitting || !commentContent.trim()}
                      sx={{ borderRadius: '20px', fontWeight: 700 }}
                    >
                      {submitting ? <CircularProgress size={16} color='inherit' /> : '댓글 달기'}
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 1 }}>
                  <Typography variant='body2' sx={{ color: '#878A8C', mb: 1 }}>
                    댓글을 작성하려면 로그인이 필요합니다.
                  </Typography>
                  <Button variant='outlined' onClick={() => navigate('/login')} sx={{ borderRadius: '20px' }}>
                    로그인
                  </Button>
                </Box>
              )}
            </Box>

            {/* 댓글 목록 */}
            <Box sx={{ bgcolor: '#fff', border: '1px solid #EDEFF1', borderRadius: 1, p: 2, mt: 1 }}>
              <Typography sx={{ fontWeight: 700, mb: 2 }}>{post.comment_cnt}개의 댓글</Typography>
              <Divider sx={{ mb: 1 }} />
              {comments.length === 0 ? (
                <Typography variant='body2' sx={{ color: '#878A8C', textAlign: 'center', py: 2 }}>
                  아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
                </Typography>
              ) : (
                comments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} onReplyAdded={() => fetchComments()} />
                ))
              )}
            </Box>
          </Grid>

          {/* 오른쪽 사이드바 */}
          <Grid size={{ xs: 12, md: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            {post.roundit_boards && (
              <Box sx={{ bgcolor: '#fff', border: '1px solid #EDEFF1', borderRadius: 1, overflow: 'hidden' }}>
                <Box sx={{ bgcolor: 'primary.main', px: 2, py: 1.5 }}>
                  <Typography sx={{ color: '#fff', fontWeight: 700 }}>b/{post.roundit_boards.name}</Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  <Typography variant='body2' sx={{ color: '#878A8C', mb: 2 }}>
                    작성자: u/{post.roundit_users?.username} · 카르마 {post.roundit_users?.karma ?? 0}
                  </Typography>
                  <Button
                    variant='contained'
                    fullWidth
                    onClick={() => navigate(`/b/${post.roundit_boards.name}`)}
                    sx={{ borderRadius: '20px' }}
                  >
                    게시판 방문
                  </Button>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default PostDetailPage;
