import { useState } from 'react';
import { Box, Typography, Avatar, IconButton, TextField, Button } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ReplyIcon from '@mui/icons-material/Reply';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { formatRelativeTime } from '../../utils/formatDate';

/**
 * CommentItem 컴포넌트 - 트리형 댓글/대댓글 아이템
 *
 * Props:
 * @param {object} comment - 댓글 데이터 [Required]
 * @param {number} depth - 대댓글 깊이 (들여쓰기용) [Optional, 기본값: 0]
 * @param {function} onReplyAdded - 대댓글 추가 후 콜백 [Optional]
 *
 * Example usage:
 * <CommentItem comment={commentData} depth={0} onReplyAdded={handleReply} />
 */
function CommentItem({ comment, depth = 0, onReplyAdded }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [voteScore, setVoteScore] = useState(comment.vote_score ?? 0);
  const [userVote, setUserVote] = useState(null);
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleVote = async (type) => {
    if (!user) { navigate('/login'); return; }
    const newType = userVote === type ? null : type;
    const delta = newType === 'up' ? 1 : newType === 'down' ? -1 : userVote === 'up' ? -1 : 1;
    setVoteScore((prev) => prev + delta);
    setUserVote(newType);
  };

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;
    setSubmitting(true);
    const { data, error } = await supabase
      .from('roundit_comments')
      .insert({
        content: replyContent.trim(),
        author_id: user.id,
        post_id: comment.post_id,
        parent_id: comment.id,
      })
      .select('*, roundit_users(id, username)')
      .single();
    if (!error) {
      setReplyContent('');
      setShowReply(false);
      onReplyAdded?.(data);
    }
    setSubmitting(false);
  };

  const voteColor = userVote === 'up' ? '#FF4500' : userVote === 'down' ? '#7193FF' : '#878A8C';

  return (
    <Box sx={{ ml: depth > 0 ? 3 : 0, borderLeft: depth > 0 ? '2px solid #EDEFF1' : 'none', pl: depth > 0 ? 1.5 : 0 }}>
      <Box sx={{ display: 'flex', gap: 1, py: 1 }}>
        {/* 아바타 */}
        <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main', fontSize: '0.75rem', flexShrink: 0 }}>
          {comment.roundit_users?.username?.[0]?.toUpperCase() ?? 'U'}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* 메타 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
            <Typography variant='caption' sx={{ fontWeight: 700, color: '#1C1C1C' }}>
              u/{comment.roundit_users?.username ?? '삭제된 계정'}
            </Typography>
            <Typography variant='caption' sx={{ color: '#878A8C' }}>
              {formatRelativeTime(comment.created_at)}
            </Typography>
          </Box>

          {/* 내용 */}
          <Typography variant='body2' sx={{ mb: 0.5, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {comment.content}
          </Typography>

          {/* 액션 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton size='small' onClick={() => handleVote('up')} sx={{ p: 0.25 }}>
              <ArrowUpwardIcon sx={{ fontSize: '0.875rem', color: userVote === 'up' ? '#FF4500' : '#878A8C' }} />
            </IconButton>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: voteColor, minWidth: 16, textAlign: 'center' }}>
              {voteScore}
            </Typography>
            <IconButton size='small' onClick={() => handleVote('down')} sx={{ p: 0.25 }}>
              <ArrowDownwardIcon sx={{ fontSize: '0.875rem', color: userVote === 'down' ? '#7193FF' : '#878A8C' }} />
            </IconButton>
            {depth < 5 && (
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 0.25, px: 0.75, py: 0.25, borderRadius: 1, cursor: 'pointer', '&:hover': { bgcolor: '#F6F7F8' } }}
                onClick={() => { if (!user) { navigate('/login'); return; } setShowReply((prev) => !prev); }}
              >
                <ReplyIcon sx={{ fontSize: '0.875rem', color: '#878A8C' }} />
                <Typography variant='caption' sx={{ color: '#878A8C', fontWeight: 700 }}>답글</Typography>
              </Box>
            )}
          </Box>

          {/* 대댓글 입력 */}
          {showReply && (
            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <TextField
                multiline
                rows={2}
                size='small'
                placeholder='답글 작성...'
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                fullWidth
              />
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button size='small' onClick={() => setShowReply(false)} sx={{ borderRadius: '20px' }}>
                  취소
                </Button>
                <Button
                  size='small'
                  variant='contained'
                  onClick={handleReplySubmit}
                  disabled={submitting || !replyContent.trim()}
                  sx={{ borderRadius: '20px' }}
                >
                  답글 달기
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* 재귀: 대댓글 렌더링 */}
      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} depth={depth + 1} onReplyAdded={onReplyAdded} />
      ))}
    </Box>
  );
}

export default CommentItem;
