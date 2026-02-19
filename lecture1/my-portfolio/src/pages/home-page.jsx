import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import ContactInfo from '../components/landing/contact-info';
import Guestbook from '../components/landing/guestbook';

const sections = [
  {
    id: 'hero',
    title: 'Hero',
    description: '여기는 Hero 섹션입니다. 메인 비주얼, 이름, 간단 소개가 들어갈 예정입니다.',
    dark: false,
  },
  {
    id: 'about',
    title: 'About Me',
    description: '여기는 About Me 섹션입니다. 간단한 자기소개와 \'더 알아보기\' 버튼이 들어갈 예정입니다.',
    dark: false,
    alt: true,
    link: { label: '더 알아보기', to: '/about' },
  },
  {
    id: 'skills',
    title: 'Skill Tree',
    description: '여기는 Skill Tree 섹션입니다. 기술 스택을 트리나 프로그레스바로 시각화할 예정입니다.',
    dark: false,
  },
  {
    id: 'projects',
    title: 'Projects',
    description: '여기는 Projects 섹션입니다. 대표작 썸네일 3-4개와 \'더 보기\' 버튼이 들어갈 예정입니다.',
    dark: false,
    alt: true,
    link: { label: '더 보기', to: '/projects' },
  },
];

function HomePage() {
  return (
    <Box>
      {/* 플레이스홀더 섹션 (Hero ~ Projects) */}
      {sections.map((section) => (
        <Box
          key={section.id}
          sx={{
            bgcolor: section.dark
              ? 'var(--color-bg-dark)'
              : section.alt
                ? 'var(--color-bg-secondary)'
                : 'var(--color-bg-primary)',
            py: { xs: 8, md: 12 },
          }}
        >
          <Container
            maxWidth="md"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="overline"
              sx={{
                color: section.dark ? 'var(--color-primary-light)' : 'var(--color-primary)',
                fontWeight: 600,
                letterSpacing: 2,
                mb: 1,
              }}
            >
              {section.title}
            </Typography>
            <Box
              sx={{
                width: 40,
                height: 3,
                bgcolor: 'var(--color-primary)',
                borderRadius: 2,
                mb: 3,
              }}
            />
            <Typography
              variant="h5"
              sx={{
                color: section.dark ? '#F5F5F7' : 'var(--color-text-primary)',
                fontWeight: 500,
                mb: 2,
                fontSize: { xs: '1.1rem', md: '1.4rem' },
                lineHeight: 1.6,
              }}
            >
              {section.description}
            </Typography>
            {section.link && (
              <Button
                component={Link}
                to={section.link.to}
                variant="contained"
                sx={{
                  mt: 2,
                  bgcolor: 'var(--color-button-primary)',
                  color: '#FFFFFF',
                  borderRadius: '980px',
                  textTransform: 'none',
                  px: 4,
                  py: 1,
                  fontSize: '0.9rem',
                  '&:hover': { bgcolor: 'var(--color-button-hover)' },
                }}
              >
                {section.link.label} &rsaquo;
              </Button>
            )}
          </Container>
        </Box>
      ))}

      {/* Contact 섹션 */}
      <Box sx={{ bgcolor: 'var(--color-bg-primary)', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
          {/* 섹션 헤더 */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="overline"
              sx={{ color: 'var(--color-primary)', fontWeight: 600, letterSpacing: 2 }}
            >
              Contact
            </Typography>
            <Box
              sx={{
                width: 40,
                height: 3,
                bgcolor: 'var(--color-primary)',
                borderRadius: 2,
                mx: 'auto',
                mt: 1,
                mb: 2,
              }}
            />
            <Typography
              sx={{
                color: 'var(--color-text-secondary)',
                fontSize: { xs: '0.9rem', md: '1rem' },
                lineHeight: 1.6,
              }}
            >
              궁금한 점이 있으시면 편하게 연락주세요.
            </Typography>
          </Box>

          {/* 연락처 + SNS */}
          <ContactInfo />

          {/* 방명록 */}
          <Guestbook />
        </Container>
      </Box>
    </Box>
  );
}

export default HomePage;
