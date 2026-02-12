import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import DevicesIcon from '@mui/icons-material/Devices';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import useAuth from '../../hooks/use-auth.jsx';

const baseNavItems = [
  { label: '홈', path: '/' },
  { label: '공지사항', path: '/notices' },
  { label: '커뮤니티', path: '/community' },
  { label: '제품 정보', path: '/products' },
];

/**
 * Header 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <Header />
 */
function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isAdmin, logout } = useAuth();

  const handleNavClick = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    logout();
    setDrawerOpen(false);
    navigate('/');
  };

  /** 로그인 상태에 따른 네비게이션 항목 */
  const getNavItems = () => {
    const items = [...baseNavItems];
    if (user && isAdmin) {
      items.push({ label: '관리자', path: '/admin' });
    }
    return items;
  };

  const navItems = getNavItems();

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: 'primary.main',
          boxShadow: 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            <DevicesIcon sx={{ mr: 1, fontSize: '1.8rem' }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                letterSpacing: '0.05em',
              }}
            >
              IT Info
            </Typography>
          </Box>

          {isMobile ? (
            <IconButton
              color="inherit"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  onClick={() => handleNavClick(item.path)}
                  sx={{
                    fontWeight: location.pathname === item.path ? 700 : 400,
                    borderBottom: location.pathname === item.path
                      ? '2px solid white'
                      : '2px solid transparent',
                    borderRadius: 0,
                    px: 2,
                  }}
                >
                  {item.label}
                </Button>
              ))}

              {/* 로그인 상태에 따른 우측 메뉴 */}
              <Box sx={{ ml: 1, display: 'flex', gap: 0.5, alignItems: 'center' }}>
                {user ? (
                  <>
                    <Button
                      color="inherit"
                      startIcon={<PersonIcon />}
                      onClick={() => handleNavClick(`/profile/${user.user_id}`)}
                      sx={{
                        fontWeight: location.pathname.startsWith('/profile') ? 700 : 400,
                        borderBottom: location.pathname.startsWith('/profile')
                          ? '2px solid white'
                          : '2px solid transparent',
                        borderRadius: 0,
                      }}
                    >
                      {user.name}
                    </Button>
                    <IconButton color="inherit" onClick={handleLogout} size="small">
                      <LogoutIcon fontSize="small" />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <Button
                      color="inherit"
                      onClick={() => handleNavClick('/login')}
                      sx={{
                        fontWeight: location.pathname === '/login' ? 700 : 400,
                        borderBottom: location.pathname === '/login'
                          ? '2px solid white'
                          : '2px solid transparent',
                        borderRadius: 0,
                      }}
                    >
                      로그인
                    </Button>
                    <Button
                      color="inherit"
                      variant="outlined"
                      onClick={() => handleNavClick('/register')}
                      sx={{
                        borderColor: 'rgba(255,255,255,0.7)',
                        '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                      }}
                    >
                      회원가입
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* 모바일 드로어 */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250, pt: 2 }}>
          <Typography
            variant="h6"
            sx={{ px: 2, pb: 1, fontWeight: 700, color: 'primary.main' }}
          >
            IT Info
          </Typography>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  onClick={() => handleNavClick(item.path)}
                  selected={location.pathname === item.path}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 1 }} />

          {user ? (
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleNavClick(`/profile/${user.user_id}`)}
                >
                  <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                  <ListItemText primary={`${user.name} 프로필`} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                  <ListItemText primary="로그아웃" />
                </ListItemButton>
              </ListItem>
            </List>
          ) : (
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleNavClick('/login')}>
                  <ListItemText primary="로그인" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleNavClick('/register')}>
                  <ListItemText primary="회원가입" />
                </ListItemButton>
              </ListItem>
            </List>
          )}
        </Box>
      </Drawer>
    </>
  );
}

export default Header;
