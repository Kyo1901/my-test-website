import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import SkillSection from '../components/landing/skill-section';
import ScrollReveal from '../components/ui/scroll-reveal';
import { usePortfolio } from '../utils/portfolio-context';

function AboutPage() {
  const { aboutMeData } = usePortfolio();
  const { basicInfo, sections } = aboutMeData;

  const [expanded, setExpanded] = useState('dev-story');

  const handleAccordionChange = useCallback((panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: 'var(--color-bg-primary)',
        py: { xs: 6, md: 10 },
      }}
    >
      <Container maxWidth="md">
        {/* 섹션 헤더 */}
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
          <Typography
            variant="overline"
            sx={{ color: 'var(--color-primary)', fontWeight: 600, letterSpacing: 2 }}
          >
            About Me
          </Typography>
          <Box
            sx={{
              width: 40,
              height: 3,
              bgcolor: 'var(--color-primary)',
              borderRadius: 2,
              mx: 'auto',
              mt: 1,
            }}
          />
        </Box>

        {/* 기본 정보 카드 */}
        <ScrollReveal>
        <Card
          sx={{
            mb: 5,
            border: '1px solid var(--color-border-light)',
            boxShadow: 'none',
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Grid container spacing={3} alignItems="center">
              <Grid size={{ xs: 12, md: 3 }} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Avatar
                  src={ basicInfo.photo || undefined }
                  alt={ basicInfo.photo ? `${basicInfo.name} 프로필 사진` : undefined }
                  sx={{
                    width: { xs: 96, md: 120 },
                    height: { xs: 96, md: 120 },
                    bgcolor: 'var(--color-bg-secondary)',
                    border: '2px dashed var(--color-border)',
                  }}
                >
                  { !basicInfo.photo && (
                    <PersonIcon sx={{ fontSize: 48, color: 'var(--color-text-muted)' }} aria-hidden="true" />
                  ) }
                </Avatar>
              </Grid>

              <Grid size={{ xs: 12, md: 9 }}>
                <Typography
                  variant="h4"
                  sx={{
                    color: 'var(--color-text-primary)',
                    fontWeight: 700,
                    fontSize: { xs: '1.6rem', md: '2rem' },
                    mb: 2,
                  }}
                >
                  { basicInfo.name }
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SchoolIcon sx={{ fontSize: 18, color: 'var(--color-primary)' }} aria-hidden="true" />
                    <Typography
                      sx={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}
                    >
                      { basicInfo.education } { basicInfo.major }
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WorkIcon sx={{ fontSize: 18, color: 'var(--color-primary)' }} aria-hidden="true" />
                    <Chip
                      label={ basicInfo.experience }
                      size="small"
                      sx={{
                        bgcolor: 'var(--color-bg-secondary)',
                        color: 'var(--color-text-secondary)',
                        fontSize: '0.8rem',
                        height: 24,
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        </ScrollReveal>

        {/* 기술 스택 */}
        <ScrollReveal delay={0.05}>
          <SkillSection />
        </ScrollReveal>

        {/* 콘텐츠 섹션 아코디언 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1.5 }}>
          { sections.map((section, index) => (
            <ScrollReveal key={ section.id } delay={ index * 0.1 }>
            <Accordion
              key={ section.id }
              expanded={ expanded === section.id }
              onChange={ handleAccordionChange(section.id) }
              sx={{
                border: '1px solid var(--color-border-light)',
                borderRadius: '12px !important',
                boxShadow: 'none',
                '&:before': { display: 'none' },
                '&.Mui-expanded': {
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                },
              }}
            >
              <AccordionSummary
                expandIcon={ <ExpandMoreIcon sx={{ color: 'var(--color-primary)' }} /> }
                aria-controls={ `${section.id}-content` }
                id={ `${section.id}-header` }
                sx={{
                  px: { xs: 2.5, md: 3 },
                  '& .MuiAccordionSummary-content': { my: 1.5 },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography
                    sx={{
                      color: 'var(--color-text-primary)',
                      fontWeight: 600,
                      fontSize: { xs: '0.95rem', md: '1rem' },
                    }}
                  >
                    { section.title }
                  </Typography>
                  { section.showInHome && (
                    <Chip
                      label="홈 표시"
                      size="small"
                      sx={{
                        bgcolor: 'rgba(0, 113, 227, 0.1)',
                        color: 'var(--color-primary)',
                        fontSize: '0.7rem',
                        height: 20,
                        fontWeight: 500,
                      }}
                    />
                  ) }
                </Box>
              </AccordionSummary>
              <AccordionDetails
                id={ `${section.id}-content` }
                role="region"
                aria-labelledby={ `${section.id}-header` }
                sx={{ px: { xs: 2.5, md: 3 }, pb: 3 }}
              >
                <Typography
                  sx={{
                    color: 'var(--color-text-secondary)',
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    lineHeight: 1.8,
                  }}
                >
                  { section.content }
                </Typography>
              </AccordionDetails>
            </Accordion>
            </ScrollReveal>
          )) }
        </Box>
      </Container>
    </Box>
  );
}

export default AboutPage;
