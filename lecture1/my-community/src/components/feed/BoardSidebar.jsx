import { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Button, Divider, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

/**
 * BoardSidebar 컴포넌트 - 왼쪽 게시판 목록 사이드바
 *
 * Props:
 * @param {string} activeBoardName - 현재 활성화된 게시판 이름 [Optional]
 *
 * Example usage:
 * <BoardSidebar activeBoardName='게임' />
 */
function BoardSidebar({ activeBoardName }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribedIds, setSubscribedIds] = useState([]);

  useEffect(() => {
    fetchBoards();
    if (user) fetchSubscribed();
  }, [user]);

  const fetchBoards = async () => {
    const { data } = await supabase
      .from('roundit_boards')
      .select('id, name, icon_img, member_cnt')
      .order('member_cnt', { ascending: false })
      .limit(10);
    setBoards(data ?? []);
    setLoading(false);
  };

  const fetchSubscribed = async () => {
    const { data } = await supabase
      .from('roundit_board_members')
      .select('board_id')
      .eq('user_id', user.id);
    setSubscribedIds((data ?? []).map((d) => d.board_id));
  };

  const handleSubscribe = async (boardId, e) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    if (subscribedIds.includes(boardId)) {
      await supabase.from('roundit_board_members').delete().match({ user_id: user.id, board_id: boardId });
      setSubscribedIds((prev) => prev.filter((id) => id !== boardId));
      await supabase.from('roundit_boards').update({ member_cnt: supabase.rpc('decrement', { x: 1 }) }).eq('id', boardId);
    } else {
      await supabase.from('roundit_board_members').insert({ user_id: user.id, board_id: boardId });
      setSubscribedIds((prev) => [...prev, boardId]);
    }
  };

  return (
    <Box sx={{ bgcolor: '#fff', border: '1px solid #EDEFF1', borderRadius: 1, overflow: 'hidden' }}>
      <Box sx={{ bgcolor: 'primary.main', px: 2, py: 1.5 }}>
        <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.875rem' }}>인기 게시판</Typography>
      </Box>
      <Box sx={{ py: 1 }}>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.75, gap: 1 }}>
              <Skeleton variant='circular' width={24} height={24} />
              <Skeleton width={120} height={16} />
            </Box>
          ))
          : boards.map((board) => (
            <Box
              key={board.id}
              onClick={() => navigate(`/b/${board.name}`)}
              sx={{
                display: 'flex', alignItems: 'center', px: 2, py: 0.75,
                cursor: 'pointer', gap: 1,
                bgcolor: activeBoardName === board.name ? '#F6F7F8' : 'transparent',
                '&:hover': { bgcolor: '#F6F7F8' },
              }}
            >
              <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main', fontSize: '0.75rem' }}>
                {board.name[0].toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: activeBoardName === board.name ? 700 : 400 }}>
                  b/{board.name}
                </Typography>
                <Typography variant='caption' sx={{ color: '#878A8C' }}>
                  {board.member_cnt?.toLocaleString()}명
                </Typography>
              </Box>
              <Button
                size='small'
                variant={subscribedIds.includes(board.id) ? 'outlined' : 'contained'}
                onClick={(e) => handleSubscribe(board.id, e)}
                sx={{ minWidth: 60, py: 0.25, fontSize: '0.75rem', borderRadius: '20px' }}
              >
                {subscribedIds.includes(board.id) ? '구독중' : '구독'}
              </Button>
            </Box>
          ))
        }
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Button
          variant='contained'
          fullWidth
          onClick={() => navigate('/b/create')}
          sx={{ borderRadius: '20px', fontWeight: 700 }}
        >
          게시판 만들기
        </Button>
      </Box>
    </Box>
  );
}

export default BoardSidebar;
