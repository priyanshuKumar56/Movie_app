import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Avatar, Grid, Button, Paper, 
  IconButton, Menu, MenuItem, CircularProgress, Dialog, 
  DialogTitle, DialogContent, DialogActions, TextField,
  Tab, Tabs, Divider
} from '@mui/material';
import { 
  ArrowBackRounded, ArrowDropDownRounded, EditRounded, 
  MovieFilterRounded, FavoriteRounded, HistoryRounded,
  SettingsRounded, LogoutRounded, CameraAltRounded
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, getProfile, updateProfile } from '../app/slices/authSlice'; // Ensure updateProfile is exported
import MovieCard from '../components/movies/MovieCard';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [openEdit, setOpenEdit] = useState(false);
  
  // Edit Form State
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleUpdateProfile = async () => {
    await dispatch(updateProfile(formData));
    setOpenEdit(false);
    dispatch(getProfile()); // Refresh data
  };

  if (loading && !user) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#050505' }}>
        <CircularProgress sx={{ color: '#00D1FF' }} />
      </Box>
    );
  }

  if (!user) return null;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#050505', color: 'white', pb: 10 }}>
      
      {/* ===== NAVBAR ===== */}
      <Box sx={{ 
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, 
        bgcolor: 'rgba(5,5,5,0.8)', backdropFilter: 'blur(10px)',
        py: 1.5, px: { xs: 2, md: 6 }, 
        borderBottom: '1px solid rgba(255,255,255,0.05)' 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/browse')} sx={{ color: 'white', '&:hover': { color: '#00D1FF' } }}>
              <ArrowBackRounded />
            </IconButton>
            <Typography variant="h5" sx={{ fontFamily: 'Space Grotesk', fontWeight: 800, cursor: 'pointer' }} onClick={() => navigate('/browse')}>
              Cine<span style={{ color: '#00D1FF' }}>Sphere</span>
            </Typography>
          </Box>
          
          <Box onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 1, bgcolor: 'rgba(255,255,255,0.05)', p: 0.5, pr: 1.5, borderRadius: '50px' }}>
            <Avatar src={user?.avatar} sx={{ width: 32, height: 32, border: '2px solid #00D1FF' }} />
            <ArrowDropDownRounded sx={{ color: '#aaa' }} />
          </Box>
          <Menu 
            anchorEl={anchorEl} 
            open={Boolean(anchorEl)} 
            onClose={() => setAnchorEl(null)} 
            PaperProps={{ sx: { bgcolor: '#111', color: 'white', border: '1px solid #333' } }}
          >
            <MenuItem onClick={handleLogout} sx={{ gap: 2 }}><LogoutRounded fontSize="small" /> Sign Out</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* ===== HEADER BANNER ===== */}
      <Box sx={{ 
        height: 250, 
        background: 'linear-gradient(to right, #000428, #004e92)',
        position: 'relative',
        mt: 8
      }}>
        <Box sx={{ 
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '100%', 
          background: 'linear-gradient(to top, #050505 0%, transparent 100%)' 
        }} />
      </Box>

      <Container maxWidth="xl" sx={{ mt: -10, position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4}>
          
          {/* ===== LEFT PROFILE CARD ===== */}
          <Grid item xs={12} md={3.5}>
            <Paper sx={{ 
              p: 4, 
              bgcolor: '#111', 
              border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: 4, 
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar 
                  src={user.avatar} 
                  sx={{ width: 140, height: 140, mx: 'auto', border: '4px solid #050505', boxShadow: '0 0 20px rgba(0,209,255,0.3)' }} 
                />
                <IconButton 
                  onClick={() => setOpenEdit(true)}
                  sx={{ 
                    position: 'absolute', bottom: 5, right: 5, 
                    bgcolor: '#00D1FF', color: 'black',
                    '&:hover': { bgcolor: '#fff' }
                  }}
                >
                  <CameraAltRounded fontSize="small" />
                </IconButton>
              </Box>
              
              <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Space Grotesk' }}>{user.name}</Typography>
              <Typography variant="body2" sx={{ color: '#888', mb: 3 }}>{user.email}</Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
                <Box sx={{ bgcolor: 'rgba(0,209,255,0.1)', color: '#00D1FF', px: 2, py: 0.5, borderRadius: 2, fontWeight: 700, fontSize: '0.8rem', border: '1px solid rgba(0,209,255,0.3)' }}>
                   {user.role}
                </Box>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: '#ccc', px: 2, py: 0.5, borderRadius: 2, fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                   Member since {new Date(user.createdAt || Date.now()).getFullYear()}
                </Box>
              </Box>

              <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
                 <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'white' }}>{user.watchlist?.length || 0}</Typography>
                    <Typography variant="caption" sx={{ color: '#888' }}>Watchlist</Typography>
                 </Box>
                 <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'white' }}>{user.favorites?.length || 0}</Typography>
                    <Typography variant="caption" sx={{ color: '#888' }}>Favorites</Typography>
                 </Box>
              </Box>

              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<EditRounded />}
                onClick={() => setOpenEdit(true)}
                sx={{ 
                  borderColor: '#333', color: '#fff', 
                  py: 1.2, borderRadius: 2,
                  '&:hover': { borderColor: '#00D1FF', color: '#00D1FF', bgcolor: 'rgba(0,209,255,0.05)' }
                }}
              >
                Edit Profile
              </Button>
            </Paper>
          </Grid>

          {/* ===== RIGHT CONTENT ===== */}
          <Grid item xs={12} md={8.5}>
            <Box sx={{ mb: 4 }}>
              <Tabs 
                value={tabValue} 
                onChange={(e, v) => setTabValue(v)} 
                textColor="primary" 
                indicatorColor="primary"
                sx={{ 
                  '& .MuiTab-root': { color: '#888', fontWeight: 600, fontSize: '1rem', textTransform: 'none' },
                  '& .Mui-selected': { color: '#00D1FF' }
                }}
              >
                <Tab icon={<MovieFilterRounded fontSize="small" />} iconPosition="start" label="My Watchlist" />
                <Tab icon={<FavoriteRounded fontSize="small" />} iconPosition="start" label="Favorites" />
                <Tab icon={<HistoryRounded fontSize="small" />} iconPosition="start" label="Watch History" disabled />
              </Tabs>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
            </Box>

            <Box sx={{ minHeight: 400 }}>
              {tabValue === 0 && (
                <Grid container spacing={2.5}>
                  {user.watchlist?.length > 0 ? (
                    user.watchlist.map(movie => (
                      <Grid item xs={6} sm={4} md={3} lg={2.4} key={movie._id || movie}>
                        <MovieCard movie={movie} />
                      </Grid>
                    ))
                  ) : (
                    <Box sx={{ width: '100%', py: 10, textAlign: 'center', opacity: 0.5 }}>
                      <MovieFilterRounded sx={{ fontSize: 60, mb: 2, color: '#333' }} />
                      <Typography variant="h6" color="#555">Your watchlist is empty</Typography>
                      <Button onClick={() => navigate('/browse')} sx={{ mt: 2, color: '#00D1FF' }}>Browse Movies</Button>
                    </Box>
                  )}
                </Grid>
              )}
              
              {tabValue === 1 && (
                <Grid container spacing={2.5}>
                   {user.favorites?.length > 0 ? (
                    user.favorites.map(movie => (
                      <Grid item xs={6} sm={4} md={3} lg={2.4} key={movie._id || movie}>
                        <MovieCard movie={movie} />
                      </Grid>
                    ))
                  ) : (
                     <Box sx={{ width: '100%', py: 10, textAlign: 'center', opacity: 0.5 }}>
                      <FavoriteRounded sx={{ fontSize: 60, mb: 2, color: '#333' }} />
                      <Typography variant="h6" color="#555">No favorites yet</Typography>
                    </Box>
                  )}
                </Grid>
              )}
            </Box>
          </Grid>

        </Grid>
      </Container>
      
      {/* ===== EDIT PROFILE MODAL ===== */}
      <Dialog 
        open={openEdit} 
        onClose={() => setOpenEdit(false)}
        PaperProps={{ sx: { bgcolor: '#1a1a1a', color: 'white', border: '1px solid #333', minWidth: { md: 400 } } }}
      >
        <DialogTitle sx={{ fontFamily: 'Space Grotesk', fontWeight: 700 }}>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField 
              label="Full Name" 
              fullWidth 
              variant="outlined" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ 
                '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: '#444' }, '&:hover fieldset': { borderColor: '#777' } },
                '& .MuiInputLabel-root': { color: '#888' }
              }}
            />
            <TextField 
              label="Avatar URL" 
              fullWidth 
              variant="outlined" 
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              helperText="Link to an image (e.g., from Imgur, Unsplash)"
              sx={{ 
                '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: '#444' }, '&:hover fieldset': { borderColor: '#777' } },
                '& .MuiInputLabel-root': { color: '#888' },
                '& .MuiFormHelperText-root': { color: '#555' }
              }}
            />
            {formData.avatar && (
              <Box sx={{ textAlign: 'center' }}>
                <Avatar src={formData.avatar} sx={{ width: 80, height: 80, mx: 'auto', border: '2px solid #555' }} />
                <Typography variant="caption" sx={{ color: '#555', mt: 1, display: 'block' }}>Preview</Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenEdit(false)} sx={{ color: '#888' }}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleUpdateProfile}
            sx={{ bgcolor: '#00D1FF', color: 'black', fontWeight: 700, px: 3, '&:hover': { bgcolor: '#33E0FF' } }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
