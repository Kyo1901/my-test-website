import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import HeroSection from '../components/landing/hero-section';
import ContactInfo from '../components/landing/contact-info';
import Guestbook from '../components/landing/guestbook';
import ProjectCard from '../components/landing/project-card';
import { supabase } from '../utils/supabase-client';
import { usePortfolio, getCategoryMeta } from '../utils/portfolio-context';

/** 공통 섹션 헤더 */
function SectionHeader({ label, title, description }) {
  return (
    <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
      <Typography
        variant="overline"
        sx={{ color: 'var(--color-primary)', fontWeight: 600, letterSpacing: 2 }}
      >
        { label }
      </Typography>
      <Box
        aria-hidden="true"
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
      { title && (
        <Typography
          variant="h5"
          sx={{
            color: 'var(--color-text-primary)',
            fontWeight: 600,
            fontSize: { xs: '1.2rem', md: '1.5rem' },
            mb: 1,
          }}
        >
          { title }
        </Typography>
      ) }
      { description && (
        <Typography
          sx={{
            color: 'var(--color-text-secondary)',
            fontSize: { xs: '0.9rem', md: '1rem' },
            lineHeight: 1.6,
          }}
        >
          { description }
        </Typography>
      ) }
    </Box>
  );
}

function HomePage() {
  const { getHomeData } = usePortfolio();

  const { content: homeContent, skills: topSkills, basicInfo } = useMemo(
    () => getHomeData(),
    [getHomeData],
  );

  const devStory = homeContent.find((s) => s.id === 'dev-story') ?? null;

  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState(false);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .limit(3);

      if (error) {
        setProjectsError(true);
      } else if (data) {
        setFeaturedProjects(data);
      }
      setIsProjectsLoading(false);
    };

    fetchFeaturedProjects();
  }, []);

  return (
    <Box>
      {/* Hero 섹션 */}
      <HeroSection />

      {/* About Me 섹션 */}
      <Box id="section-about" sx={{ bgcolor: 'var(--color-bg-secondary)', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
          <SectionHeader label="About Me" />

          <Box sx={{ animation: 'fadeInUp 0.5s ease forwards' }}>
            <Grid container spacing={4} alignItems="flex-start">
              {/* 개발 스토리 요약 */}
              <Grid size={{ xs: 12, md: 7 }}>
                { devStory ? (
                  <>
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'var(--color-text-primary)',
                        fontWeight: 700,
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        mb: 1.5,
                      }}
                    >
                      { devStory.title }
                    </Typography>
                    <Typography
                      sx={{
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.8,
                        fontSize: { xs: '0.9rem', md: '1rem' },
                      }}
                    >
                      { devStory.summary }
                    </Typography>
                  </>
                ) : (
                  <Typography sx={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    소개 내용을 준비 중입니다.
                  </Typography>
                ) }
              </Grid>

              {/* 프로필 카드 */}
              <Grid size={{ xs: 12, md: 5 }}>
                <Card
                  sx={{
                    border: '1px solid var(--color-border-light)',
                    boxShadow: 'none',
                    borderRadius: 3,
                  }}
                >
                  <CardContent
                    sx={{
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      '&:last-child': { pb: 3 },
                    }}
                  >
                    <Avatar
                      src={ basicInfo.photo || undefined }
                      alt={ basicInfo.photo ? `${basicInfo.name} 프로필 사진` : `${basicInfo.name} 프로필` }
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: 'var(--color-bg-secondary)',
                        border: '2px dashed var(--color-border)',
                        mb: 2,
                      }}
                    >
                      { !basicInfo.photo && (
                        <PersonIcon sx={{ fontSize: 36, color: 'var(--color-text-muted)' }} aria-hidden="true" />
                      ) }
                    </Avatar>
                    <Typography
                      sx={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-primary)', mb: 0.5 }}
                    >
                      { basicInfo.name }
                    </Typography>
                    <Typography sx={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', mb: 1 }}>
                      { basicInfo.education } { basicInfo.major }
                    </Typography>
                    <Chip
                      label={ basicInfo.experience }
                      size="small"
                      sx={{
                        bgcolor: 'var(--color-bg-primary)',
                        color: 'var(--color-text-secondary)',
                        fontSize: '0.78rem',
                        height: 22,
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* 주요 스킬 4개 */}
            <Box
              role="list"
              aria-label="주요 기술 스택"
              sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 4 }}
            >
              { topSkills.map((skill) => {
                const meta = getCategoryMeta(skill.category);
                return (
                  <Chip
                    key={ skill.id }
                    role="listitem"
                    label={ `${skill.name}  ${skill.level}%` }
                    size="small"
                    sx={{
                      bgcolor: meta.bg,
                      color: meta.color,
                      fontWeight: 600,
                      fontSize: '0.78rem',
                      border: `1px solid ${meta.color}30`,
                    }}
                  />
                );
              }) }
            </Box>

            <Box sx={{ mt: 3 }}>
              <Button
                component={Link}
                to="/about"
                variant="contained"
                aria-label="About Me 페이지로 이동"
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
                더 알아보기 &rsaquo;
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Skill Tree 섹션 */}
      <Box sx={{ bgcolor: 'var(--color-bg-primary)', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
          <SectionHeader label="Skill Tree" description="주요 기술 스택입니다." />

          <Grid
            container
            spacing={2}
            sx={{ mb: 5, animation: 'fadeInUp 0.5s ease 0.1s forwards', opacity: 0 }}
            aria-label="주요 기술 스택 목록"
          >
            { topSkills.map((skill) => {
              const meta = getCategoryMeta(skill.category);
              const abbr = skill.name.length <= 3
                ? skill.name.toUpperCase()
                : skill.name.slice(0, 3).toUpperCase();
              return (
                <Grid key={ skill.id } size={{ xs: 6, sm: 3 }}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: { xs: 2, md: 3 },
                      borderRadius: 3,
                      bgcolor: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border-light)',
                      transition: 'box-shadow 0.2s, transform 0.2s',
                      '&:hover': {
                        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <Box
                      aria-hidden="true"
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: 2,
                        bgcolor: meta.bg,
                        mx: 'auto',
                        mb: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        color: meta.color,
                        letterSpacing: '-0.5px',
                      }}
                    >
                      { abbr }
                    </Box>
                    <Typography
                      sx={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-primary)', mb: 0.25 }}
                    >
                      { skill.name }
                    </Typography>
                    <Typography
                      aria-label={ `숙련도 ${skill.level}퍼센트` }
                      sx={{ color: meta.color, fontWeight: 600, fontSize: '0.85rem' }}
                    >
                      { skill.level }%
                    </Typography>
                  </Box>
                </Grid>
              );
            }) }
          </Grid>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              component={Link}
              to="/about"
              variant="outlined"
              aria-label="About Me 페이지에서 전체 스킬 보기"
              sx={{
                borderColor: 'var(--color-button-primary)',
                color: 'var(--color-button-primary)',
                borderRadius: '980px',
                textTransform: 'none',
                px: 4,
                py: 1,
                fontSize: '0.9rem',
                '&:hover': {
                  borderColor: 'var(--color-button-hover)',
                  color: 'var(--color-button-hover)',
                  bgcolor: 'rgba(0, 113, 227, 0.04)',
                },
              }}
            >
              전체 스킬 보기 &rsaquo;
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Projects 프리뷰 섹션 */}
      <Box id="section-projects" sx={{ bgcolor: 'var(--color-bg-secondary)', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <SectionHeader
            label="Projects"
            title="대표 프로젝트"
            description="직접 기획하고 개발한 프로젝트들입니다."
          />

          { isProjectsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress sx={{ color: 'var(--color-primary)' }} aria-label="프로젝트 로딩 중" />
            </Box>
          ) : projectsError ? (
            <Typography
              sx={{ textAlign: 'center', color: 'var(--color-text-muted)', py: 6, fontSize: '0.95rem' }}
            >
              프로젝트를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
            </Typography>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                gap: 3,
                mb: 5,
              }}
            >
              { featuredProjects.map((project) => (
                <ProjectCard key={ project.id } project={ project } />
              )) }
            </Box>
          ) }

          <Box sx={{ textAlign: 'center' }}>
            <Button
              component={Link}
              to="/projects"
              variant="contained"
              aria-label="전체 프로젝트 페이지로 이동"
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
      <Box id="section-contact" sx={{ bgcolor: 'var(--color-bg-primary)', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
          <SectionHeader label="Contact" description="궁금한 점이 있으시면 편하게 연락주세요." />
          <ContactInfo />
          <Guestbook />
        </Container>
      </Box>
    </Box>
  );
}

export default HomePage;
