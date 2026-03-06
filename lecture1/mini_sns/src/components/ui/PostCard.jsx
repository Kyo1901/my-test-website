import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useSession } from '../../context/SessionContext.jsx';
import useLike from '../../hooks/useLike.js';
import { supabase } from '../../utils/supabase.js';
import { removePostHashtags } from '../../utils/hashtag.js';

/**
 * 피드 게시물 카드 컴포넌트
 *
 * Props:
 * @param {object} post - 게시물 데이터 (id, caption, image_url, likes_count, created_at, sns_users, sns_comments) [Required]
 * @param {function} onDeleted - 삭제 완료 콜백 (post.id 전달) [Optional]
 *
 * Example usage:
 * <PostCard post={post} onDeleted={handleDeleted} />
 */
const PostCard = ({ post, onDeleted }) => {
  const navigate = useNavigate();
  const { user } = useSession();
  const { liked, likesCount, toggleLike } = useLike(post.id, post.likes_count, user?.id);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isMyPost = Number(user?.id) === Number(post.user_id);

  const author = post.sns_users || {};
  const avatarLetter = (author.display_name || 'U')[0];
  const timeAgo = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${diff}초 전`;
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return `${Math.floor(diff / 86400)}일 전`;
  };

  const handleCardClick = () => {
    navigate(`/post/${post.id}`);
  };

  const handleDelete = async () => {
    await removePostHashtags(post.id);
    await supabase.from('sns_posts').update({ is_deleted: 1 }).eq('id', post.id);
    setDeleteDialogOpen(false);
    if (onDeleted) onDeleted(post.id);
  };

  return (
    <Card sx={{ mb: 2, cursor: 'pointer' }} onClick={handleCardClick}>
      <CardHeader
        avatar={
          <Avatar
            src={author.profile_image}
            sx={{ bgcolor: '#FF8C42', width: 40, height: 40 }}
            onClick={(e) => { e.stopPropagation(); navigate(`/profile/${author.id}`); }}
          >
            {avatarLetter}
          </Avatar>
        }
        title={
          <Typography variant='subtitle2' fontWeight={700}>
            { author.display_name || '알 수 없음' }
          </Typography>
        }
        subheader={
          <Typography variant='caption' color='text.secondary'>
            @{ author.username } · { timeAgo(post.created_at) }
          </Typography>
        }
        action={ isMyPost && (
          <>
            <IconButton
              onClick={(e) => { e.stopPropagation(); setMenuAnchor(e.currentTarget); }}
              sx={{ mt: 0.5 }}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
              onClick={(e) => e.stopPropagation()}
            >
              <MenuItem
                onClick={() => { setDeleteDialogOpen(true); setMenuAnchor(null); }}
                sx={{ color: '#E53935' }}
              >
                삭제
              </MenuItem>
            </Menu>
          </>
        )}
        sx={{ pb: 1 }}
      />

      { post.image_url && (
        <CardMedia
          component='img'
          image={post.image_url}
          alt='게시물 이미지'
          sx={{ aspectRatio: '1 / 1', objectFit: 'cover' }}
        />
      )}

      <CardActions sx={{ px: 2, pt: 1, pb: 0 }}>
        <IconButton onClick={toggleLike} sx={{ p: '6px' }} disabled={!user}>
          { liked
            ? <FavoriteIcon sx={{ color: '#E53935', fontSize: 26 }} />
            : <FavoriteBorderIcon sx={{ color: '#555', fontSize: 26 }} />
          }
        </IconButton>
        <Typography variant='body2' fontWeight={600} sx={{ mr: 2 }}>
          { likesCount }
        </Typography>
        <IconButton sx={{ p: '6px' }}>
          <ChatBubbleOutlineIcon sx={{ color: '#555', fontSize: 24 }} />
        </IconButton>
        <Typography variant='body2' fontWeight={600}>
          { post.sns_comments?.[0]?.count ?? 0 }
        </Typography>
      </CardActions>

      { post.caption && (
        <CardContent sx={{ pt: 1, pb: '12px !important' }}>
          <Box>
            <Typography component='span' variant='body2' fontWeight={700} sx={{ mr: 1 }}>
              { author.display_name }
            </Typography>
            <Typography component='span' variant='body2' color='text.primary'>
              { post.caption.length > 80 ? post.caption.slice(0, 80) + '...' : post.caption }
            </Typography>
          </Box>
        </CardContent>
      )}

      {/* 게시글 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onClick={(e) => e.stopPropagation()}>
        <DialogTitle>게시글 삭제</DialogTitle>
        <DialogContent>
          <Typography>이 게시글을 삭제할까요? 삭제 후에는 복구가 어렵습니다.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>취소</Button>
          <Button onClick={handleDelete} sx={{ color: '#E53935' }}>삭제</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default PostCard;
