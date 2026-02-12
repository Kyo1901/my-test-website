import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Divider from '@mui/material/Divider';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import MailIcon from '@mui/icons-material/Mail';
import InfoIcon from '@mui/icons-material/Info';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

const MENU_ITEMS = [
  { label: '홈', icon: HomeIcon },
  { label: '프로필', icon: PersonIcon },
  { label: '북마크', icon: BookmarkIcon },
  { label: '메시지', icon: MailIcon },
  { label: '정보', icon: InfoIcon },
  { label: '설정', icon: SettingsIcon },
];

/**
 * Section08Sidebar 컴포넌트
 *
 * MUI Drawer를 왼쪽/오른쪽 위치 선택과 함께 토글하는 섹션
 * List + ListItem + 아이콘으로 네비게이션 메뉴 구성
 *
 * Example usage:
 * <Section08Sidebar />
 */
function Section08Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [anchor, setAnchor] = useState('left');

  const handleAnchorChange = (e, newAnchor) => {
    if (newAnchor !== null) {
      setAnchor(newAnchor);
    }
  };

  const handleMenuClick = (label) => {
    alert(`"${label}" 메뉴가 클릭되었습니다!`);
    setIsOpen(false);
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
        08. Sidebar (Drawer)
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: 'text.secondary', mb: 3 }}
      >
        Drawer + List 네비게이션 / 왼쪽·오른쪽 위치 선택
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<MenuOpenIcon />}
          onClick={() => setIsOpen(true)}
        >
          사이드바 열기
        </Button>

        <ToggleButtonGroup
          value={anchor}
          exclusive
          onChange={handleAnchorChange}
          size="small"
        >
          <ToggleButton value="left">왼쪽</ToggleButton>
          <ToggleButton value="right">오른쪽</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Drawer
        anchor={anchor}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Box sx={{ width: 280 }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Navigation
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              메뉴를 선택하세요
            </Typography>
          </Box>
          <Divider />
          <List>
            {MENU_ITEMS.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton onClick={() => handleMenuClick(item.label)}>
                  <ListItemIcon>
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => setIsOpen(false)}
            >
              닫기
            </Button>
          </Box>
        </Box>
      </Drawer>

      <Divider sx={{ mt: 6 }} />
    </Box>
  );
}

export default Section08Sidebar;
