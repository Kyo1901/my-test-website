import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import GitHubIcon from '@mui/icons-material/GitHub';
import ImageIcon from '@mui/icons-material/Image';

/**
 * ProjectCard 컴포넌트
 * 프로젝트 썸네일 카드 (16:9 이미지 + 제목 + 설명 + 기술스택 + 버튼)
 *
 * Props:
 * @param {object} project - 프로젝트 데이터 [Required]
 * @param {number} project.id - 프로젝트 고유 ID
 * @param {string} project.title - 프로젝트 제목
 * @param {string} project.description - 프로젝트 설명
 * @param {string[]} project.tech_stack - 기술 스택 배열
 * @param {string} project.detail_url - 배포된 사이트 URL
 * @param {string} project.thumbnail_url - 썸네일 이미지 URL (image.thum.io)
 * @param {string} [project.github_url] - GitHub 저장소 URL [Optional]
 *
 * Example usage:
 * <ProjectCard project={projectData} />
 */
function ProjectCard({ project }) {
  const { title, description, tech_stack = [], detail_url, thumbnail_url, github_url } = project;
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <Box
      sx={{
        border: '1px solid var(--color-border)',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'var(--color-bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px) scale(1.01)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
        },
      }}
    >
      {/* 썸네일 영역 (16:9 비율) */}
      <Box
        sx={{
          position: 'relative',
          paddingTop: '56.25%',
          overflow: 'hidden',
          bgcolor: 'var(--color-bg-secondary)',
        }}
      >
        {/* 스켈레톤 (이미지 로딩 중일 때만 표시) */}
        {!imgLoaded && !imgError && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              '@keyframes shimmer': {
                '0%': { backgroundPosition: '200% 0' },
                '100%': { backgroundPosition: '-200% 0' },
              },
            }}
          />
        )}

        {/* 에러 상태 */}
        {imgError && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 1,
              color: 'var(--color-text-muted)',
            }}
          >
            <ImageIcon sx={{ fontSize: 40, opacity: 0.4 }} />
            <Typography sx={{ fontSize: '0.75rem', opacity: 0.6 }}>
              미리보기 없음
            </Typography>
          </Box>
        )}

        {/* 실제 이미지 */}
        {!imgError && (
          <Box
            component="img"
            src={thumbnail_url}
            alt={title}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: imgLoaded ? 1 : 0,
              transition: 'opacity 0.4s ease, transform 0.3s ease',
              '&:hover': { transform: 'scale(1.03)' },
            }}
          />
        )}
      </Box>

      {/* 정보 영역 */}
      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {/* 제목 */}
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '0.95rem',
            color: 'var(--color-text-primary)',
            mb: 0.75,
            lineHeight: 1.4,
          }}
        >
          {title}
        </Typography>

        {/* 설명 (2줄 clamp) */}
        <Typography
          sx={{
            fontSize: '0.82rem',
            color: 'var(--color-text-secondary)',
            mb: 1.5,
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {description}
        </Typography>

        {/* 기술 스택 칩 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {tech_stack.map((tech) => (
            <Chip
              key={tech}
              label={tech}
              size="small"
              sx={{
                fontSize: '0.68rem',
                height: 20,
                bgcolor: 'var(--color-bg-secondary)',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 1,
                '& .MuiChip-label': { px: 1 },
              }}
            />
          ))}
        </Box>

        {/* 버튼 (하단 고정) */}
        <Box sx={{ display: 'flex', gap: 1, mt: 'auto', flexWrap: 'wrap' }}>
          {detail_url && (
            <Button
              href={detail_url}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              size="small"
              endIcon={<OpenInNewIcon sx={{ fontSize: '0.8rem !important' }} />}
              sx={{
                bgcolor: 'var(--color-button-primary)',
                color: '#fff',
                borderRadius: '980px',
                textTransform: 'none',
                fontSize: '0.78rem',
                px: 2,
                py: 0.6,
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: 'var(--color-button-hover)',
                  boxShadow: '0 2px 8px rgba(0,113,227,0.3)',
                },
              }}
            >
              Live Demo
            </Button>
          )}
          {github_url && (
            <Button
              href={github_url}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              size="small"
              startIcon={<GitHubIcon sx={{ fontSize: '0.9rem !important' }} />}
              sx={{
                color: 'var(--color-text-secondary)',
                borderColor: 'var(--color-border)',
                borderRadius: '980px',
                textTransform: 'none',
                fontSize: '0.78rem',
                px: 2,
                py: 0.6,
                '&:hover': {
                  borderColor: 'var(--color-text-primary)',
                  color: 'var(--color-text-primary)',
                  bgcolor: 'transparent',
                },
              }}
            >
              GitHub
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ProjectCard;
