import Box from '@mui/material/Box';
import { useIntersectionObserver } from '../../hooks/use-scroll-animation';

/**
 * ScrollReveal 컴포넌트
 * Intersection Observer로 뷰포트 진입 시 애니메이션 트리거
 * transform3d + willChange로 GPU 가속 적용
 *
 * Props:
 * @param {React.ReactNode} children  - 감쌀 콘텐츠 [Required]
 * @param {'fadeUp'|'fadeIn'|'slideLeft'|'slideRight'|'scaleUp'} variant
 *                                    - 애니메이션 종류 [Optional, 기본값: 'fadeUp']
 * @param {number}  delay             - 딜레이(초)    [Optional, 기본값: 0]
 * @param {number}  duration          - 지속시간(초)  [Optional, 기본값: 0.65]
 * @param {number}  threshold         - 가시성 임계값 [Optional, 기본값: 0.12]
 * @param {object}  sx                - MUI sx prop   [Optional]
 *
 * Example usage:
 * <ScrollReveal variant="scaleUp" delay={0.1}><MyCard /></ScrollReveal>
 */

const HIDDEN_STYLES = {
  fadeUp:     { opacity: 0, transform: 'translate3d(0, 48px, 0)' },
  fadeIn:     { opacity: 0, transform: 'translate3d(0, 0, 0)' },
  slideLeft:  { opacity: 0, transform: 'translate3d(-48px, 0, 0)' },
  slideRight: { opacity: 0, transform: 'translate3d(48px, 0, 0)' },
  scaleUp:    { opacity: 0, transform: 'scale3d(0.88, 0.88, 1)' },
};

const VISIBLE_STYLES = {
  fadeUp:     { opacity: 1, transform: 'translate3d(0, 0, 0)' },
  fadeIn:     { opacity: 1, transform: 'translate3d(0, 0, 0)' },
  slideLeft:  { opacity: 1, transform: 'translate3d(0, 0, 0)' },
  slideRight: { opacity: 1, transform: 'translate3d(0, 0, 0)' },
  scaleUp:    { opacity: 1, transform: 'scale3d(1, 1, 1)' },
};

function ScrollReveal({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.65,
  threshold = 0.12,
  sx,
}) {
  const [ref, isVisible] = useIntersectionObserver({ threshold });
  const currentStyles = isVisible
    ? (VISIBLE_STYLES[variant] ?? VISIBLE_STYLES.fadeUp)
    : (HIDDEN_STYLES[variant] ?? HIDDEN_STYLES.fadeUp);

  return (
    <Box
      ref={ ref }
      sx={{
        ...currentStyles,
        transition: `opacity ${duration}s ease ${delay}s, transform ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
        willChange: 'opacity, transform',
        ...sx,
      }}
    >
      { children }
    </Box>
  );
}

export default ScrollReveal;
