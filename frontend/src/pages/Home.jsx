
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, Container, IconButton, TextField, InputAdornment, Menu, MenuItem, Avatar, CircularProgress, Tooltip } from '@mui/material';
import { PlayArrowRounded, AddRounded, InfoOutlined, SearchRounded, NotificationsRounded, ArrowDropDownRounded, AdminPanelSettingsRounded, LogoutRounded, PersonRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchMovies, fetchTrendingMovies } from '../app/slices/movieSlice';
import { logout } from '../app/slices/authSlice';
import MovieRow from '../components/movies/MovieRow';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { movies, trending, loading } = useSelector((state) => state.movies);
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    dispatch(fetchMovies({ page: 1, limit: 50, sort: '-rating' }));
    dispatch(fetchTrendingMovies(10));
    
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch]);

  const heroMovie = trending[0] || movies[0];

  // Categorize movies
  const topRated = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 15);
  const newReleases = [...movies].sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)).slice(0, 15);
  const actionMovies = movies.filter(m => m.genres?.includes('Action')).slice(0, 15);
  const dramaMovies = movies.filter(m => m.genres?.includes('Drama')).slice(0, 15);
  const sciFiMovies = movies.filter(m => m.genres?.includes('Sci-Fi')).slice(0, 15);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (loading && movies.length === 0) {
    return <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#050505' }}><CircularProgress sx={{ color: '#00D1FF' }} /></Box>;
  }

  return (
    <Box sx={{ bgcolor: '#050505', minHeight: '100vh', color: 'white', fontFamily: "'Outfit', sans-serif" }}>
      
      {/* ===== NAVBAR ===== */}
      <Box sx={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000, 
        bgcolor: isScrolled ? 'rgba(5,5,5,0.95)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(15px)' : 'none',
        transition: 'all 0.4s ease',
        borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
        py: 1.5,
        px: { xs: 2, md: 6 }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Left: Logo + Nav Links */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontFamily: 'Space Grotesk', 
                fontWeight: 800, 
                cursor: 'pointer',
                background: 'linear-gradient(45deg, #fff, #00D1FF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }} 
              onClick={() => navigate('/')}
            >
              Cine<span style={{ WebkitTextFillColor: '#00D1FF' }}>Sphere</span>
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
              {['Home', 'Movies', 'Top 250', 'My List'].map((item) => (
                <Typography 
                  key={item} 
                  variant="body2"
                  sx={{ 
                    cursor: 'pointer', 
                    fontWeight: 500, 
                    color: item === 'Home' ? 'white' : '#aaa',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#00D1FF' }
                  }}
                  onClick={() => item === 'Movies' || item === 'Top 250' ? navigate('/search') : null}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          </Box>

          {/* Right: Search + Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Search">
              <IconButton onClick={() => navigate('/search')} sx={{ color: 'white', '&:hover': { color: '#00D1FF' } }}>
                <SearchRounded />
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <IconButton sx={{ color: 'white', '&:hover': { color: '#00D1FF' } }}>
                <NotificationsRounded />
              </IconButton>
            </Tooltip>
            <Box 
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 1, bgcolor: 'rgba(255,255,255,0.05)', p: 0.5, pr: 1.5, borderRadius: '50px', border: '1px solid transparent', '&:hover': { border: '1px solid rgba(255,255,255,0.2)' } }}
            >
              <Avatar src={user?.avatar} sx={{ width: 32, height: 32, border: '2px solid #00D1FF' }} />
              <ArrowDropDownRounded sx={{ color: '#aaa' }} />
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              PaperProps={{ 
                sx: { 
                  bgcolor: '#111', 
                  color: 'white', 
                  border: '1px solid #333', 
                  mt: 1.5,
                  minWidth: 180,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                } 
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => { setAnchorEl(null); navigate('/profile'); }} sx={{ gap: 2 }}>
                <PersonRounded fontSize="small" /> Profile
              </MenuItem>
              {user?.role === 'ADMIN' && (
                <MenuItem onClick={() => { setAnchorEl(null); navigate('/admin'); }} sx={{ gap: 2, color: '#E50914' }}>
                  <AdminPanelSettingsRounded fontSize="small" /> Admin Panel
                </MenuItem>
              )}
              <MenuItem onClick={handleLogout} sx={{ gap: 2, color: '#aaa' }}>
                <LogoutRounded fontSize="small" /> Sign Out
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>

      {/* ===== HERO BANNER ===== */}
      {heroMovie && (
        <Box 
          sx={{ 
            position: 'relative',
            height: '90vh',
            width: '100%',
            backgroundImage: `url(${heroMovie.backdropUrl || heroMovie.posterUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            overflow: 'hidden'
          }}
        >
          {/* Gradient Overlays */}
          <Box sx={{ 
            position: 'absolute', inset: 0,
            background: `linear-gradient(to top, #050505 0%, rgba(5,5,5,0.8) 20%, transparent 60%),
                         linear-gradient(to right, rgba(5,5,5,0.9) 0%, rgba(5,5,5,0.4) 50%, transparent 100%)`
          }} />

          <Container maxWidth="xl" sx={{ height: '100%', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2 }}>
            <Box sx={{ maxWidth: 700, mt: 10 }}>
              <Typography 
                variant="h1" 
                sx={{ 
                  fontFamily: 'Space Grotesk', 
                  fontWeight: 800, 
                  fontSize: { xs: '3rem', md: '5rem' },
                  lineHeight: 1,
                  mb: 2,
                  textShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}
              >
                {heroMovie.title}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
                <Typography variant="subtitle1" sx={{ color: '#00D1FF', fontWeight: 700, bgcolor: 'rgba(0,209,255,0.1)', px: 1, borderRadius: 1 }}>
                  {heroMovie.rating} IMDb
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#ccc' }}>
                  {new Date(heroMovie.releaseDate).getFullYear()}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#ccc' }}>•</Typography>
                <Typography variant="subtitle1" sx={{ color: '#ccc' }}>
                  {heroMovie.genres?.slice(0, 3).join(', ')}
                </Typography>
              </Box>

              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  mb: 5, 
                  lineHeight: 1.8,
                  fontSize: '1.1rem',
                  maxWidth: 600,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {heroMovie.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  size="large"
                  startIcon={<PlayArrowRounded />}
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'black', 
                    px: 5, py: 1.5, 
                    fontWeight: 700,
                    borderRadius: '8px',
                    fontSize: '1.1rem',
                    '&:hover': { bgcolor: '#e0e0e0', transform: 'scale(1.05)' }
                  }}
                >
                  Play Now
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  startIcon={<InfoOutlined />}
                  onClick={() => navigate(`/movies/${heroMovie._id}`)}
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.3)', 
                    color: 'white', 
                    px: 4, py: 1.5, 
                    fontWeight: 600,
                    borderRadius: '8px',
                    fontSize: '1.1rem',
                    backdropFilter: 'blur(10px)',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)', borderColor: 'white' }
                  }}
                >
                  More Info
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>
      )}

      {/* ===== MOVIE ROWS ===== */}
      <Box sx={{ mt: -15, position: 'relative', zIndex: 10, pb: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {trending.length > 0 && <MovieRow title="🔥 Trending Now" movies={trending} />}
        {topRated.length > 0 && <MovieRow title="⭐ Top Rated Classics" movies={topRated} />}
        {newReleases.length > 0 && <MovieRow title="🆕 New Arrivals" movies={newReleases} />}
        {actionMovies.length > 0 && <MovieRow title="💥 High Octane Action" movies={actionMovies} />}
        {sciFiMovies.length > 0 && <MovieRow title="🚀 Sci-Fi & Other Worlds" movies={sciFiMovies} />}
        {dramaMovies.length > 0 && <MovieRow title="🎭 Critically Acclaimed Dramas" movies={dramaMovies} />}
      </Box>
    </Box>
  );
};

export default Home;
