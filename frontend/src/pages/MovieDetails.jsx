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
          height: '85vh', 
          position: 'relative',
          backgroundImage: `url(${currentMovie.backdropUrl || currentMovie.posterUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
         <Box sx={{ 
            position: 'absolute', inset: 0,
            background: `linear-gradient(to top, #0a0a0a 0%, #0a0a0a 5%, transparent 60%),
                         linear-gradient(to right, #0a0a0a 0%, rgba(10,10,10,0.8) 30%, transparent 80%)`
          }} />

        <Container maxWidth="xl" sx={{ height: '100%', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2 }}>
            <Box sx={{ maxWidth: 800, mt: 10 }}>
                <Typography variant="h1" sx={{ fontFamily: 'Space Grotesk', fontWeight: 800, mb: 2, fontSize: { xs: '3rem', md: '5rem' }, lineHeight: 0.9 }}>
                    {currentMovie.title}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ color: '#46d369', fontWeight: 800 }}>
                        {parseInt(currentMovie.rating * 10)}% Match
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: '#ccc' }}>
                        {new Date(currentMovie.releaseDate).getFullYear()}
                    </Typography>
                    <Box sx={{ px: 1, border: '1px solid #666', borderRadius: 0.5, color: '#ccc', fontSize: '0.8rem' }}>
                        HD
                    </Box>
                    <Typography variant="subtitle1" sx={{ color: '#ccc' }}>
                        {currentMovie.duration} min
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                    <Button 
                        variant="contained" 
                        startIcon={<PlayArrowRounded sx={{ fontSize: 32 }} />} 
                        sx={{ 
                            bgcolor: 'white', color: 'black', 
                            px: 5, py: 1.5, 
                            fontWeight: 700, fontSize: '1.2rem',
                            borderRadius: 2,
                            '&:hover': { bgcolor: '#e0e0e0', transform: 'scale(1.05)' } 
                        }}
                    >
                        Play
                    </Button>
                    <Button 
                        variant="contained" 
                        startIcon={isInWatchlist ? <InfoOutlined /> : <AddRounded />} 
                        onClick={handleWatchlistToggle}
                        sx={{ 
                            bgcolor: 'rgba(109, 109, 110, 0.7)', 
                            color: 'white', 
                            px: 4, py: 1.5, 
                            fontWeight: 600, fontSize: '1.1rem',
                            borderRadius: 2,
                            backdropFilter: 'blur(10px)',
                            '&:hover': { bgcolor: 'rgba(109, 109, 110, 0.5)', transform: 'scale(1.05)' }
                        }}
                    >
                        {isInWatchlist ? 'Remove from List' : 'My List'}
                    </Button>
                </Box>
                
                <Typography variant="body1" sx={{ color: '#ccc', mb: 4, lineHeight: 1.6, maxWidth: 700, fontSize: '1.1rem' }}>
                    {currentMovie.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 4 }}>
                   <Box>
                       <Typography variant="caption" color="#777">Starring</Typography>
                       <Typography variant="body2" color="#ddd">
                          {currentMovie.cast?.map(c => c.name).slice(0, 3).join(', ') || 'Unknown'}
                       </Typography>
                   </Box>
                   <Box>
                       <Typography variant="caption" color="#777">Genres</Typography>
                       <Typography variant="body2" color="#ddd">
                           {currentMovie.genres?.join(', ')}
                       </Typography>
                   </Box>
                </Box>
            </Box>
        </Container>
      </Box>

      {/* ===== DETAILED INFO SECTION ===== */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Grid container spacing={6}>
            <Grid item xs={12} md={8}>
                 <Typography variant="h5" sx={{ fontFamily: 'Space Grotesk', fontWeight: 700, mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <div style={{ width: 4, height: 24, background: '#E50914', borderRadius: 2 }} />
                    Cast & Crew
                 </Typography>
                 
                 <Box sx={{ display: 'flex', gap: 3, overflowX: 'auto', pb: 2, scrollbarWidth: 'none' }}>
                    {currentMovie.cast?.map((c, i) => (
                        <Box key={i} sx={{ minWidth: 140, textAlign: 'center' }}>
                            <Avatar 
                                src={c.profileUrl} 
                                sx={{ width: 100, height: 100, mb: 1, mx: 'auto', border: '2px solid #333' }}
                            />
                            <Typography variant="body2" fontWeight="bold">{c.name}</Typography>
                            <Typography variant="caption" color="gray">{c.character}</Typography>
                        </Box>
                    ))}
                    {(!currentMovie.cast || currentMovie.cast.length === 0) && (
                        <Typography color="gray">No cast information available.</Typography>
                    )}
                 </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
                <Box sx={{ p: 3, bgcolor: '#111', borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight="bold" mb={2}>Movie Info</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                        <Typography color="gray">Director</Typography>
                        <Typography>{currentMovie.director || 'Unknown'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                        <Typography color="gray">Language</Typography>
                        <Typography>English</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                        <Typography color="gray">Maturity Rating</Typography>
                        <Typography sx={{ border: '1px solid gray', px: 0.5, fontSize: '0.8rem' }}>TV-MA</Typography>
                    </Box>
                </Box>
            </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MovieDetails;
