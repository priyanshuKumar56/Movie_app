import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, IconButton, Box, Avatar, Menu, MenuItem, InputBase, Badge } from '@mui/material';
import { Search, Notifications, ArrowDropDown, Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../app/slices/authSlice';
import { styled, alpha } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';

// Styled Search Component
const SearchContainer = styled('div')(({ theme, isOpen }) => ({
  position: 'relative',
  borderRadius: 0,
  backgroundColor: isOpen ? 'rgba(0, 0, 0, 0.75)' : 'transparent',
  border: isOpen ? '1px solid #fff' : 'none',
  marginLeft: theme.spacing(1),
  width: isOpen ? '280px' : '30px',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: theme.spacing(1),
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue)}`);
    }
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  
  const handleLogout = () => {
    handleMenuClose();
    dispatch(logout());
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/search?type=movie' },
    { name: 'Tv Shows', path: '/search?type=tv' }, // Placeholder for future
    { name: 'New & Popular', path: '/trending' },
    { name: 'My List', path: '/profile' },
  ];

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: isScrolled ? '#141414' : 'linear-gradient(to bottom, rgba(0,0,0,0.7) 10%, rgba(0,0,0,0) 100%)',
        boxShadow: isScrolled ? 4 : 'none',
        transition: 'background 0.5s ease-in-out',
        zIndex: 1200
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: '56px', sm: '64px' } }}>
        
        {/* Left Section: Logo & Nav */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
          >
            <Box 
              component="img" 
              src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" 
              alt="Logo"
              sx={{ height: { xs: 20, sm: 30 }, cursor: 'pointer' }}
              onClick={() => navigate('/')}
            />
          </motion.div>

          {/* Desktop Nav */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {navLinks.map((link) => (
              <Button
                key={link.name}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(link.path);
                }}
                sx={{ 
                  color: location.pathname === link.path ? '#fff' : '#e5e5e5', 
                  fontWeight: location.pathname === link.path ? 700 : 400,
                  fontSize: '0.9rem',
                  textTransform: 'none',
                  '&:hover': { color: '#b3b3b3' }
                }}
              >
                {link.name}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Right Section: Search, Notifs, Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          
          {/* Search Bar */}
          <SearchContainer isOpen={searchOpen}>
            <IconButton 
              sx={{ color: 'white', p: 0.5 }} 
              onClick={() => {
                 if (searchOpen && searchValue) handleSearchSubmit({ preventDefault: () => {} });
                 else setSearchOpen(!searchOpen);
              }}
            >
              <Search />
            </IconButton>
            <AnimatePresence>
              {searchOpen && (
                <motion.form 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '100%', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  onSubmit={handleSearchSubmit}
                  style={{ width: '100%' }}
                >
                  <SearchInput
                    placeholder="Titles, people, genres"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    autoFocus
                  />
                </motion.form>
              )}
            </AnimatePresence>
          </SearchContainer>

          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <IconButton sx={{ color: 'white', display: { xs: 'none', sm: 'block' } }}>
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>

              {/* Profile Menu */}
              <Box 
                onClick={handleMenuOpen}
                sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 0.5 }}
              >
                <Avatar 
                  src={user?.avatar || "https://i.pravatar.cc/300"} 
                  variant="rounded"
                  sx={{ width: 32, height: 32 }}
                />
                <ArrowDropDown sx={{ color: 'white', transition: 'transform 0.3s', transform: anchorEl ? 'rotate(180deg)' : 'rotate(0)' }} />
              </Box>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: { mt: 1.5, bgcolor: 'rgba(0,0,0,0.9)', color: 'white', border: '1px solid #333' }
                }}
              >
                <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>Account</MenuItem>
                {user?.role === 'ADMIN' && (
                  <MenuItem onClick={() => { handleMenuClose(); navigate('/admin'); }}>Admin Dashboard</MenuItem>
                )}
                <MenuItem onClick={handleMenuClose}>Help Center</MenuItem>
                <MenuItem onClick={handleLogout} sx={{ borderTop: '1px solid #333' }}>Sign out of Netflix</MenuItem>
              </Menu>
            </>
          ) : (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate('/login')}
              sx={{ fontWeight: 'bold' }}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
