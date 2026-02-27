import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import { supabase } from '../../utils/supabase.js';

const UNSPLASH_ACCESS_KEY = 'l2p3ycpBlDpngpb8czQwxbbQFMqwGeY8knDzQssRnHk';

/**
 * 스토리 작성 모달
 *
 * Props:
 * @param {boolean} open - 모달 열림 여부 [Required]
 * @param {function} onClose - 닫기 콜백 [Required]
 * @param {function} onCreated - 생성 완료 콜백 [Required]
 * @param {number} userId - 로그인 사용자 ID [Required]
 *
 * Example usage:
 * <StoryCreateModal open={open} onClose={handleClose} onCreated={handleCreated} userId={user.id} />
 */
const StoryCreateModal = ({ open, onClose, onCreated, userId }) => {
  const [caption, setCaption] = useState('');
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [loadingImages, setLoadingImages] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchImages = async () => {
    setLoadingImages(true);
    try {
      const q = query.trim() || 'pet';
      const res = await fetch(
        `https://api.unsplash.com/photos/random?count=6&query=${encodeURIComponent(q)}&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      const data = await res.json();
      setImages(Array.isArray(data) ? data.map((img) => ({ id: img.id, url: img.urls.regular, thumb: img.urls.small })) : []);
    } catch {
      setImages([]);
    }
    setLoadingImages(false);
  };

  const handleSubmit = async () => {
    if (!selected || !userId) return;
    setSubmitting(true);
    await supabase.from('sns_stories').insert([{
      user_id: userId,
      image_url: selected.url,
      caption: caption.trim() || null,
    }]);
    setSubmitting(false);
    onCreated();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
      <DialogTitle fontWeight={700}>스토리 추가</DialogTitle>
      <DialogContent>
        <TextField
          placeholder='스토리 텍스트 (선택)'
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          size='small'
          fullWidth
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
          <TextField
            placeholder='강아지, 고양이...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            size='small'
            fullWidth
            onKeyDown={(e) => e.key === 'Enter' && fetchImages()}
          />
          <Button variant='contained' onClick={fetchImages} disabled={loadingImages} startIcon={<RefreshIcon />} sx={{ whiteSpace: 'nowrap' }}>
            검색
          </Button>
        </Box>

        { loadingImages ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={32} />
          </Box>
        ) : images.length > 0 ? (
          <Grid container spacing={0.8}>
            { images.map((img) => (
              <Grid key={img.id} size={{ xs: 4 }}>
                <Box
                  onClick={() => setSelected(img)}
                  sx={{
                    position: 'relative',
                    aspectRatio: '1/1',
                    cursor: 'pointer',
                    borderRadius: 1.5,
                    overflow: 'hidden',
                    border: selected?.id === img.id ? '3px solid #FF8C42' : '3px solid transparent',
                  }}
                >
                  <Box component='img' src={img.thumb} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  { selected?.id === img.id && (
                    <Box sx={{ position: 'absolute', top: 2, right: 2, bgcolor: '#FF8C42', borderRadius: '50%' }}>
                      <CheckCircleIcon sx={{ color: '#fff', fontSize: 18 }} />
                    </Box>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant='body2' color='text.secondary' sx={{ textAlign: 'center', py: 2 }}>
            검색 버튼을 눌러 이미지를 선택하세요
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: '#888' }}>취소</Button>
        <Button variant='contained' onClick={handleSubmit} disabled={!selected || submitting}>
          { submitting ? '업로드 중...' : '스토리 올리기' }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StoryCreateModal;
