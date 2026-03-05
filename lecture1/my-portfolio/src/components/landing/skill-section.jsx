import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import { usePortfolio, getCategoryMeta } from '../../utils/portfolio-context';

/**
 * SkillCard 컴포넌트
 *
 * Props:
 * @param {object} skill - 스킬 데이터 객체 [Required]
 * @param {boolean} isAnimated - 프로그레스 바 애니메이션 활성화 여부 [Required]
 *
 * Example usage:
 * <SkillCard skill={skill} isAnimated={true} />
 */
const SkillCard = React.memo(function SkillCard({ skill, isAnimated }) {
  const meta = getCategoryMeta(skill.category);
  const abbr = skill.name.length <= 3 ? skill.name.toUpperCase() : skill.name.slice(0, 3).toUpperCase();

  return (
    <Tooltip title={ skill.description } arrow placement="top" enterDelay={300}>
      <Card
        sx={{
          border: '1px solid var(--color-border-light)',
          boxShadow: 'none',
          borderRadius: 2.5,
          cursor: 'default',
          transition: 'box-shadow 0.2s, transform 0.2s',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                aria-hidden="true"
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  bgcolor: meta.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.68rem',
                  color: meta.color,
                  flexShrink: 0,
                  letterSpacing: '-0.5px',
                }}
              >
                { abbr }
              </Box>
              <Box>
                <Typography
                  sx={{
                    color: 'var(--color-text-primary)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    lineHeight: 1.2,
                  }}
                >
                  { skill.name }
                </Typography>
                <Typography sx={{ color: 'var(--color-text-muted)', fontSize: '0.72rem' }}>
                  { skill.category }
                </Typography>
              </Box>
            </Box>
            <Typography
              aria-label={ `${skill.name} 숙련도 ${skill.level}퍼센트` }
              sx={{ color: meta.color, fontWeight: 700, fontSize: '0.9rem' }}
            >
              { skill.level }%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={ isAnimated ? skill.level : 0 }
            aria-label={ `${skill.name} 숙련도` }
            aria-valuenow={ skill.level }
            aria-valuemin={0}
            aria-valuemax={100}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: meta.bg,
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                bgcolor: meta.color,
                transition: 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1) !important',
              },
            }}
          />
        </CardContent>
      </Card>
    </Tooltip>
  );
});

function SkillSection() {
  const { aboutMeData } = usePortfolio();
  const skills = aboutMeData.skills;

  const [sortBy, setSortBy] = useState('category');
  const [topN, setTopN] = useState(null);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleSortChange = useCallback((type) => setSortBy(type), []);
  const handleTopNChange = useCallback((n) => setTopN(n), []);

  const getDisplayedSkills = useCallback(() => {
    let result = [...skills];
    if (sortBy === 'level') {
      result.sort((a, b) => b.level - a.level);
    }
    if (topN) {
      result = result.slice(0, topN);
    }
    return result;
  }, [skills, sortBy, topN]);

  const getGroupedSkills = useCallback(() => {
    return getDisplayedSkills().reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {});
  }, [getDisplayedSkills]);

  const sortedSkills = getDisplayedSkills();
  const groupedSkills = getGroupedSkills();

  return (
    <Box sx={{ mt: 5 }}>
      {/* 헤더 */}
      <Typography
        sx={{
          color: 'var(--color-text-primary)',
          fontWeight: 700,
          fontSize: { xs: '1rem', md: '1.1rem' },
          mb: 2.5,
        }}
      >
        기술 스택
      </Typography>

      {/* 필터 컨트롤 */}
      <Box
        role="group"
        aria-label="스킬 정렬 및 필터"
        sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}
      >
        { ['category', 'level'].map((type) => (
          <Chip
            key={ type }
            label={ type === 'category' ? '카테고리순' : '숙련도순' }
            size="small"
            onClick={ () => handleSortChange(type) }
            aria-pressed={ sortBy === type }
            sx={{
              bgcolor: sortBy === type ? 'var(--color-primary)' : 'var(--color-bg-secondary)',
              color: sortBy === type ? '#fff' : 'var(--color-text-secondary)',
              fontWeight: sortBy === type ? 600 : 400,
              cursor: 'pointer',
              '&:hover': { opacity: 0.85 },
            }}
          />
        )) }
        { [null, 3, 5].map((n) => (
          <Chip
            key={ n ?? 'all' }
            label={ n ? `상위 ${n}개` : '전체' }
            size="small"
            onClick={ () => handleTopNChange(n) }
            aria-pressed={ topN === n }
            sx={{
              bgcolor: topN === n ? 'var(--color-secondary)' : 'var(--color-bg-secondary)',
              color: topN === n ? '#fff' : 'var(--color-text-secondary)',
              fontWeight: topN === n ? 600 : 400,
              cursor: 'pointer',
              '&:hover': { opacity: 0.85 },
            }}
          />
        )) }
      </Box>

      {/* 스킬 그리드 */}
      { sortBy === 'category' ? (
        Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <Box key={ category } sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Box
                aria-hidden="true"
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: getCategoryMeta(category).color,
                }}
              />
              <Typography
                sx={{
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                }}
              >
                { category }
              </Typography>
            </Box>
            <Grid container spacing={2}>
              { categorySkills.map((skill) => (
                <Grid key={ skill.id } size={{ xs: 12, sm: 6, lg: 4 }}>
                  <SkillCard skill={ skill } isAnimated={ isAnimated } />
                </Grid>
              )) }
            </Grid>
          </Box>
        ))
      ) : (
        <Grid container spacing={2}>
          { sortedSkills.map((skill) => (
            <Grid key={ skill.id } size={{ xs: 12, sm: 6, lg: 4 }}>
              <SkillCard skill={ skill } isAnimated={ isAnimated } />
            </Grid>
          )) }
        </Grid>
      ) }
    </Box>
  );
}

export default SkillSection;
