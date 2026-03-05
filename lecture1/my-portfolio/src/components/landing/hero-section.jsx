import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import GitHubIcon from '@mui/icons-material/GitHub';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const HEADLINE = '논리로 설계하고,\n코드로 구현합니다.';
const TYPING_SPEED_MS = 65;
const TYPING_START_DELAY_MS = 1000;

const SOCIAL_LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/Kyo1901/my-test-website',
    icon: <GitHubIcon sx={{ fontSize: 22 }} />,
  },
];

function HeroSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));    // 0 ~ 599px
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg')); // 600 ~ 1199px

  const [displayText, setDisplayText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);

  useEffect(() => {
    /** prefers-reduced-motion 사용자에게는 타이핑 효과 생략 */
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayText(HEADLINE);
      setIsTypingDone(true);
      return;
    }

    let typingInterval;
    const startTimer = setTimeout(() => {
      let index = 0;
      typingInterval = setInterval(() => {
        index += 1;
        setDisplayText(HEADLINE.slice(0, index));
        if (index >= HEADLINE.length) {
          setIsTypingDone(true);
          clearInterval(typingInterval);
        }
      }, TYPING_SPEED_MS);
    }, TYPING_START_DELAY_MS);

    return () => {
      clearTimeout(startTimer);
      clearInterval(typingInterval);
    };
  }, []);

  const handleScrollTo = useCallback((sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <Box
      component="section"
      aria-label="소개"
      sx={{
        bgcolor: 'var(--color-bg-dark)',
        minHeight: { xs: '100svh', sm: '92vh', lg: '88vh' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        /* 개발자 감성 격자 도트 패턴 배경 */
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
        backgroundSize: { xs: '24px 24px', md: '32px 32px' },
      }}
    >
      {/* 상단 그라데이션 포인트 — 은은한 블루 글로우 */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: { xs: '260px', sm: '380px', lg: '500px' },
          height: { xs: '260px', sm: '380px', lg: '500px' },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 113, 227, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Container
        maxWidth="md"
        sx={{
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          px: { xs: 3, sm: 4, md: 6 },
          /* 스크롤 화살표 공간 확보 */
          pb: { xs: 8, sm: 6 },
        }}
      >
        {/* 인사말 */}
        <Typography
          variant="overline"
          component="p"
          sx={{
            color: 'var(--color-primary-light)',
            fontWeight: 600,
            letterSpacing: { xs: 2, md: 3 },
            fontSize: { xs: '0.7rem', md: '0.75rem' },
            mb: { xs: 1.5, md: 2 },
            display: 'block',
            animation: 'fadeInUp 0.6s ease 0s both',
          }}
        >
          안녕하세요
        </Typography>

        {/* 메인 헤드라인 — 타이핑 효과 */}
        <Typography
          variant={ isMobile ? 'h2' : 'h1' }
          component="h1"
          sx={{
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: { xs: '1.75rem', sm: '2.4rem', md: '3.2rem', lg: '3.8rem' },
            lineHeight: { xs: 1.3, md: 1.25 },
            mb: { xs: 2.5, md: 3 },
            minHeight: {
              xs: '5rem',
              sm: '5rem',
              md: '5.5rem',
            },
            wordBreak: 'keep-all',
            whiteSpace: 'pre-line',
            animation: 'fadeInUp 0.6s ease 0.3s both',
          }}
        >
          { displayText }
          {/* 타이핑 커서 */}
          { !isTypingDone && (
            <Box
              component="span"
              aria-hidden="true"
              sx={{
                display: 'inline-block',
                width: '2px',
                height: { xs: '0.75em', md: '0.82em' },
                bgcolor: 'var(--color-primary-light)',
                ml: '3px',
                verticalAlign: 'middle',
                animation: 'blink 0.7s step-end infinite',
              }}
            />
          ) }
        </Typography>

        {/* 직함 */}
        <Typography
          component="p"
          sx={{
            color: 'var(--color-primary-light)',
            fontWeight: 600,
            fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.4rem', lg: '1.5rem' },
            mb: { xs: 1, md: 1.5 },
            animation: 'fadeInUp 0.6s ease 0.5s both',
          }}
        >
          풀스택 개발자 김기호
        </Typography>

        {/* 학력/경력 */}
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.95rem' },
            mb: { xs: 4, md: 5 },
            animation: 'fadeInUp 0.6s ease 0.7s both',
          }}
        >
          조선대학교 컴퓨터공학과 · 신입
        </Typography>

        {/* CTA 버튼 */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1.5, sm: 2 },
            justifyContent: 'center',
            alignItems: 'center',
            animation: 'fadeInUp 0.6s ease 0.9s both',
          }}
        >
          <Button
            variant="contained"
            onClick={ () => handleScrollTo('section-projects') }
            aria-label="프로젝트 섹션으로 스크롤"
            fullWidth={ isMobile }
            sx={{
              bgcolor: 'var(--color-button-primary)',
              color: '#FFFFFF',
              borderRadius: '980px',
              textTransform: 'none',
              px: { xs: 3, md: 4 },
              py: { xs: 1.4, md: 1.2 },
              minHeight: 44,
              fontSize: { xs: '0.95rem', md: '1rem' },
              fontWeight: 600,
              boxShadow: 'none',
              transition: 'all 0.2s ease',
              maxWidth: { xs: 320, sm: 'none' },
              '&:hover': {
                bgcolor: 'var(--color-button-hover)',
                boxShadow: '0 4px 24px rgba(0, 113, 227, 0.45)',
                transform: 'translateY(-2px)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
            }}
          >
            프로젝트 보기
          </Button>
          <Button
            variant="outlined"
            onClick={ () => handleScrollTo('section-contact') }
            aria-label="연락처 섹션으로 스크롤"
            fullWidth={ isMobile }
            sx={{
              borderColor: 'rgba(255,255,255,0.35)',
              color: '#FFFFFF',
              borderRadius: '980px',
              textTransform: 'none',
              px: { xs: 3, md: 4 },
              py: { xs: 1.4, md: 1.2 },
              minHeight: 44,
              fontSize: { xs: '0.95rem', md: '1rem' },
              fontWeight: 600,
              transition: 'all 0.2s ease',
              maxWidth: { xs: 320, sm: 'none' },
              '&:hover': {
                borderColor: '#FFFFFF',
                bgcolor: 'rgba(255,255,255,0.08)',
                transform: 'translateY(-2px)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
            }}
          >
            연락하기
          </Button>
        </Box>

        {/* 소셜 링크 */}
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 0.5, md: 1 },
            justifyContent: 'center',
            mt: { xs: 2.5, md: 3 },
            animation: 'fadeInUp 0.6s ease 1.1s both',
          }}
        >
          { SOCIAL_LINKS.map(({ label, href, icon }) => (
            <Tooltip key={ label } title={ label } enterDelay={ 300 }>
              <IconButton
                component="a"
                href={ href }
                target="_blank"
                rel="noopener noreferrer"
                aria-label={ `${label} 프로필 열기` }
                sx={{
                  color: 'rgba(255,255,255,0.45)',
                  width: 44,
                  height: 44,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: '#FFFFFF',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                }}
              >
                { icon }
              </IconButton>
            </Tooltip>
          )) }
        </Box>
      </Container>

      {/* 스크롤 유도 화살표 — 클릭하면 About Me 섹션으로 이동 */}
      <Box
        component="button"
        onClick={ () => handleScrollTo('section-about') }
        aria-label="다음 섹션으로 스크롤"
        sx={{
          position: 'absolute',
          bottom: { xs: 20, md: 32 },
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255,255,255,0.3)',
          animation: 'bounceDown 1.8s ease-in-out infinite',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          p: 1,
          minWidth: 44,
          minHeight: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.2s ease',
          '&:hover': {
            color: 'rgba(255,255,255,0.7)',
          },
        }}
      >
        <KeyboardArrowDownIcon sx={{ fontSize: { xs: 28, md: 32 } }} />
      </Box>
    </Box>
  );
}

export default HeroSection;
