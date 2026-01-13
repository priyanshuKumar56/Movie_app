import React, { useState } from 'react';
import { Container, Typography, Box, Avatar, Grid, Button, Paper, IconButton, Menu, MenuItem } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowBackRounded, ArrowDropDownRounded } from '@mui/icons-material';
import { logout } from '../app/slices/authSlice';
import MovieCard from '../components/movies/MovieCard';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!user) return null;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a0a', color: 'white' }}>
      
      {/* ===== NAVBAR ===== */}
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, bgcolor: '#0a0a0a', py: 1.5, px: 4, borderBottom: '1px solid #222' }}>
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
            {user?.role === 'ADMIN' && <MenuItem onClick={() => { setAnchorEl(null); navigate('/admin'); }}>Admin Panel</MenuItem>}
            <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* ===== PROFILE CONTENT ===== */}
      <Container maxWidth="lg" sx={{ pt: 12, pb: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, bgcolor: '#111', border: '1px solid #222', borderRadius: 3, textAlign: 'center' }}>
              <Avatar src={user.avatar} sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }} />
              <Typography variant="h5" fontWeight="bold">{user.name}</Typography>
              <Typography color="gray" gutterBottom>{user.email}</Typography>
              <Box sx={{ display: 'inline-block', bgcolor: '#00D1FF', color: 'black', px: 2, py: 0.5, borderRadius: 2, fontWeight: 'bold', mt: 1 }}>
                {user.role}
              </Box>
              <Button 
                fullWidth 
                variant="outlined" 
                onClick={handleLogout}
                sx={{ mt: 4, borderColor: '#ff4d4d', color: '#ff4d4d' }}
              >
                Sign Out
              </Button>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Typography variant="h5" sx={{ fontFamily: 'Space Grotesk', fontWeight: 700, mb: 3 }}>My Watchlist</Typography>
            <Grid container spacing={3}>
              {user.watchlist?.length > 0 ? (
                user.watchlist.map(movie => (
                  <Grid item xs={6} sm={4} md={3} key={movie._id}>
                    <MovieCard movie={movie} />
                  </Grid>
                ))
              ) : (
                <Box sx={{ width: '100%', py: 6, textAlign: 'center' }}>
                  <Typography color="gray">Your watchlist is empty. Start adding movies!</Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate('/browse')}
                    sx={{ mt: 2, bgcolor: '#00D1FF', color: 'black' }}
                  >
                    Browse Movies
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Profile;
