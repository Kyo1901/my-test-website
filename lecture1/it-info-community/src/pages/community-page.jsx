import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import ImageIcon from '@mui/icons-material/Image';
import AddIcon from '@mui/icons-material/Add';
import ForumIcon from '@mui/icons-material/Forum';
import supabase from '../utils/supabase-client.js';

const boardTypes = ['전체', '자유게시판', '질문/답변', '전자기기 리뷰'];

/**
 * CommunityPage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <CommunityPage />
 */
function CommunityPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [posts, setPosts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    board_type: '자유게시판',
    user_id: 2,
  });

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  const fetchPosts = async () => {
    let query = supabase
      .from('it_info_posts')
      .select('post_id, title, content, board_type, likes, image_url, created_at, it_info_users(name), it_info_comments(comment_id)')
      .neq('board_type', '공지사항')
      .order('created_at', { ascending: false });

    if (activeTab > 0) {
      query = query.eq('board_type', boardTypes[activeTab]);
    }

    const { data } = await query;
    if (data) setPosts(data);
  };

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    await supabase
      .from('it_info_posts')
      .insert([{
        title: newPost.title,
        content: newPost.content,
        board_type: newPost.board_type,
        user_id: newPost.user_id,
      }]);

    setIsDialogOpen(false);
    setNewPost({ title: '', content: '', board_type: '자유게시판', user_id: 2 });
    fetchPosts();
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ko-KR');
  };

  return (
    <Box sx={{ width: '100%', py: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ForumIcon sx={{ color: 'primary.main', mr: 1, fontSize: '2rem' }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              커뮤니티
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsDialogOpen(true)}
          >
            글쓰기
          </Button>
        </Box>

        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          sx={{ mb: 3 }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {boardTypes.map((type) => (
            <Tab key={type} label={type} />
          ))}
        </Tabs>

        {posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              게시글이 없습니다. 첫 번째 글을 작성해보세요!
            </Typography>
          </Box>
        ) : (
          posts.map((post) => (
            <Card key={post.post_id} sx={{ mb: 2 }}>
              <CardActionArea onClick={() => navigate(`/community/${post.post_id}`)}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      label={post.board_type}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {post.it_info_users?.name} · {formatDate(post.created_at)}
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {post.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      mb: 1,
                    }}
                  >
                    {post.content}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ThumbUpIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {post.likes || 0}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CommentIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {post.it_info_comments?.length || 0}
                      </Typography>
                    </Box>
                    {post.image_url && (
                      <ImageIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    )}
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          ))
        )}

        {/* 글쓰기 다이얼로그 */}
        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>새 게시글 작성</DialogTitle>
          <DialogContent>
            <TextField
              select
              fullWidth
              label="게시판"
              value={newPost.board_type}
              onChange={(e) => setNewPost({ ...newPost, board_type: e.target.value })}
              sx={{ mt: 1, mb: 2 }}
            >
              <MenuItem value="자유게시판">자유게시판</MenuItem>
              <MenuItem value="질문/답변">질문/답변</MenuItem>
              <MenuItem value="전자기기 리뷰">전자기기 리뷰</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="제목"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="내용"
              multiline
              rows={6}
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>취소</Button>
            <Button variant="contained" onClick={handleCreatePost}>등록</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default CommunityPage;
