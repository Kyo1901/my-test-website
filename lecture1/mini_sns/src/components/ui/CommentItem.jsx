import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * 댓글 아이템 컴포넌트
 *
 * Props:
 * @param {object} comment - 댓글 데이터 (id, content, created_at, sns_users) [Required]
 *
 * Example usage:
 * <CommentItem comment={comment} />
 */
const CommentItem = ({ comment }) => {
  const author = comment.sns_users || {};
  const timeAgo = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${diff}초 전`;
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return `${Math.floor(diff / 86400)}일 전`;
  };

  return (
    <Box sx={{ display: 'flex', gap: 1.5, py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
      <Avatar
        src={author.profile_image}
        sx={{ width: 36, height: 36, bgcolor: '#FF8C42', flexShrink: 0 }}
      >
        { (author.display_name || 'U')[0] }
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant='body2' fontWeight={700}>
            { author.display_name || '알 수 없음' }
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            { timeAgo(comment.created_at) }
          </Typography>
        </Box>
        <Typography variant='body2' color='text.primary' sx={{ mt: 0.3 }}>
          { comment.content }
        </Typography>
      </Box>
    </Box>
  );
};

export default CommentItem;
