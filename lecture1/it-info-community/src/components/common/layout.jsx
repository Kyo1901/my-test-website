import Box from '@mui/material/Box';
import Header from './header.jsx';
import Footer from './footer.jsx';

/**
 * Layout 컴포넌트
 *
 * Props:
 * @param {React.ReactNode} children - 레이아웃 내부에 표시할 콘텐츠 [Required]
 *
 * Example usage:
 * <Layout><HomePage /></Layout>
 */
function Layout({ children }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        bgcolor: 'background.default',
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          flex: 1,
          width: '100%',
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
}

export default Layout;
