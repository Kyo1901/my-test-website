import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';
import PersonIcon from '@mui/icons-material/Person';
import supabase from '../utils/supabase-client.js';

/**
 * ProfilePage 컴포넌트
 *
 * Props: 없음 (URL 파라미터로 userId 사용)
 *
 * Example usage:
 * <ProfilePage />
 */
function ProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchUser();
    fetchPosts();
    fetchComments();
    fetchReviews();
  }, [userId]);

  const fetchUser = async () => {
    const { data } = await supabase
      .from('it_info_users')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (data) setUser(data);
  };

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('it_info_posts')
      .select('post_id, title, board_type, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (data) setPosts(data);
  };

  const fetchComments = async () => {
    const { data } = await supabase
      .from('it_info_comments')
      .select('comment_id, content, created_at, it_info_posts(post_id, title)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (data) setComments(data);
  };

  const fetchReviews = async () => {
    const { data } = await supabase
      .from('it_info_reviews')
      .select('review_id, rating, content, created_at, it_info_products(product_id, name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (data) setReviews(data);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ko-KR');
  };

  if (!user) {
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
        {/* 프로필 헤더 */}
        <Paper sx={{ p: { xs: 2, md: 4 }, mb: 3, textAlign: 'center' }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2,
              bgcolor: 'primary.main',
              fontSize: '2rem',
            }}
          >
            <PersonIcon sx={{ fontSize: '2.5rem' }} />
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            {user.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
            {user.email}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            가입일: {formatDate(user.created_at)}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {posts.length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                게시글
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {comments.length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                댓글
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {reviews.length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                리뷰
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* 활동 내역 탭 */}
        <Paper sx={{ p: { xs: 2, md: 3 } }}>
          <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 2 }}>
            <Tab label="작성 글" />
            <Tab label="댓글" />
            <Tab label="리뷰" />
          </Tabs>

          {/* 작성 글 */}
          {activeTab === 0 && (
            <List>
              {posts.length === 0 ? (
                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
                  작성한 글이 없습니다.
                </Typography>
              ) : (
                posts.map((post) => (
                  <ListItem key={post.post_id} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        if (post.board_type === '공지사항') {
                          navigate(`/notices/${post.post_id}`);
                        } else {
                          navigate(`/community/${post.post_id}`);
                        }
                      }}
                    >
                      <ListItemText
                        primary={post.title}
                        secondary={
                          <Box component="span" sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Chip label={post.board_type} size="small" variant="outlined" />
                            <Typography component="span" variant="caption">
                              {formatDate(post.created_at)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))
              )}
            </List>
          )}

          {/* 댓글 */}
          {activeTab === 1 && (
            <List>
              {comments.length === 0 ? (
                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
                  작성한 댓글이 없습니다.
                </Typography>
              ) : (
                comments.map((comment) => (
                  <ListItem key={comment.comment_id} disablePadding>
                    <ListItemButton
                      onClick={() => navigate(`/community/${comment.it_info_posts?.post_id}`)}
                    >
                      <ListItemText
                        primary={comment.content}
                        secondary={
                          <Box component="span">
                            <Typography component="span" variant="caption" sx={{ color: 'primary.main' }}>
                              {comment.it_info_posts?.title}
                            </Typography>
                            <Typography component="span" variant="caption" sx={{ ml: 1 }}>
                              {formatDate(comment.created_at)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))
              )}
            </List>
          )}

          {/* 리뷰 */}
          {activeTab === 2 && (
            <List>
              {reviews.length === 0 ? (
                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
                  작성한 리뷰가 없습니다.
                </Typography>
              ) : (
                reviews.map((review) => (
                  <ListItem key={review.review_id} disablePadding>
                    <ListItemButton
                      onClick={() => navigate(`/products/${review.it_info_products?.product_id}`)}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Rating value={Number(review.rating)} precision={0.1} size="small" readOnly />
                            <Typography variant="body2">
                              {review.it_info_products?.name}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box component="span">
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                display: 'block',
                              }}
                            >
                              {review.content}
                            </Typography>
                            <Typography component="span" variant="caption">
                              {formatDate(review.created_at)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))
              )}
            </List>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default ProfilePage;
