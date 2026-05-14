import { useState } from 'react';
import {
  AppBar, Toolbar, Box, Button, Typography, InputBase,
  Avatar, Menu, MenuItem, IconButton, Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Header 컴포넌트 - 상단 네비게이션 바
 */
function Header() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleSignOut = async () => {
    handleMenuClose();
    await signOut();
    navigate('/');
  };

  return (
    <AppBar
      position='sticky'
      sx={{ bgcolor: '#FFFFFF', boxShadow: 'none', borderBottom: '1px solid #EDEFF1', zIndex: 1200 }}
    >
      <Toolbar sx={{ gap: 1, minHeight: '48px !important', px: { xs: 1, md: 2 } }}>
        {/* 로고 */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', mr: 1 }}
          onClick={() => navigate('/')}
        >
          <Box
            sx={{
              width: 32, height: 32, borderRadius: '50%',
              bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1rem' }}>R</Typography>
          </Box>
          <Typography
            sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#1C1C1C', display: { xs: 'none', sm: 'block' } }}
          >
            roundit
          </Typography>
        </Box>

        {/* 검색창 */}
        <Box
          sx={{
            flex: 1, maxWidth: 690,
            bgcolor: '#F6F7F8', border: '1px solid #EDEFF1',
            borderRadius: '20px', px: 2, py: 0.5,
            display: 'flex', alignItems: 'center', gap: 1,
            '&:hover': { bgcolor: '#fff', border: '1px solid #0079D3' },
          }}
        >
          <SearchIcon sx={{ color: '#878A8C', fontSize: '1.1rem' }} />
          <InputBase
            placeholder='Search Roundit'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            sx={{ flex: 1, fontSize: '0.875rem' }}
          />
        </Box>

        <Box sx={{ flex: 1 }} />

        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant='outlined'
              size='small'
              startIcon={<AddIcon />}
              onClick={() => navigate('/submit')}
              sx={{ borderRadius: '20px', textTransform: 'none', fontWeight: 700, display: { xs: 'none', sm: 'flex' } }}
            >
              게시물 작성
            </Button>
            <IconButton onClick={handleMenuOpen} size='small'>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
                {profile?.username?.[0]?.toUpperCase() ?? 'U'}
              </Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem disabled>
                <Typography variant='caption'>{profile?.username}</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>프로필</MenuItem>
              <MenuItem onClick={() => { handleMenuClose(); navigate('/saved'); }}>저장된 게시물</MenuItem>
              <Divider />
              <MenuItem onClick={handleSignOut}>로그아웃</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant='outlined'
              size='small'
              onClick={() => navigate('/login')}
              sx={{ borderRadius: '20px', textTransform: 'none', fontWeight: 700, borderColor: 'primary.main', color: 'primary.main' }}
            >
              로그인
            </Button>
            <Button
              variant='contained'
              size='small'
              onClick={() => navigate('/register')}
              sx={{ borderRadius: '20px', textTransform: 'none', fontWeight: 700, display: { xs: 'none', sm: 'flex' } }}
            >
              회원가입
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
