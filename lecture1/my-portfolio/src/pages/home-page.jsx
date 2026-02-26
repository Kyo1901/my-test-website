import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';
import ContactInfo from '../components/landing/contact-info';
import Guestbook from '../components/landing/guestbook';
import ProjectCard from '../components/landing/project-card';
import { supabase } from '../utils/supabase-client';

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
];

function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .limit(3);

      if (!error && data) setFeaturedProjects(data);
      setIsProjectsLoading(false);
    };

    fetchFeaturedProjects();
  }, []);

  return (
    <Box>
      {/* 플레이스홀더 섹션 (Hero / About Me / Skill Tree) */}
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

      {/* Projects 프리뷰 섹션 */}
      <Box sx={{ bgcolor: 'var(--color-bg-secondary)', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          {/* 섹션 헤더 */}
          <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
            <Typography
              variant="overline"
              sx={{ color: 'var(--color-primary)', fontWeight: 600, letterSpacing: 2 }}
            >
              Projects
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
              variant="h5"
              sx={{
                color: 'var(--color-text-primary)',
                fontWeight: 600,
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                mb: 1,
              }}
            >
              대표 프로젝트
            </Typography>
            <Typography
              sx={{
                color: 'var(--color-text-secondary)',
                fontSize: { xs: '0.9rem', md: '1rem' },
                lineHeight: 1.6,
              }}
            >
              직접 기획하고 개발한 프로젝트들입니다.
            </Typography>
          </Box>

          {/* 프로젝트 카드 그리드 */}
          {isProjectsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress sx={{ color: 'var(--color-primary)' }} />
            </Box>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)',
                },
                gap: 3,
                mb: 5,
              }}
            >
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </Box>
          )}

          {/* 더 보기 버튼 */}
          <Box sx={{ textAlign: 'center' }}>
            <Button
              component={Link}
              to="/projects"
              variant="contained"
              sx={{
                bgcolor: 'var(--color-button-primary)',
                color: '#FFFFFF',
                borderRadius: '980px',
                textTransform: 'none',
                px: 4,
                py: 1,
                fontSize: '0.9rem',
                boxShadow: 'none',
                '&:hover': { bgcolor: 'var(--color-button-hover)', boxShadow: 'none' },
              }}
            >
              전체 프로젝트 보기 &rsaquo;
            </Button>
          </Box>
        </Container>
      </Box>

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
