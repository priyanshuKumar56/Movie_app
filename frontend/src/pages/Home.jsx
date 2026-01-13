import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, Container, IconButton, Tooltip, Menu, MenuItem, Avatar, CircularProgress } from '@mui/material';
import { PlayArrowRounded,  InfoOutlined, SearchRounded, NotificationsRounded, ArrowDropDownRounded, AdminPanelSettingsRounded, LogoutRounded, PersonRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchTrendingMovies } from '../app/slices/movieSlice';
import { logout } from '../app/slices/authSlice';
import MovieRow from '../components/movies/MovieRow';
import LazyRow from '../components/movies/LazyRow';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // We only need trending for hero and first row initially
  const { trending, loading } = useSelector((state) => state.movies);
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Initial fetch only for hero and trending
    dispatch(fetchTrendingMovies(10));
    
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch]);

  const heroMovie = trending[0];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (loading && trending.length === 0) {
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
            height: { xs: '85vh', md: '100vh' },
            width: '100%',
            backgroundImage: `url(${"https://s1.ticketm.net/dam/a/07e/5f4c4838-fbca-431a-abbe-187f0fdf507e_TABLET_LANDSCAPE_LARGE_16_9.jpg" || heroMovie.posterUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            overflow: 'hidden'
          }}
        >
          {/* Enhanced Gradient Overlays */}
          <Box sx={{ 
            position: 'absolute', inset: 0,
            background: `radial-gradient(circle at 70% 20%, transparent 0%, #050505 150%),
                         linear-gradient(to top, #050505 0%, rgba(5,5,5,0.6) 15%, transparent 50%),
                         linear-gradient(to right, #050505 0%, rgba(5,5,5,0.8) 30%, transparent 70%)`
          }} />

          <Container maxWidth="xl" sx={{ height: '100%', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2 }}>
            <Box sx={{ maxWidth: 800, mt: { xs: 0, md: -10 }, px: { xs: 2, md: 0 } }}>
               <Box 
                 sx={{ 
                   display: 'inline-flex', 
                   alignItems: 'center', 
                   gap: 1, 
                   mb: 3, 
                   bgcolor: 'rgba(229, 9, 20, 0.2)', 
                   border: '1px solid rgba(229, 9, 20, 0.5)', 
                   px: 2, py: 0.5, 
                   borderRadius: 50,
                   backdropFilter: 'blur(5px)'
                 }}
               >
                 <Typography variant="caption" sx={{ color: '#E50914', fontWeight: 800, letterSpacing: 1 }}>
                    #1 in Movies Today
                 </Typography>
               </Box>

              <Typography 
                variant="h1" 
                sx={{ 
                  fontFamily: 'Space Grotesk', 
                  fontWeight: 800, 
                  fontSize: { xs: '3rem', md: '6rem' },
                  lineHeight: 0.9,
                  mb: 3,
                  textShadow: '0 20px 60px rgba(0,0,0,0.8)',
                  background: 'linear-gradient(to right, #fff, #bbb)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {heroMovie.title}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mb: 4, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                   <Typography variant="subtitle1" sx={{ color: '#46d369', fontWeight: 800 }}>
                     {parseInt(heroMovie.rating * 10)}% Match
                   </Typography>
                </Box>
                <Typography variant="subtitle1" sx={{ color: '#eee' }}>
                  {new Date(heroMovie.releaseDate).getFullYear()}
                </Typography>
                <Box sx={{ px: 1, border: '1px solid #666', borderRadius: 0.5, color: '#ccc', fontSize: '0.8rem' }}>
                   4K Ultra HD
                </Box>
                <Typography variant="subtitle1" sx={{ color: '#eee' }}>
                  {Math.floor(heroMovie.duration / 60)}h {heroMovie.duration % 60}m
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#ccc', display: 'flex', gap: 1 }}>
                  {heroMovie.genres?.slice(0, 3).map((g, i) => (
                    <span key={i} style={{ position: 'relative' }}>
                       {i > 0 && <span style={{ marginRight: 8, color: '#555' }}>•</span>}
                       {g}
                    </span>
                  ))}
                </Typography>
              </Box>

              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)', 
                  mb: 5, 
                  lineHeight: 1.6,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  maxWidth: 700,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textShadow: '0 2px 5px rgba(0,0,0,0.8)'
                }}
              >
                {heroMovie.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2.5 }}>
                <Button 
                  variant="contained" 
                  size="large"
                  startIcon={<PlayArrowRounded sx={{ fontSize: 30 }} />}
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'black', 
                    px: 6, py: 1.8, 
                    fontWeight: 800,
                    borderRadius: 2,
                    fontSize: '1.2rem',
                    boxShadow: '0 0 30px rgba(255,255,255,0.2)',
                    transition: 'all 0.3s',
                    '&:hover': { bgcolor: '#e0e0e0', transform: 'scale(1.03)', boxShadow: '0 0 50px rgba(255,255,255,0.4)' }
                  }}
                >
                  Play
                </Button>
                <Button 
                  variant="contained" 
                  size="large"
                  startIcon={<InfoOutlined />}
                  onClick={() => navigate(`/movies/${heroMovie._id}`)}
                  sx={{ 
                    bgcolor: 'rgba(109, 109, 110, 0.7)', 
                    color: 'white', 
                    px: 5, py: 1.8, 
                    fontWeight: 700,
                    borderRadius: 2,
                    fontSize: '1.2rem',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.3s',
                    '&:hover': { bgcolor: 'rgba(109, 109, 110, 0.4)', transform: 'scale(1.03)' }
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
      <Box sx={{ mt: { xs: -5, md: -10 }, position: 'relative', zIndex: 10, pb: 10, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* Trending First (Preloaded) */}
        {trending.length > 0 && (
          <Box sx={{ mb: 4 }}>
             <MovieRow title="🔥 Trending Now" movies={trending} />
          </Box>
        )}

        {/* Lazy Loaded Rows */}
        <LazyRow id="topRated" title="⭐ Top Rated Classics" sort="-rating" />
        <LazyRow id="newReleases" title="🆕 New Arrivals" sort="-releaseDate" />
        <LazyRow id="action" title="💥 High Octane Action" genre="Action" />
        <LazyRow id="scifi" title="🚀 Sci-Fi & Other Worlds" genre="Sci-Fi" />
        <LazyRow id="drama" title="🎭 Critically Acclaimed Dramas" genre="Drama" />
        <LazyRow id="comedy" title="🤣 Laugh Out Loud" genre="Comedy" />
        <LazyRow id="horror" title="👻 Chills & Thrills" genre="Horror" />
        <LazyRow id="thriller" title="🔪 Edge of Your Seat" genre="Thriller" />
        <LazyRow id="romance" title="❤️ Love is in the Air" genre="Romance" />
      </Box>
    </Box>
  );
};

export default Home;
