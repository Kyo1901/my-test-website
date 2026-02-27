import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FlagIcon from '@mui/icons-material/Flag';
import ReplyIcon from '@mui/icons-material/Reply';
import CommentReportModal from './CommentReportModal.jsx';

/**
 * 댓글 아이템 컴포넌트 (대댓글 + 신고 기능)
 *
 * Props:
 * @param {object} comment - 댓글 데이터 (id, content, created_at, sns_users, replies) [Required]
 * @param {number|null} currentUserId - 로그인한 사용자 ID [Optional]
 * @param {function} onReply - 답글 클릭 콜백 [Optional]
 * @param {boolean} isReply - 대댓글 여부 [Optional, 기본값: false]
 *
 * Example usage:
 * <CommentItem comment={comment} currentUserId={user?.id} onReply={handleReply} />
 */
const CommentItem = ({ comment, currentUserId, onReply, isReply = false }) => {
  const author = comment.sns_users || {};
  const [reportOpen, setReportOpen] = useState(false);

  const timeAgo = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${diff}초 전`;
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return `${Math.floor(diff / 86400)}일 전`;
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1.5, py: 1.2, borderBottom: '1px solid #f0f0f0', pl: isReply ? 5 : 0 }}>
        <Avatar
          src={author.profile_image}
          sx={{ width: isReply ? 28 : 36, height: isReply ? 28 : 36, bgcolor: '#FF8C42', flexShrink: 0 }}
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
          {/* 액션 버튼 */}
          { !isReply && (
            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
              { onReply && currentUserId && (
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.3, cursor: 'pointer' }}
                  onClick={() => onReply(comment)}
                >
                  <ReplyIcon sx={{ fontSize: 14, color: '#aaa' }} />
                  <Typography variant='caption' color='text.secondary'>답글</Typography>
                </Box>
              )}
              { currentUserId && currentUserId !== comment.user_id && (
                <IconButton size='small' sx={{ p: 0.3, ml: 1 }} onClick={() => setReportOpen(true)}>
                  <FlagIcon sx={{ fontSize: 14, color: '#ddd', '&:hover': { color: '#E53935' } }} />
                </IconButton>
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* 대댓글 */}
      { !isReply && comment.replies && comment.replies.map((reply) => (
        <CommentItem key={reply.id} comment={reply} currentUserId={currentUserId} isReply />
      ))}

      {/* 신고 모달 */}
      { reportOpen && currentUserId && (
        <CommentReportModal
          open={reportOpen}
          onClose={() => setReportOpen(false)}
          commentId={comment.id}
          reporterId={currentUserId}
        />
      )}
    </>
  );
};

export default CommentItem;
