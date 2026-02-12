import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

const MENU_ITEMS = ['홈', '소개', '상품', '연락처', '설정'];

/**
 * Section09FlexNavigation 컴포넌트
 *
 * Flexbox로 구현한 네비게이션 바
 * 로고(왼쪽)와 메뉴(오른쪽)를 space-between으로 양 끝 정렬
 *
 * Example usage:
 * <Section09FlexNavigation />
 */
function Section09FlexNavigation() {
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
        09. Flex Navigation
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: 'text.secondary', mb: 3 }}
      >
        Flexbox space-between으로 로고·메뉴 양 끝 정렬
      </Typography>

      {/* 네비게이션 바 */}
      <Box
        sx={{
          width: '100%',
          height: 60,
          backgroundColor: '#2d3748',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2, md: 3 },
        }}
      >
        {/* 로고 박스 */}
        <Box>
          <Typography
            sx={{
              color: '#fff',
              fontWeight: 700,
              fontSize: '20px',
            }}
          >
            MyWebsite
          </Typography>
        </Box>

        {/* 메뉴들 박스 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
          }}
        >
          {MENU_ITEMS.map((menu) => (
            <Box
              key={menu}
              component="span"
              sx={{
                color: '#a0aec0',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'color 0.25s ease',
                '&:hover': {
                  color: '#fff',
                },
              }}
            >
              {menu}
            </Box>
          ))}
        </Box>
      </Box>

      <Divider sx={{ mt: 6 }} />
    </Box>
  );
}

export default Section09FlexNavigation;
