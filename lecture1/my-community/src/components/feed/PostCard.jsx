import { useState } from 'react';
import { Box, Card, Typography, IconButton, Chip, Avatar, Tooltip } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { formatRelativeTime } from '../../utils/formatDate';

/**
 * PostCard 컴포넌트 - 게시물 목록에서 표시되는 카드
 *
 * Props:
 * @param {object} post - 게시물 데이터 [Required]
 * @param {boolean} isBookmarked - 북마크 여부 [Optional, 기본값: false]
 * @param {function} onVote - 투표 콜백 [Optional]
 * @param {function} onBookmark - 북마크 콜백 [Optional]
 *
 * Example usage:
 * <PostCard post={postData} isBookmarked={false} />
 */
function PostCard({ post, isBookmarked = false, onVote, onBookmark }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [voteScore, setVoteScore] = useState(post.vote_score ?? 0);
  const [userVote, setUserVote] = useState(null);
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const handleVote = async (type) => {
    if (!user) { navigate('/login'); return; }
    const newType = userVote === type ? null : type;
    const delta = newType === 'up' ? 1 : newType === 'down' ? -1 : userVote === 'up' ? -1 : 1;
    setVoteScore((prev) => prev + delta);
    setUserVote(newType);
    onVote?.({ postId: post.id, type: newType, delta });
  };

  const handleBookmark = async () => {
    if (!user) { navigate('/login'); return; }
    if (bookmarked) {
      await supabase.from('roundit_bookmarks').delete().match({ user_id: user.id, post_id: post.id });
    } else {
      await supabase.from('roundit_bookmarks').insert({ user_id: user.id, post_id: post.id });
    }
    setBookmarked((prev) => !prev);
    onBookmark?.({ postId: post.id, bookmarked: !bookmarked });
  };

  const voteColor = userVote === 'up' ? '#FF4500' : userVote === 'down' ? '#7193FF' : '#878A8C';

  return (
    <Card
      sx={{ mb: 1, cursor: 'pointer', display: 'flex', '&:hover': { border: '1px solid #818384' } }}
      onClick={() => navigate(`/post/${post.id}`)}
    >
      {/* 투표 사이드바 */}
      <Box
        sx={{
          width: 40, bgcolor: '#F8F9FA', display: 'flex', flexDirection: 'column',
          alignItems: 'center', py: 1, gap: 0.5, flexShrink: 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <IconButton size='small' onClick={() => handleVote('up')} sx={{ p: 0.5 }}>
          <ArrowUpwardIcon sx={{ fontSize: '1.1rem', color: userVote === 'up' ? '#FF4500' : '#878A8C' }} />
        </IconButton>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: voteColor }}>
          {voteScore >= 1000 ? `${(voteScore / 1000).toFixed(1)}k` : voteScore}
        </Typography>
        <IconButton size='small' onClick={() => handleVote('down')} sx={{ p: 0.5 }}>
          <ArrowDownwardIcon sx={{ fontSize: '1.1rem', color: userVote === 'down' ? '#7193FF' : '#878A8C' }} />
        </IconButton>
      </Box>

      {/* 게시물 내용 */}
      <Box sx={{ flex: 1, p: 1, minWidth: 0 }}>
        {/* 메타 정보 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap', mb: 0.5 }}>
          <Avatar
            sx={{ width: 18, height: 18, bgcolor: 'primary.main', fontSize: '0.625rem' }}
          >
            {post.roundit_boards?.name?.[0]?.toUpperCase() ?? 'B'}
          </Avatar>
          <Typography
            variant='caption'
            sx={{ fontWeight: 700, color: '#1C1C1C', '&:hover': { textDecoration: 'underline' } }}
            onClick={(e) => { e.stopPropagation(); navigate(`/b/${post.roundit_boards?.name}`); }}
          >
            b/{post.roundit_boards?.name ?? '알 수 없는 게시판'}
          </Typography>
          <Typography variant='caption' sx={{ color: '#878A8C' }}>•</Typography>
          <Typography variant='caption' sx={{ color: '#878A8C' }}>
            Posted by u/{post.roundit_users?.username ?? '삭제된 계정'} {formatRelativeTime(post.created_at)}
          </Typography>
          {post.flair && (
            <Chip label={post.flair} size='small' sx={{ height: 16, fontSize: '0.625rem', ml: 0.5 }} />
          )}
        </Box>

        {/* 제목 */}
        <Typography sx={{ fontWeight: 500, fontSize: '1.125rem', lineHeight: 1.4, mb: 0.5 }}>
          {post.title}
        </Typography>

        {/* 이미지 미리보기 */}
        {post.post_type === 'image' && post.image_url && (
          <Box
            component='img'
            src={post.image_url}
            alt={post.title}
            sx={{ maxHeight: 512, width: '100%', objectFit: 'contain', borderRadius: 1, mb: 0.5 }}
          />
        )}

        {/* 링크 미리보기 */}
        {post.post_type === 'link' && post.link_url && (
          <Typography
            variant='caption'
            sx={{ color: '#0079D3', '&:hover': { textDecoration: 'underline' } }}
            onClick={(e) => { e.stopPropagation(); window.open(post.link_url, '_blank'); }}
          >
            {post.link_url}
          </Typography>
        )}

        {/* 액션 버튼 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }} onClick={(e) => e.stopPropagation()}>
          <Tooltip title='댓글'>
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.5, borderRadius: 1, cursor: 'pointer', '&:hover': { bgcolor: '#F6F7F8' } }}
              onClick={() => navigate(`/post/${post.id}`)}
            >
              <ChatBubbleOutlineIcon sx={{ fontSize: '1rem', color: '#878A8C' }} />
              <Typography variant='caption' sx={{ fontWeight: 700, color: '#878A8C' }}>
                {post.comment_cnt} 댓글
              </Typography>
            </Box>
          </Tooltip>
          <Tooltip title='저장'>
            <IconButton size='small' onClick={handleBookmark}>
              {bookmarked
                ? <BookmarkIcon sx={{ fontSize: '1rem', color: 'primary.main' }} />
                : <BookmarkBorderIcon sx={{ fontSize: '1rem', color: '#878A8C' }} />
              }
            </IconButton>
          </Tooltip>
          <Tooltip title='공유'>
            <IconButton
              size='small'
              onClick={() => navigator.clipboard.writeText(window.location.origin + `/post/${post.id}`)}
            >
              <ShareIcon sx={{ fontSize: '1rem', color: '#878A8C' }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Card>
  );
}

export default PostCard;
