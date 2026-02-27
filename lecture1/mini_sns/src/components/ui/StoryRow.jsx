import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import { supabase } from '../../utils/supabase.js';
import { useSession } from '../../context/SessionContext.jsx';
import StoryViewer from './StoryViewer.jsx';
import StoryCreateModal from './StoryCreateModal.jsx';

/**
 * 홈 상단 스토리 가로 스크롤 영역
 *
 * Props: 없음
 *
 * Example usage:
 * <StoryRow />
 */
const StoryRow = () => {
  const { user } = useSession();
  const [stories, setStories] = useState([]);
  const [viewingUser, setViewingUser] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchStories = async () => {
    const now = new Date().toISOString();
    const { data } = await supabase
      .from('sns_stories')
      .select('*, sns_users(id, username, display_name, profile_image)')
      .gt('expires_at', now)
      .order('created_at', { ascending: false });

    if (!data) return;

    // 사용자별로 그룹화 (최신 스토리 1개만 대표)
    const grouped = {};
    data.forEach((s) => {
      const uid = s.user_id;
      if (!grouped[uid]) {
        grouped[uid] = { user: s.sns_users, stories: [] };
      }
      grouped[uid].stories.push(s);
    });
    setStories(Object.values(grouped));
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleStoryCreated = () => {
    setIsCreateOpen(false);
    fetchStories();
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          py: 1.5,
          mb: 1,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {/* 내 스토리 추가 버튼 */}
        { user && (
          <Box
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, cursor: 'pointer' }}
            onClick={() => setIsCreateOpen(true)}
          >
            <Box sx={{ position: 'relative', mb: 0.5 }}>
              <Avatar
                src={user.profile_image}
                sx={{ width: 60, height: 60, bgcolor: '#FF8C42', border: '2px solid #f0e8e0' }}
              >
                { (user.display_name || 'U')[0] }
              </Avatar>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 20,
                  height: 20,
                  bgcolor: '#FF8C42',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #fff',
                }}
              >
                <AddIcon sx={{ fontSize: 14, color: '#fff' }} />
              </Box>
            </Box>
            <Typography variant='caption' sx={{ fontSize: '0.7rem', color: '#555', maxWidth: 64, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              내 스토리
            </Typography>
          </Box>
        )}

        {/* 다른 사용자 스토리 */}
        { stories.map((group) => (
          <Box
            key={group.user?.id}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, cursor: 'pointer' }}
            onClick={() => setViewingUser(group)}
          >
            <Avatar
              src={group.user?.profile_image}
              sx={{
                width: 60,
                height: 60,
                bgcolor: '#FF8C42',
                border: '2.5px solid #FF8C42',
                mb: 0.5,
                padding: '2px',
                boxSizing: 'border-box',
                outline: '2px solid #fff',
                outlineOffset: '1px',
              }}
            >
              { (group.user?.display_name || 'U')[0] }
            </Avatar>
            <Typography variant='caption' sx={{ fontSize: '0.7rem', color: '#555', maxWidth: 64, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              { group.user?.display_name }
            </Typography>
          </Box>
        ))}
      </Box>

      {/* 스토리 뷰어 */}
      { viewingUser && (
        <StoryViewer
          userGroup={viewingUser}
          onClose={() => setViewingUser(null)}
          currentUserId={user?.id}
        />
      )}

      {/* 스토리 작성 모달 */}
      { isCreateOpen && (
        <StoryCreateModal
          open={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onCreated={handleStoryCreated}
          userId={user?.id}
        />
      )}
    </>
  );
};

export default StoryRow;
