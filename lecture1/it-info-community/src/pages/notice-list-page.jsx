import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import supabase from '../utils/supabase-client.js';

/**
 * NoticeListPage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <NoticeListPage />
 */
function NoticeListPage() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    const { data } = await supabase
      .from('it_info_posts')
      .select('post_id, title, created_at')
      .eq('board_type', '공지사항')
      .order('created_at', { ascending: false });
    if (data) setNotices(data);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ko-KR');
  };

  return (
    <Box sx={{ width: '100%', py: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <AnnouncementIcon sx={{ color: 'primary.main', mr: 1, fontSize: '2rem' }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            공지사항
          </Typography>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.light' }}>
                <TableCell
                  sx={{ fontWeight: 700, color: 'white', width: 80, textAlign: 'center' }}
                >
                  번호
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'white' }}>
                  제목
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 700, color: 'white', width: 120, textAlign: 'center' }}
                >
                  등록일
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      등록된 공지사항이 없습니다.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                notices.map((notice, index) => (
                  <TableRow
                    key={notice.post_id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/notices/${notice.post_id}`)}
                  >
                    <TableCell sx={{ textAlign: 'center' }}>
                      {notices.length - index}
                    </TableCell>
                    <TableCell>{notice.title}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {formatDate(notice.created_at)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
}

export default NoticeListPage;
