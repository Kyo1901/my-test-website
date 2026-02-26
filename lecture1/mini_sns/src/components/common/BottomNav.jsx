import { useNavigate, useLocation } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonIcon from '@mui/icons-material/Person';

/**
 * 하단 5탭 네비게이션 바
 *
 * Props: 없음 (라우터에서 현재 경로 자동 감지)
 */
const BottomNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const tabValue = () => {
    if (pathname === '/') return 0;
    if (pathname.startsWith('/search')) return 1;
    if (pathname.startsWith('/create')) return 2;
    if (pathname.startsWith('/profile')) return 3;
    return 0;
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        borderTop: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <BottomNavigation
        value={tabValue()}
        sx={{ bgcolor: '#fff', height: 60 }}
      >
        <BottomNavigationAction
          label='홈'
          icon={<HomeIcon />}
          onClick={() => navigate('/')}
          sx={{ minWidth: 48, '&.Mui-selected': { color: '#FF8C42' } }}
        />
        <BottomNavigationAction
          label='탐색'
          icon={<SearchIcon />}
          onClick={() => navigate('/search')}
          sx={{ minWidth: 48, '&.Mui-selected': { color: '#FF8C42' } }}
        />
        <BottomNavigationAction
          label='작성'
          icon={
            <AddCircleIcon sx={{ fontSize: 40, color: '#FF8C42', mb: '2px' }} />
          }
          onClick={() => navigate('/create')}
          sx={{ minWidth: 48 }}
        />
        <BottomNavigationAction
          label='마이'
          icon={<PersonIcon />}
          onClick={() => navigate('/profile')}
          sx={{ minWidth: 48, '&.Mui-selected': { color: '#FF8C42' } }}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;
