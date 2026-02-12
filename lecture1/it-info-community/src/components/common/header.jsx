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
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import DevicesIcon from '@mui/icons-material/Devices';

const navItems = [
  { label: '홈', path: '/' },
  { label: '공지사항', path: '/notices' },
  { label: '커뮤니티', path: '/community' },
  { label: '제품 정보', path: '/products' },
  { label: '관리자', path: '/admin' },
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

  const handleNavClick = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

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
            <Box sx={{ display: 'flex', gap: 1 }}>
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
            </Box>
          )}
        </Toolbar>
      </AppBar>

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
        </Box>
      </Drawer>
    </>
  );
}

export default Header;
