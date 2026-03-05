import Box from '@mui/material/Box';
import { useScrollProgress } from '../../hooks/use-scroll-animation';

/**
 * ScrollProgressBar 컴포넌트
 * 페이지 최상단 고정 — 스크롤 진행률을 얇은 바로 표시
 *
 * Props: 없음
 *
 * Example usage:
 * <ScrollProgressBar />
 */
function ScrollProgressBar() {
  const progress = useScrollProgress();

  return (
    <Box
      aria-hidden="true"
      role="presentation"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '2px',
        width: `${progress * 100}%`,
        background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
        zIndex: 2000,
        boxShadow: '0 0 8px rgba(41, 151, 255, 0.5)',
        transition: 'width 0.06s linear',
        pointerEvents: 'none',
      }}
    />
  );
}

export default ScrollProgressBar;
