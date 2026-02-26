import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import ProjectCard from '../components/landing/project-card';
import { supabase } from '../utils/supabase-client';

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true });

      if (!error && data) setProjects(data);
      setIsLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <Box
      sx={{
        bgcolor: 'var(--color-bg-secondary)',
        minHeight: 'calc(100vh - 64px)',
        py: { xs: 6, md: 10 },
      }}
    >
      <Container maxWidth="lg">
        {/* 섹션 헤더 */}
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 8 } }}>
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
            variant="h4"
            sx={{
              color: 'var(--color-text-primary)',
              fontWeight: 700,
              fontSize: { xs: '1.6rem', md: '2rem' },
              mb: 1,
            }}
          >
            포트폴리오
          </Typography>
          <Typography
            sx={{
              color: 'var(--color-text-secondary)',
              fontSize: { xs: '0.9rem', md: '1rem' },
              lineHeight: 1.6,
            }}
          >
            직접 기획하고 개발한 프로젝트들을 소개합니다.
          </Typography>
        </Box>

        {/* 로딩 */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: 'var(--color-primary)' }} />
          </Box>
        ) : projects.length === 0 ? (
          <Typography
            sx={{
              textAlign: 'center',
              color: 'var(--color-text-secondary)',
              py: 10,
              fontSize: '1rem',
            }}
          >
            등록된 프로젝트가 없습니다.
          </Typography>
        ) : (
          /* 반응형 그리드: xs=1열 / sm=2열 / lg=3열 (각 행의 열 수 동일) */
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default ProjectsPage;
