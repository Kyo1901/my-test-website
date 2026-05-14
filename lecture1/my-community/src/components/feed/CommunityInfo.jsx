import { Box, Typography, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * CommunityInfo 컴포넌트 - 오른쪽 사이드바 커뮤니티 소개
 */
function CommunityInfo() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box sx={{ bgcolor: '#fff', border: '1px solid #EDEFF1', borderRadius: 1, overflow: 'hidden' }}>
      <Box sx={{ bgcolor: 'primary.main', px: 2, py: 3 }}>
        <Typography sx={{ color: '#fff', fontWeight: 700 }}>Roundit에 오신 것을 환영합니다!</Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        <Typography variant='body2' sx={{ mb: 1.5, color: '#1C1C1C' }}>
          Roundit은 주제별 자유 토론 커뮤니티입니다. 누구나 원하는 게시판을 만들고 참여할 수 있어요.
        </Typography>
        <Divider sx={{ mb: 1.5 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Button
            variant='contained'
            fullWidth
            onClick={() => navigate(user ? '/submit' : '/login')}
            sx={{ borderRadius: '20px', fontWeight: 700 }}
          >
            게시물 작성
          </Button>
          <Button
            variant='outlined'
            fullWidth
            onClick={() => navigate('/b/create')}
            sx={{ borderRadius: '20px', fontWeight: 700 }}
          >
            게시판 만들기
          </Button>
        </Box>
        <Divider sx={{ mt: 2, mb: 1 }} />
        <Typography variant='caption' sx={{ color: '#878A8C' }}>
          커뮤니티 규칙: 서로 존중하고, 스팸/도배 금지, 허위 정보 금지
        </Typography>
      </Box>
    </Box>
  );
}

export default CommunityInfo;
