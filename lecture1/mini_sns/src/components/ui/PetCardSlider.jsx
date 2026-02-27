import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * 반려동물 카드 가로 슬라이드
 *
 * Props:
 * @param {Array} pets - 반려동물 목록 [Required]
 * @param {boolean} isMyPage - 내 페이지 여부 [Optional, 기본값: false]
 * @param {function} onEdit - 수정 콜백 [Optional]
 * @param {function} onDelete - 삭제 콜백 [Optional]
 *
 * Example usage:
 * <PetCardSlider pets={pets} isMyPage onEdit={handleEdit} onDelete={handleDelete} />
 */
const PetCardSlider = ({ pets, isMyPage = false, onEdit, onDelete }) => {
  const speciesEmoji = (species) => {
    if (species === '강아지') return '🐶';
    if (species === '고양이') return '🐱';
    return '🐹';
  };

  const calcAge = (birthday) => {
    if (!birthday) return null;
    const diff = Math.floor((Date.now() - new Date(birthday)) / (1000 * 60 * 60 * 24 * 365));
    return diff > 0 ? `${diff}살` : '1살 미만';
  };

  if (pets.length === 0) {
    return (
      <Box
        sx={{
          bgcolor: '#fff',
          borderRadius: 2,
          border: '1.5px dashed #f0e8e0',
          py: 2.5,
          textAlign: 'center',
        }}
      >
        <Typography variant='body2' color='text.secondary'>
          등록된 반려동물이 없어요 🐾
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
        pb: 0.5,
      }}
    >
      { pets.map((pet) => (
        <Box
          key={pet.id}
          sx={{
            flexShrink: 0,
            width: 130,
            bgcolor: '#fff',
            borderRadius: 3,
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* 프로필 이미지 or 이모지 */}
          <Box
            sx={{
              height: 90,
              bgcolor: '#FFF0E4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            { pet.profile_image ? (
              <Box
                component='img'
                src={pet.profile_image}
                alt={pet.name}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Typography sx={{ fontSize: '2.5rem' }}>
                { speciesEmoji(pet.species) }
              </Typography>
            )}
          </Box>

          {/* 정보 */}
          <Box sx={{ p: 1.2 }}>
            <Typography variant='body2' fontWeight={700} noWrap>
              { pet.name }
            </Typography>
            <Typography variant='caption' color='text.secondary' noWrap sx={{ display: 'block' }}>
              { pet.breed || pet.species }
            </Typography>
            { pet.birthday && (
              <Typography variant='caption' color='text.secondary'>
                { calcAge(pet.birthday) }
              </Typography>
            )}
            { pet.bio && (
              <Typography variant='caption' color='#666' sx={{ display: 'block', mt: 0.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                { pet.bio }
              </Typography>
            )}
          </Box>

          {/* 수정/삭제 버튼 (내 페이지) */}
          { isMyPage && (
            <Box
              sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                display: 'flex',
                gap: 0.2,
                bgcolor: 'rgba(255,255,255,0.8)',
                borderRadius: 2,
              }}
            >
              <IconButton size='small' sx={{ p: 0.4 }} onClick={() => onEdit && onEdit(pet)}>
                <EditIcon sx={{ fontSize: 14, color: '#FF8C42' }} />
              </IconButton>
              <IconButton size='small' sx={{ p: 0.4 }} onClick={() => onDelete && onDelete(pet.id)}>
                <DeleteIcon sx={{ fontSize: 14, color: '#E53935' }} />
              </IconButton>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default PetCardSlider;
