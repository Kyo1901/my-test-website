import { useState } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { supabase } from '../../utils/supabase.js';

/**
 * 스토리 전체화면 뷰어
 *
 * Props:
 * @param {object} userGroup - { user, stories[] } [Required]
 * @param {function} onClose - 닫기 콜백 [Required]
 * @param {number|null} currentUserId - 현재 로그인한 사용자 ID (조회 기록용) [Optional]
 * @param {boolean} isOwner - 현재 사용자가 스토리 작성자인지 여부 [Optional]
 * @param {function} onStoryDeleted - 스토리 삭제 완료 콜백 [Optional]
 *
 * Example usage:
 * <StoryViewer userGroup={group} onClose={handleClose} currentUserId={user?.id} isOwner={true} onStoryDeleted={handleDeleted} />
 */
const StoryViewer = ({ userGroup, onClose, currentUserId, isOwner, onStoryDeleted }) => {
  const [index, setIndex] = useState(0);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const stories = userGroup.stories;
  const story = stories[index];

  const handleDeleteStory = async (e) => {
    e.stopPropagation();
    await supabase.from('sns_stories').delete().eq('id', story.id);
    setConfirmVisible(false);
    if (onStoryDeleted) onStoryDeleted();
    onClose();
  };

  const handleView = async (storyId) => {
    if (!currentUserId) return;
    await supabase
      .from('sns_story_views')
      .upsert([{ story_id: storyId, viewer_id: currentUserId }], { onConflict: 'story_id,viewer_id' });
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    if (index > 0) setIndex(index - 1);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (confirmVisible) return;
    if (index < stories.length - 1) setIndex(index + 1);
    else onClose();
  };

  // 조회 기록
  if (story) {
    handleView(story.id);
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        bgcolor: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={handleNext}
    >
      {/* 진행 바 */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, p: 1.5, display: 'flex', gap: 0.5, zIndex: 10 }}>
        { stories.map((_, i) => (
          <LinearProgress
            key={i}
            variant='determinate'
            value={i < index ? 100 : i === index ? 50 : 0}
            sx={{
              flex: 1,
              height: 2,
              bgcolor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': { bgcolor: '#fff' },
            }}
          />
        ))}
      </Box>

      {/* 상단 사용자 정보 */}
      <Box
        sx={{
          position: 'absolute',
          top: 24,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2,
          zIndex: 10,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Avatar
          src={userGroup.user?.profile_image}
          sx={{ width: 36, height: 36, bgcolor: '#FF8C42', border: '2px solid #fff' }}
        >
          { (userGroup.user?.display_name || 'U')[0] }
        </Avatar>
        <Typography variant='body2' fontWeight={700} sx={{ color: '#fff', flex: 1 }}>
          { userGroup.user?.display_name }
        </Typography>
        { isOwner && (
          <IconButton
            onClick={(e) => { e.stopPropagation(); setConfirmVisible(true); }}
            sx={{ color: '#fff' }}
          >
            <DeleteOutlineIcon />
          </IconButton>
        )}
        <IconButton onClick={(e) => { e.stopPropagation(); onClose(); }} sx={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* 스토리 이미지 */}
      { story?.image_url && (
        <Box
          component='img'
          src={story.image_url}
          alt='story'
          sx={{ maxWidth: '100%', maxHeight: '100vh', objectFit: 'contain' }}
        />
      )}

      {/* 캡션 */}
      { story?.caption && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            left: 0,
            right: 0,
            px: 3,
            textAlign: 'center',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Typography variant='body1' sx={{ color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
            { story.caption }
          </Typography>
        </Box>
      )}

      {/* 좌우 이동 버튼 */}
      { index > 0 && (
        <IconButton
          onClick={handlePrev}
          sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: '#fff', zIndex: 10 }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
      )}
      { index < stories.length - 1 && (
        <IconButton
          onClick={handleNext}
          sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#fff', zIndex: 10 }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      )}

      {/* 삭제 확인 오버레이 (Portal 아닌 뷰어 내부에 직접 렌더링) */}
      { confirmVisible && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            bgcolor: 'rgba(0,0,0,0.75)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Typography variant='h6' sx={{ color: '#fff', fontWeight: 700 }}>
            스토리 삭제
          </Typography>
          <Typography variant='body2' sx={{ color: 'rgba(255,255,255,0.8)' }}>
            이 스토리를 삭제할까요?
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant='outlined'
              onClick={(e) => { e.stopPropagation(); setConfirmVisible(false); }}
              sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.6)', minWidth: 80 }}
            >
              취소
            </Button>
            <Button
              variant='contained'
              color='error'
              onClick={handleDeleteStory}
              sx={{ minWidth: 80 }}
            >
              삭제
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default StoryViewer;
