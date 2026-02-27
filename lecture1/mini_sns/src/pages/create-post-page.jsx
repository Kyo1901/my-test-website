import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PetsIcon from '@mui/icons-material/Pets';
import { supabase } from '../utils/supabase.js';
import { useSession } from '../context/SessionContext.jsx';
import { parseHashtags, saveHashtags } from '../utils/hashtag.js';
import BottomNav from '../components/common/BottomNav.jsx';

const UNSPLASH_ACCESS_KEY = 'l2p3ycpBlDpngpb8czQwxbbQFMqwGeY8knDzQssRnHk';

/**
 * 게시물 작성 페이지 (Unsplash 이미지 선택 + 해시태그 + 반려동물 태그)
 *
 * Props: 없음 (라우터로 접근)
 */
const CreatePostPage = () => {
  const navigate = useNavigate();
  const { user } = useSession();
  const [caption, setCaption] = useState('');
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [loadingImages, setLoadingImages] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [pets, setPets] = useState([]);
  const [selectedPetIds, setSelectedPetIds] = useState([]);
  const [parsedTags, setParsedTags] = useState([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('sns_pets')
      .select('id, name, species')
      .eq('user_id', user.id)
      .then(({ data }) => setPets(data || []));
  }, [user]);

  const handleCaptionChange = (e) => {
    const val = e.target.value;
    setCaption(val);
    setParsedTags(parseHashtags(val));
  };

  const fetchImages = async (searchQuery) => {
    setLoadingImages(true);
    setSelectedImage(null);
    try {
      const q = searchQuery.trim() || 'pet dog cat';
      const res = await fetch(
        `https://api.unsplash.com/photos/random?count=9&query=${encodeURIComponent(q)}&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      const data = await res.json();
      const urls = Array.isArray(data) ? data.map((img) => ({
        id: img.id,
        url: img.urls.regular,
        thumb: img.urls.small,
      })) : [];
      setImages(urls);
    } catch {
      setImages([]);
    }
    setLoadingImages(false);
  };

  const handleSearch = () => {
    fetchImages(searchInput);
  };

  const handlePetToggle = (petId) => {
    setSelectedPetIds((prev) =>
      prev.includes(petId) ? prev.filter((id) => id !== petId) : [...prev, petId]
    );
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('로그인이 필요합니다.');
      return;
    }
    if (!caption.trim() && !selectedImage) {
      setError('내용이나 이미지를 추가해주세요.');
      return;
    }
    setSubmitting(true);

    const { data: newPost, error: dbErr } = await supabase
      .from('sns_posts')
      .insert([{
        user_id: user.id,
        caption: caption.trim(),
        image_url: selectedImage?.url || null,
        likes_count: 0,
      }])
      .select()
      .single();

    if (dbErr || !newPost) {
      setError('게시물 저장에 실패했습니다.');
      setSubmitting(false);
      return;
    }

    // 해시태그 저장
    const tags = parseHashtags(caption);
    if (tags.length > 0) {
      await saveHashtags(newPost.id, tags);
    }

    // 반려동물 태그 저장
    if (selectedPetIds.length > 0) {
      await supabase
        .from('sns_post_pet_tags')
        .insert(selectedPetIds.map((petId) => ({ post_id: newPost.id, pet_id: petId })));
    }

    navigate('/');
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#FFFDF6', pb: 10 }}>
      <AppBar position='sticky' elevation={0} sx={{ bgcolor: '#fff', borderBottom: '1px solid #f0e8e0' }}>
        <Toolbar sx={{ minHeight: 52 }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant='h6' fontWeight={700} sx={{ flex: 1, textAlign: 'center' }}>
            새 게시물
          </Typography>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            sx={{ color: '#FF8C42', fontWeight: 700, fontSize: '1rem' }}
          >
            { submitting ? '게시 중...' : '게시' }
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth='sm' sx={{ pt: 2, px: { xs: 2, sm: 2 } }}>
        { !user && (
          <Alert severity='warning' sx={{ mb: 2 }}>
            로그인 후 게시물을 작성할 수 있습니다.
          </Alert>
        )}
        { error && <Alert severity='error' sx={{ mb: 2 }}>{ error }</Alert> }

        {/* 1단계: 캡션 */}
        <Typography variant='subtitle2' fontWeight={700} sx={{ mb: 1 }}>
          1단계 — 내용 작성
        </Typography>
        <TextField
          placeholder='반려동물의 하루를 공유해보세요! #해시태그 사용 가능'
          value={caption}
          onChange={handleCaptionChange}
          multiline
          rows={3}
          fullWidth
          sx={{ mb: 1 }}
        />
        {/* 해시태그 미리보기 */}
        { parsedTags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            { parsedTags.map((tag) => (
              <Chip key={tag} label={`#${tag}`} size='small' sx={{ bgcolor: '#FFF0E4', color: '#E06A1E', fontWeight: 600 }} />
            ))}
          </Box>
        )}

        {/* 2단계: 반려동물 태그 */}
        { pets.length > 0 && (
          <>
            <Typography variant='subtitle2' fontWeight={700} sx={{ mb: 1 }}>
              2단계 — 반려동물 태그 <PetsIcon sx={{ fontSize: 16, verticalAlign: 'middle', color: '#FF8C42' }} />
            </Typography>
            <FormGroup row sx={{ mb: 2.5, flexWrap: 'wrap', gap: 0.5 }}>
              { pets.map((pet) => (
                <FormControlLabel
                  key={pet.id}
                  control={
                    <Checkbox
                      checked={selectedPetIds.includes(pet.id)}
                      onChange={() => handlePetToggle(pet.id)}
                      size='small'
                      sx={{ color: '#FF8C42', '&.Mui-checked': { color: '#FF8C42' } }}
                    />
                  }
                  label={
                    <Typography variant='body2'>
                      { pet.species === '강아지' ? '🐶' : pet.species === '고양이' ? '🐱' : '🐹' } { pet.name }
                    </Typography>
                  }
                  sx={{ bgcolor: '#fff', border: '1px solid #f0e8e0', borderRadius: 2, px: 1, m: 0 }}
                />
              ))}
            </FormGroup>
          </>
        )}

        {/* 3단계: 이미지 검색 */}
        <Typography variant='subtitle2' fontWeight={700} sx={{ mb: 1 }}>
          { pets.length > 0 ? '3단계' : '2단계' } — 이미지 탐색 (Unsplash)
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            placeholder='강아지, 고양이, 토끼...'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            size='small'
            fullWidth
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button
            variant='contained'
            onClick={handleSearch}
            disabled={loadingImages}
            startIcon={<RefreshIcon />}
            sx={{ whiteSpace: 'nowrap', minWidth: 80 }}
          >
            검색
          </Button>
        </Box>

        { loadingImages ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress color='primary' />
          </Box>
        ) : images.length > 0 ? (
          <>
            <Typography variant='caption' color='text.secondary' sx={{ mb: 1, display: 'block' }}>
              이미지를 클릭해서 선택하세요
            </Typography>
            <Grid container spacing={1} sx={{ mb: 2 }}>
              { images.map((img) => (
                <Grid key={img.id} size={{ xs: 4 }}>
                  <Box
                    onClick={() => setSelectedImage(img)}
                    sx={{
                      position: 'relative',
                      aspectRatio: '1/1',
                      cursor: 'pointer',
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: selectedImage?.id === img.id ? '3px solid #FF8C42' : '3px solid transparent',
                      transition: 'border 0.15s',
                    }}
                  >
                    <Box
                      component='img'
                      src={img.thumb}
                      alt='unsplash'
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    { selectedImage?.id === img.id && (
                      <Box
                        sx={{
                          position: 'absolute', top: 4, right: 4,
                          bgcolor: '#FF8C42', borderRadius: '50%',
                        }}
                      >
                        <CheckCircleIcon sx={{ color: '#fff', fontSize: 20 }} />
                      </Box>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4, bgcolor: '#f5f5f5', borderRadius: 2, mb: 2 }}>
            <Typography variant='body2' color='text.secondary'>
              검색 버튼을 눌러 이미지를 불러오세요 🐾
            </Typography>
          </Box>
        )}

        {/* 선택된 이미지 미리보기 */}
        { selectedImage && (
          <Box sx={{ mb: 2 }}>
            <Typography variant='subtitle2' fontWeight={700} sx={{ mb: 1 }}>
              선택된 이미지
            </Typography>
            <Box
              component='img'
              src={selectedImage.url}
              alt='선택된 이미지'
              sx={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: 2 }}
            />
          </Box>
        )}
      </Container>

      <BottomNav />
    </Box>
  );
};

export default CreatePostPage;
