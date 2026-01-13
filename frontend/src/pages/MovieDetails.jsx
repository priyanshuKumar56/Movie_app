import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, Grid, Chip, Avatar, CircularProgress, Container, IconButton, Menu, MenuItem } from '@mui/material';
import { PlayArrowRounded, AddRounded, StarRounded, ArrowDropDownRounded, ArrowBackRounded, InfoOutlined } from '@mui/icons-material';
import { fetchMovieById } from '../app/slices/movieSlice';
import { logout, addToWatchlist, removeFromWatchlist } from '../app/slices/authSlice';

const MovieDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentMovie, loading } = useSelector((state) => state.movies);
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    dispatch(fetchMovieById(id));
  }, [dispatch, id]);

  const isInWatchlist = user?.watchlist?.some(item => (item._id || item) === id);

  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(id));
    } else {
      dispatch(addToWatchlist(id));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (loading || !currentMovie) {
    return <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#0a0a0a' }}><CircularProgress sx={{ color: '#00D1FF' }} /></Box>;
  }

  return (
    <Box sx={{ bgcolor: '#0a0a0a', minHeight: '100vh', color: 'white' }}>
      
      {/* ===== NAVBAR ===== */}
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, bgcolor: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(10px)', py: 1.5, px: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/browse')} sx={{ color: 'white' }}><ArrowBackRounded /></IconButton>
            <Typography variant="h5" sx={{ fontFamily: 'Space Grotesk', fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate('/browse')}>
              Cine<span style={{ color: '#00D1FF' }}>Sphere</span>
            </Typography>
          </Box>
          <Box onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <Avatar src={user?.avatar} sx={{ width: 32, height: 32 }} />
            <ArrowDropDownRounded />
          </Box>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} PaperProps={{ sx: { bgcolor: '#111', color: 'white' } }}>
            <MenuItem onClick={() => { setAnchorEl(null); navigate('/profile'); }}>Profile</MenuItem>
            {user?.role === 'ADMIN' && <MenuItem onClick={() => { setAnchorEl(null); navigate('/admin'); }}>Admin Panel</MenuItem>}
            <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* ===== HERO BACKDROP ===== */}
      <Box 
        sx={{ 
          height: '75vh', 
          position: 'relative',
          backgroundImage: `linear-gradient(to top, #0a0a0a, transparent), linear-gradient(to right, #0a0a0a 0%, transparent 50%), url(${currentMovie.backdropUrl || currentMovie.posterUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end',
          px: 6,
          pb: 6
        }}
      >
        <Box sx={{ maxWidth: 700 }}>
          <Typography variant="h2" sx={{ fontFamily: 'Space Grotesk', fontWeight: 800, mb: 2, fontSize: { xs: '2.5rem', md: '4rem' } }}>
            {currentMovie.title}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
            <Chip icon={<StarRounded sx={{ color: '#FFD700 !important' }} />} label={`${currentMovie.rating} IMDb`} sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }} />
            <Chip label={`${currentMovie.duration} min`} sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }} />
            <Chip label={new Date(currentMovie.releaseDate).getFullYear()} sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }} />
          </Box>

          <Typography variant="body1" sx={{ color: '#ccc', mb: 4, lineHeight: 1.7, maxWidth: 600, fontSize: '1.1rem' }}>
            {currentMovie.description}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" startIcon={<PlayArrowRounded />} sx={{ bgcolor: 'white', color: 'black', px: 5, py: 1.5, fontWeight: 700, '&:hover': { bgcolor: '#e0e0e0' } }}>
              Watch Now
            </Button>
            <Button 
              variant="outlined" 
              startIcon={isInWatchlist ? <InfoOutlined /> : <AddRounded />} 
              onClick={handleWatchlistToggle}
              sx={{ 
                borderColor: isInWatchlist ? '#00D1FF' : 'white', 
                color: isInWatchlist ? '#00D1FF' : 'white', 
                px: 4, 
                py: 1.5, 
                fontWeight: 600,
                '&:hover': { borderColor: '#00D1FF', color: '#00D1FF' }
              }}
            >
              {isInWatchlist ? 'In Watchlist' : 'Add to List'}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* ===== DETAILS SECTION ===== */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" sx={{ fontFamily: 'Space Grotesk', fontWeight: 700, mb: 3 }}>About This Movie</Typography>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" color="gray" gutterBottom>Genres</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {currentMovie.genres?.map(g => (
                  <Chip key={g} label={g} variant="outlined" sx={{ color: '#00D1FF', borderColor: '#00D1FF' }} />
                ))}
              </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" color="gray" gutterBottom>Director</Typography>
              <Typography>{currentMovie.director || 'Unknown'}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ p: 4, bgcolor: '#111', borderRadius: 3, border: '1px solid #222' }}>
              <Typography variant="h6" sx={{ mb: 3, fontFamily: 'Space Grotesk' }}>Cast</Typography>
              {currentMovie.cast?.slice(0, 5).map((c, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar src={c.profileUrl} />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">{c.name}</Typography>
                    <Typography variant="caption" color="gray">{c.character}</Typography>
                  </Box>
                </Box>
              ))}
              {(!currentMovie.cast || currentMovie.cast.length === 0) && (
                <Typography color="gray">Cast information not available.</Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MovieDetails;
