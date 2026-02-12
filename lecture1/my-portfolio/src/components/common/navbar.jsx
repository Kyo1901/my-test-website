import { Link, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function Navbar() {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About Me', path: '/about' },
    { label: 'Projects', path: '/projects' },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: 'var(--color-bg-dark)',
        boxShadow: 'none',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', maxWidth: 'md', width: '100%', mx: 'auto' }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            color: '#FFFFFF',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: { xs: '1rem', md: '1.2rem' },
          }}
        >
          Portfolio
        </Typography>
        <Box sx={{ display: 'flex', gap: { xs: 0.5, md: 1 } }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              sx={{
                color: location.pathname === item.path
                  ? 'var(--color-primary-light)'
                  : '#A1A1A6',
                fontSize: { xs: '0.75rem', md: '0.9rem' },
                fontWeight: location.pathname === item.path ? 600 : 400,
                textTransform: 'none',
                minWidth: 'auto',
                px: { xs: 1, md: 2 },
                '&:hover': { color: '#FFFFFF' },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
