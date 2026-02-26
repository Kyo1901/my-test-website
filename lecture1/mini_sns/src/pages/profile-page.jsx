import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from '@mui/icons-material/Logout';
import { supabase } from '../utils/supabase.js';
import { useSession } from '../context/SessionContext.jsx';
import BottomNav from '../components/common/BottomNav.jsx';

/**
 * 마이페이지 / 사용자 프로필 페이지
 *
 * Props: 없음 (useParams로 userId 수신, 없으면 현재 로그인 유저)
 */
const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, logout } = useSession();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const targetId = userId || currentUser?.id;
  const isMyPage = !userId || Number(userId) === currentUser?.id;

  useEffect(() => {
    if (!targetId) {
      navigate('/login');
      return;
    }
    const fetchProfile = async () => {
      const { data: userData } = await supabase
        .from('sns_users')
        .select('*')
        .eq('id', targetId)
        .single();
      setProfile(userData);

      const { data: postData } = await supabase
        .from('sns_posts')
        .select('id, image_url, likes_count, created_at')
        .eq('user_id', targetId)
        .order('created_at', { ascending: false });
      setPosts(postData || []);
      setLoading(false);
    };
    fetchProfile();
  }, [targetId, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress color='primary' />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography>프로필을 찾을 수 없습니다.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#FFFDF6', pb: 10 }}>
      <AppBar position='sticky' elevation={0} sx={{ bgcolor: '#fff', borderBottom: '1px solid #f0e8e0' }}>
        <Toolbar sx={{ minHeight: 52 }}>
          { !isMyPage && (
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography variant='h6' fontWeight={700} sx={{ flex: 1, textAlign: 'center' }}>
            { isMyPage ? '마이페이지' : profile.display_name }
          </Typography>
          { isMyPage && (
            <IconButton onClick={handleLogout} title='로그아웃'>
              <LogoutIcon sx={{ color: '#aaa' }} />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth='sm' sx={{ px: { xs: 2, sm: 2 } }}>
        {/* 프로필 정보 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, py: 3 }}>
          <Avatar
            src={profile.profile_image}
            sx={{ width: 80, height: 80, bgcolor: '#FF8C42', fontSize: '2rem' }}
          >
            { profile.display_name[0] }
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant='h6' fontWeight={700}>{ profile.display_name }</Typography>
            <Typography variant='body2' color='text.secondary'>@{ profile.username }</Typography>
            { profile.bio && (
              <Typography variant='body2' sx={{ mt: 0.5, color: '#444' }}>
                { profile.bio }
              </Typography>
            )}
          </Box>
        </Box>

        {/* 통계 */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            py: 2,
            bgcolor: '#fff',
            borderRadius: 2,
            mb: 2,
            boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
          }}
        >
          { [
            { label: '게시물', value: posts.length },
            { label: '팔로워', value: Math.floor(Math.random() * 300 + 50) },
            { label: '팔로잉', value: Math.floor(Math.random() * 100 + 10) },
          ].map((stat) => (
            <Box key={stat.label} sx={{ textAlign: 'center' }}>
              <Typography variant='h6' fontWeight={700}>{ stat.value }</Typography>
              <Typography variant='caption' color='text.secondary'>{ stat.label }</Typography>
            </Box>
          ))}
        </Box>

        { !isMyPage && (
          <Button
            variant='contained'
            fullWidth
            sx={{ mb: 2, py: 1 }}
          >
            팔로우
          </Button>
        )}

        <Divider sx={{ mb: 1 }} />

        {/* 게시물 격자 */}
        { posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant='body1' color='text.secondary'>
              아직 게시물이 없어요 🐾
            </Typography>
            { isMyPage && (
              <Button
                variant='outlined'
                sx={{ mt: 2, borderColor: '#FF8C42', color: '#FF8C42' }}
                onClick={() => navigate('/create')}
              >
                첫 게시물 올리기
              </Button>
            )}
          </Box>
        ) : (
          <Grid container spacing={0.5}>
            { posts.map((post) => (
              <Grid key={post.id} size={{ xs: 4 }}>
                <Box
                  onClick={() => navigate(`/post/${post.id}`)}
                  sx={{
                    aspectRatio: '1/1',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    bgcolor: '#f5f0eb',
                  }}
                >
                  { post.image_url ? (
                    <Box
                      component='img'
                      src={post.image_url}
                      alt='post'
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography fontSize='1.5rem'>🐾</Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <BottomNav />
    </Box>
  );
};

export default ProfilePage;
