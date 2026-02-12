import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import supabase from '../utils/supabase-client.js';

/**
 * NoticeDetailPage 컴포넌트
 *
 * Props: 없음 (URL 파라미터로 postId 사용)
 *
 * Example usage:
 * <NoticeDetailPage />
 */
function NoticeDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    fetchNotice();
  }, [postId]);

  const fetchNotice = async () => {
    const { data } = await supabase
      .from('it_info_posts')
      .select('post_id, title, content, created_at, it_info_users(name)')
      .eq('post_id', postId)
      .single();
    if (data) setNotice(data);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!notice) {
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
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/notices')}
          sx={{ mb: 2 }}
        >
          목록으로
        </Button>

        <Paper sx={{ p: { xs: 2, md: 4 } }}>
          {/* 상단 메타 정보 */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.3rem', md: '1.5rem' } }}
            >
              {notice.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, color: 'text.secondary' }}>
              <Typography variant="body2">
                작성자: {notice.it_info_users?.name || '관리자'}
              </Typography>
              <Typography variant="body2">
                {formatDate(notice.created_at)}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* 본문 */}
          <Typography
            variant="body1"
            sx={{
              whiteSpace: 'pre-wrap',
              lineHeight: 1.8,
              minHeight: 200,
            }}
          >
            {notice.content}
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default NoticeDetailPage;
