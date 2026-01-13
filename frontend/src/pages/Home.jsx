import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, Container, IconButton, TextField, InputAdornment, Menu, MenuItem, Avatar, CircularProgress } from '@mui/material';
import { PlayArrowRounded, AddRounded, InfoOutlined, SearchRounded, NotificationsRounded, ArrowDropDownRounded } from '@mui/icons-material';
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
    return <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#0a0a0a' }}><CircularProgress sx={{ color: '#00D1FF' }} /></Box>;
  }

  return (
    <Box sx={{ bgcolor: '#0a0a0a', minHeight: '100vh', color: 'white' }}>
      
      {/* ===== HOTSTAR-STYLE NAVBAR ===== */}
      <Box sx={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000, 
        bgcolor: isScrolled ? '#0a0a0a' : 'transparent',
        transition: 'all 0.3s',
        py: 1.5,
        px: 4
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Left: Logo + Nav Links */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Typography variant="h5" sx={{ fontFamily: 'Space Grotesk', fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate('/')}>
              Cine<span style={{ color: '#00D1FF' }}>Sphere</span>
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
              {['Home', 'Movies', 'Top 250', 'Genres'].map((item) => (
                <Typography 
                  key={item} 
                  sx={{ 
                    cursor: 'pointer', 
                    fontWeight: 500, 
                    color: item === 'Home' ? 'white' : '#888',
                    '&:hover': { color: 'white' }
                  }}
                  onClick={() => item === 'Movies' ? navigate('/search') : null}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          </Box>

          {/* Right: Search + Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/search')} sx={{ color: 'white' }}>
              <SearchRounded />
            </IconButton>
            <IconButton sx={{ color: 'white' }}>
              <NotificationsRounded />
            </IconButton>
            <Box 
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 0.5 }}
            >
              <Avatar src={user?.avatar} sx={{ width: 32, height: 32 }} />
              <ArrowDropDownRounded />
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              PaperProps={{ sx: { bgcolor: '#111', color: 'white', border: '1px solid #333' } }}
            >
              <MenuItem onClick={() => { setAnchorEl(null); navigate('/profile'); }}>Profile</MenuItem>
              {user?.role === 'ADMIN' && <MenuItem onClick={() => { setAnchorEl(null); navigate('/admin'); }}>Admin Panel</MenuItem>}
              <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>

      {/* ===== HERO BANNER (HOTSTAR STYLE) ===== */}
      {heroMovie && (
        <Box 
          sx={{ 
            position: 'relative',
            height: { xs: '70vh', md: '85vh' },
            width: '100%',
            backgroundImage: `linear-gradient(to right, #0a0a0a 0%, transparent 50%), linear-gradient(to top, #0a0a0a 0%, transparent 30%), url(${heroMovie.backdropUrl || heroMovie.posterUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'flex-end',
            pb: 8,
            px: 6
          }}
        >
          <Box sx={{ maxWidth: 600 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontFamily: 'Space Grotesk', 
                fontWeight: 800, 
                fontSize: { xs: '2rem', md: '3.5rem' },
                textShadow: '2px 2px 10px rgba(0,0,0,0.8)',
                mb: 1
              }}
            >
              {heroMovie.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
              <Typography variant="body1" sx={{ color: '#00D1FF', fontWeight: 600 }}>
                {heroMovie.genres?.slice(0, 2).join(' • ')}
              </Typography>
              <Typography variant="body1">•</Typography>
              <Typography variant="body1">{new Date(heroMovie.releaseDate).getFullYear()}</Typography>
            </Box>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#ccc', 
                mb: 3, 
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.6
              }}
            >
              {heroMovie.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                startIcon={<PlayArrowRounded />}
                sx={{ bgcolor: 'white', color: 'black', px: 4, py: 1.5, fontWeight: 700, '&:hover': { bgcolor: '#e0e0e0' } }}
              >
                Watch Now
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<InfoOutlined />}
                onClick={() => navigate(`/movies/${heroMovie._id}`)}
                sx={{ borderColor: 'white', color: 'white', px: 4, py: 1.5, fontWeight: 600 }}
              >
                More Info
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* ===== MOVIE ROWS (NETFLIX/HOTSTAR STYLE) ===== */}
      <Box sx={{ mt: -10, position: 'relative', zIndex: 10, pb: 8 }}>
        {trending.length > 0 && <MovieRow title="🔥 Trending Now" movies={trending} />}
        {topRated.length > 0 && <MovieRow title="⭐ Top Rated" movies={topRated} />}
        {newReleases.length > 0 && <MovieRow title="🆕 New Releases" movies={newReleases} />}
        {actionMovies.length > 0 && <MovieRow title="💥 Action & Adventure" movies={actionMovies} />}
        {dramaMovies.length > 0 && <MovieRow title="🎭 Award-Winning Dramas" movies={dramaMovies} />}
        {sciFiMovies.length > 0 && <MovieRow title="🚀 Sci-Fi & Fantasy" movies={sciFiMovies} />}
      </Box>
    </Box>
  );
};

export default Home;
