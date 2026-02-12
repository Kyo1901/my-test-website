import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';

const MENU_ITEMS = ['홈', '소개', '서비스', '연락처'];

/**
 * Section03Navigation 컴포넌트
 *
 * MUI AppBar + Toolbar 기반 네비게이션 바
 * 데스크톱: 버튼 메뉴 / 모바일: 햄버거 + Drawer
 * 클릭 시 메뉴명 알림 표시
 *
 * Example usage:
 * <Section03Navigation />
 */
function Section03Navigation() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleMenuClick = (menu) => {
    alert(`"${menu}" 메뉴가 클릭되었습니다!`);
    setIsDrawerOpen(false);
  };

  return (
    <Box sx={{ mb: 6 }}>
      <Typography
        variant="h5"
        component="h2"
        sx={{
          fontWeight: 600,
          mb: 1,
          fontSize: { xs: '1.2rem', md: '1.5rem' },
        }}
      >
        03. Navigation
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: 'text.secondary', mb: 3 }}
      >
        AppBar + Toolbar / 모바일 햄버거 메뉴 (Drawer)
      </Typography>

      {/* 네비게이션 바 (position static으로 섹션 내부에 배치) */}
      <Box sx={{ borderRadius: 1, overflow: 'hidden' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h6"
              sx={{ flexGrow: 1, fontSize: { xs: '1rem', md: '1.25rem' } }}
            >
              MyApp
            </Typography>

            {isMobile ? (
              /* 모바일: 햄버거 아이콘 */
              <IconButton
                color="inherit"
                onClick={() => setIsDrawerOpen(true)}
                edge="end"
              >
                <MenuIcon />
              </IconButton>
            ) : (
              /* 데스크톱: 버튼 메뉴 */
              <Box sx={{ display: 'flex', gap: 1 }}>
                {MENU_ITEMS.map((menu) => (
                  <Button
                    key={menu}
                    color="inherit"
                    onClick={() => handleMenuClick(menu)}
                  >
                    {menu}
                  </Button>
                ))}
              </Box>
            )}
          </Toolbar>
        </AppBar>

        {/* 모바일 Drawer */}
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        >
          <Box sx={{ width: 250 }}>
            <Typography
              variant="h6"
              sx={{ p: 2, fontWeight: 600 }}
            >
              메뉴
            </Typography>
            <Divider />
            <List>
              {MENU_ITEMS.map((menu) => (
                <ListItem key={menu} disablePadding>
                  <ListItemButton onClick={() => handleMenuClick(menu)}>
                    <ListItemText primary={menu} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Box>

      <Divider sx={{ mt: 6 }} />
    </Box>
  );
}

export default Section03Navigation;
