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
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { supabase } from '../utils/supabase.js';
import { useSession } from '../context/SessionContext.jsx';
import useFollow from '../hooks/useFollow.js';
import BottomNav from '../components/common/BottomNav.jsx';
import PetCardSlider from '../components/ui/PetCardSlider.jsx';
import PetFormModal from '../components/ui/PetFormModal.jsx';

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
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [petModalOpen, setPetModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);

  const targetId = userId ? Number(userId) : currentUser?.id;
  const isMyPage = !userId || Number(userId) === currentUser?.id;

  const { isFollowing, followerCount, followingCount, toggleFollow, loading: followLoading } = useFollow(
    targetId,
    currentUser?.id
  );

  useEffect(() => {
    if (!targetId) {
      navigate('/login');
      return;
    }
    const fetchProfile = async () => {
      const [userRes, postRes, petRes] = await Promise.all([
        supabase.from('sns_users').select('*').eq('id', targetId).single(),
        supabase
          .from('sns_posts')
          .select('id, image_url, likes_count, created_at')
          .eq('user_id', targetId)
          .eq('is_deleted', 0)
          .order('created_at', { ascending: false }),
        supabase.from('sns_pets').select('*').eq('user_id', targetId).order('created_at'),
      ]);
      setProfile(userRes.data);
      setPosts(postRes.data || []);
      setPets(petRes.data || []);
      setLoading(false);
    };
    fetchProfile();
  }, [targetId, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePetSaved = async () => {
    const { data } = await supabase.from('sns_pets').select('*').eq('user_id', targetId).order('created_at');
    setPets(data || []);
    setPetModalOpen(false);
    setEditingPet(null);
  };

  const handlePetDelete = async (petId) => {
    await supabase.from('sns_pets').delete().eq('id', petId);
    setPets((prev) => prev.filter((p) => p.id !== petId));
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
            { label: '팔로워', value: followerCount },
            { label: '팔로잉', value: followingCount },
          ].map((stat) => (
            <Box key={stat.label} sx={{ textAlign: 'center' }}>
              <Typography variant='h6' fontWeight={700}>{ stat.value }</Typography>
              <Typography variant='caption' color='text.secondary'>{ stat.label }</Typography>
            </Box>
          ))}
        </Box>

        { !isMyPage && (
          <Button
            variant={ isFollowing ? 'outlined' : 'contained' }
            fullWidth
            onClick={toggleFollow}
            disabled={followLoading}
            sx={{ mb: 2, py: 1 }}
          >
            { isFollowing ? '팔로잉 ✓' : '팔로우' }
          </Button>
        )}

        {/* 반려동물 카드 슬라이드 */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant='subtitle2' fontWeight={700}>
              🐾 반려동물
            </Typography>
            { isMyPage && (
              <IconButton
                size='small'
                onClick={() => { setEditingPet(null); setPetModalOpen(true); }}
                sx={{ color: '#FF8C42' }}
              >
                <AddCircleOutlineIcon fontSize='small' />
              </IconButton>
            )}
          </Box>
          <PetCardSlider
            pets={pets}
            isMyPage={isMyPage}
            onEdit={(pet) => { setEditingPet(pet); setPetModalOpen(true); }}
            onDelete={handlePetDelete}
          />
        </Box>

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

      {/* 반려동물 등록/수정 모달 */}
      { petModalOpen && (
        <PetFormModal
          open={petModalOpen}
          onClose={() => { setPetModalOpen(false); setEditingPet(null); }}
          onSaved={handlePetSaved}
          pet={editingPet}
          userId={currentUser?.id}
        />
      )}
    </Box>
  );
};

export default ProfilePage;
