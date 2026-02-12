import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useSwipeable } from 'react-swipeable';

const SLIDES = [
  { title: 'Mountain', color: '#1565C0', emoji: '🏔️' },
  { title: 'Ocean', color: '#00838F', emoji: '🌊' },
  { title: 'Forest', color: '#2E7D32', emoji: '🌲' },
  { title: 'Desert', color: '#E65100', emoji: '🏜️' },
  { title: 'City', color: '#4527A0', emoji: '🏙️' },
];

/**
 * Section07Swipe 컴포넌트
 *
 * react-swipeable로 좌우 스와이프 제스처를 감지하고
 * 이전/다음 버튼과 인디케이터로 슬라이드를 탐색하는 섹션
 *
 * Example usage:
 * <Section07Swipe />
 */
function Section07Swipe() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goTo = (index) => {
    if (index < 0) {
      setCurrentIndex(SLIDES.length - 1);
    } else if (index >= SLIDES.length) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(index);
    }
  };

  const goPrev = () => goTo(currentIndex - 1);
  const goNext = () => goTo(currentIndex + 1);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: goNext,
    onSwipedRight: goPrev,
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  const slide = SLIDES[currentIndex];

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
        07. Swipe
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: 'text.secondary', mb: 3 }}
      >
        좌우 스와이프(터치/마우스 드래그) 또는 버튼으로 슬라이드 탐색
      </Typography>

      {/* 슬라이더 영역 */}
      <Box
        sx={{
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          userSelect: 'none',
        }}
      >
        {/* 스와이프 감지 영역 */}
        <Box
          {...swipeHandlers}
          sx={{
            backgroundColor: slide.color,
            height: { xs: 220, md: 320 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.4s ease',
            cursor: 'grab',
            '&:active': { cursor: 'grabbing' },
          }}
        >
          <Typography sx={{ fontSize: { xs: '3rem', md: '4.5rem' }, mb: 1 }}>
            {slide.emoji}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              color: '#fff',
              fontWeight: 700,
              fontSize: { xs: '1.5rem', md: '2rem' },
            }}
          >
            {slide.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
            {currentIndex + 1} / {SLIDES.length}
          </Typography>
        </Box>

        {/* 이전 버튼 */}
        <IconButton
          onClick={goPrev}
          sx={{
            position: 'absolute',
            left: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255,255,255,0.25)',
            color: '#fff',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.45)' },
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>

        {/* 다음 버튼 */}
        <IconButton
          onClick={goNext}
          sx={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255,255,255,0.25)',
            color: '#fff',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.45)' },
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>

      {/* 인디케이터 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
        {SLIDES.map((s, i) => (
          <Box
            key={s.title}
            onClick={() => goTo(i)}
            sx={{
              width: i === currentIndex ? 24 : 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: i === currentIndex ? slide.color : 'grey.400',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </Box>

      <Divider sx={{ mt: 6 }} />
    </Box>
  );
}

export default Section07Swipe;
