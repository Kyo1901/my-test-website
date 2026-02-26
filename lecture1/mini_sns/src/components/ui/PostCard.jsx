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
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { supabase } from '../../utils/supabase.js';

/**
 * 피드 게시물 카드 컴포넌트
 *
 * Props:
 * @param {object} post - 게시물 데이터 (id, caption, image_url, likes_count, created_at, sns_users, sns_comments) [Required]
 * @param {function} onLikeUpdate - 좋아요 수 업데이트 콜백 [Optional]
 *
 * Example usage:
 * <PostCard post={post} onLikeUpdate={handleUpdate} />
 */
const PostCard = ({ post, onLikeUpdate }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);

  const author = post.sns_users || {};
  const avatarLetter = (author.display_name || 'U')[0];
  const timeAgo = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${diff}초 전`;
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return `${Math.floor(diff / 86400)}일 전`;
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    const newCount = liked ? likesCount - 1 : likesCount + 1;
    setLiked(!liked);
    setLikesCount(newCount);
    await supabase
      .from('sns_posts')
      .update({ likes_count: newCount })
      .eq('id', post.id);
    if (onLikeUpdate) onLikeUpdate(post.id, newCount);
  };

  const handleCardClick = () => {
    navigate(`/post/${post.id}`);
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
        <IconButton onClick={handleLike} sx={{ p: '6px' }}>
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
    </Card>
  );
};

export default PostCard;
