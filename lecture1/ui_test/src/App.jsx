import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Section01Button from './components/sections/section-01-button';
import Section02Input from './components/sections/section-02-input';
import Section03Navigation from './components/sections/section-03-navigation';
import Section04Dropdown from './components/sections/section-04-dropdown';
import Section05Animation from './components/sections/section-05-animation';
import Section06Hover from './components/sections/section-06-hover';
import Section07Swipe from './components/sections/section-07-swipe';
import Section08Sidebar from './components/sections/section-08-sidebar';
import Section09FlexNavigation from './components/sections/section-09-flex-navigation';

/**
 * App 컴포넌트
 *
 * 16개 UI 섹션을 순차적으로 표시하는 메인 레이아웃
 * 각 섹션은 src/components/sections/ 에서 import하여 추가
 */
function App() {
  return (
    <Box sx={{
      width: '100%',
      minHeight: '100vh',
      py: { xs: 2, md: 4 },
      backgroundColor: 'background.default',
    }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 1,
            fontSize: { xs: '1.8rem', md: '2.5rem' },
          }}
        >
          UI Components Test
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            mb: 4,
            fontSize: { xs: '0.9rem', md: '1rem' },
          }}
        >
          16개 UI 요소를 섹션별로 테스트하는 페이지입니다.
        </Typography>

        <Divider sx={{ mb: 4 }} />

        {/* === 섹션 추가 영역 === */}
        <Section01Button />
        <Section02Input />
        <Section03Navigation />
        <Section04Dropdown />
        <Section05Animation />
        <Section06Hover />
        <Section07Swipe />
        <Section08Sidebar />
        <Section09FlexNavigation />

      </Container>
    </Box>
  );
}

export default App;
