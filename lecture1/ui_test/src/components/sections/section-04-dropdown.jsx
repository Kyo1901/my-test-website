import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

const CATEGORIES = [
  { value: 'frontend', label: '프론트엔드' },
  { value: 'backend', label: '백엔드' },
  { value: 'mobile', label: '모바일' },
  { value: 'devops', label: 'DevOps' },
  { value: 'data', label: '데이터 분석' },
  { value: 'ai', label: '인공지능' },
];

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
];

const LEVELS = [
  { value: 'beginner', label: '입문' },
  { value: 'junior', label: '주니어' },
  { value: 'mid', label: '미드레벨' },
  { value: 'senior', label: '시니어' },
  { value: 'lead', label: '리드' },
];

/**
 * Section04Dropdown 컴포넌트
 *
 * MUI Select를 3가지 카테고리(분야, 언어, 레벨)로 보여주고
 * 선택된 값을 실시간으로 하단에 표시하는 섹션
 *
 * Example usage:
 * <Section04Dropdown />
 */
function Section04Dropdown() {
  const [values, setValues] = useState({
    category: '',
    language: '',
    level: '',
  });

  const handleChange = (name) => (e) => {
    setValues((prev) => ({ ...prev, [name]: e.target.value }));
  };

  const dropdowns = [
    { name: 'category', label: '개발 분야', options: CATEGORIES },
    { name: 'language', label: '프로그래밍 언어', options: LANGUAGES },
    { name: 'level', label: '경력 수준', options: LEVELS },
  ];

  const selectedText = dropdowns
    .filter((d) => values[d.name])
    .map((d) => {
      const selected = d.options.find((o) => o.value === values[d.name]);
      return `${d.label}: ${selected.label}`;
    })
    .join(' / ');

  return (
    <Box sx={{ mb: 6 }}>
      <Typography
        variant="h5"
        component="h2"
        sx={{
          fontWeight: 600,
          mb: 1,
          fontSize: { xs: '1.2rem', md: '1.5rem' },
        }}
      >
        04. Dropdown (Select)
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: 'text.secondary', mb: 3 }}
      >
        Select + MenuItem / 선택값 실시간 표시
      </Typography>

      <Grid container spacing={4}>
        {dropdowns.map((dropdown) => (
          <Grid key={dropdown.name} size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel>{dropdown.label}</InputLabel>
              <Select
                value={values[dropdown.name]}
                label={dropdown.label}
                onChange={handleChange(dropdown.name)}
              >
                {dropdown.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 1,
          backgroundColor: 'action.hover',
          minHeight: 48,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: selectedText ? 'text.primary' : 'text.disabled' }}
        >
          {selectedText || '드롭다운에서 항목을 선택하면 여기에 표시됩니다.'}
        </Typography>
      </Box>

      <Divider sx={{ mt: 6 }} />
    </Box>
  );
}

export default Section04Dropdown;
