import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Paper, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Chip, Drawer, List, ListItem,
  ListItemIcon, ListItemText, Avatar, Divider
} from '@mui/material';
import { 
  DashboardRounded, 
  MovieRounded, 
  PeopleRounded,
  SettingsRounded,
  LogoutRounded,
  EditRounded,
  DeleteRounded,
  AddRounded,
  SyncRounded,
  TrendingUpRounded
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMovies, deleteMovie, createMovie, updateMovie } from '../app/slices/movieSlice';
import { logout } from '../app/slices/authSlice';

const drawerWidth = 260;

const Admin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { movies, loading } = useSelector((state) => state.movies);
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', rating: '', releaseDate: '', 
    duration: '', genres: '', posterUrl: '', backdropUrl: '',
    director: '', featured: false
  });

  useEffect(() => {
    dispatch(fetchMovies({ limit: 100 }));
  }, [dispatch]);

  const handleOpen = (movie = null) => {
    if (movie) {
      setEditingMovie(movie);
      setFormData({
        title: movie.title,
        description: movie.description || '',
        rating: movie.rating || '',
        releaseDate: movie.releaseDate ? movie.releaseDate.split('T')[0] : '',
        duration: movie.duration || '',
        genres: movie.genres?.join(', ') || '',
        posterUrl: movie.posterUrl || '',
        backdropUrl: movie.backdropUrl || '',
        director: movie.director || '',
        featured: movie.featured || false
      });
    } else {
      setEditingMovie(null);
      setFormData({ 
        title: '', description: '', rating: '', releaseDate: '', 
        duration: '', genres: '', posterUrl: '', backdropUrl: '',
        director: '', featured: false
      });
    }
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    const movieData = {
      ...formData,
      genres: formData.genres.split(',').map(g => g.trim()).filter(Boolean),
      rating: Number(formData.rating),
      duration: Number(formData.duration)
    };
    if (editingMovie) {
      await dispatch(updateMovie({ id: editingMovie._id, data: movieData }));
    } else {
      await dispatch(createMovie(movieData));
    }
    setOpenDialog(false);
    dispatch(fetchMovies({ limit: 100 }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this movie permanently?')) {
      await dispatch(deleteMovie(id));
      dispatch(fetchMovies({ limit: 100 }));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardRounded /> },
    { text: 'Movies', icon: <MovieRounded /> },
    { text: 'Users', icon: <PeopleRounded /> },
    { text: 'Settings', icon: <SettingsRounded /> },
  ];

  // Stats
  const totalMovies = movies.length;
  const avgRating = movies.length ? (movies.reduce((a, m) => a + m.rating, 0) / movies.length).toFixed(1) : 0;

  return (
    <Box sx={{ display: 'flex', bgcolor: '#050505', minHeight: '100vh' }}>
      
      {/* ===== SIDEBAR ===== */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': { 
            width: drawerWidth, 
            bgcolor: '#0d0d0d', 
            color: 'white', 
            borderRight: '1px solid #222' 
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ fontFamily: 'Space Grotesk', fontWeight: 700 }}>
            Cine<span style={{ color: '#00D1FF' }}>Sphere</span>
          </Typography>
          <Typography variant="caption" color="gray">Admin Panel</Typography>
        </Box>

        <Divider sx={{ borderColor: '#222' }} />

        <List sx={{ px: 2, mt: 2 }}>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text} 
              onClick={() => setActiveTab(item.text)}
              sx={{ 
                borderRadius: 2, 
                mb: 1,
                bgcolor: activeTab === item.text ? 'rgba(0, 209, 255, 0.1)' : 'transparent',
                color: activeTab === item.text ? '#00D1FF' : '#888',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: activeTab === item.text ? 600 : 400 }} />
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 'auto', p: 2 }}>
          <Box sx={{ p: 2, bgcolor: '#111', borderRadius: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={user?.avatar} />
              <Box>
                <Typography variant="body2" fontWeight="bold">{user?.name}</Typography>
                <Typography variant="caption" color="gray">Administrator</Typography>
              </Box>
            </Box>
          </Box>
          <Button 
            fullWidth 
            startIcon={<LogoutRounded />} 
            onClick={handleLogout}
            sx={{ color: '#ff4d4d', borderColor: '#ff4d4d', border: '1px solid' }}
          >
            Sign Out
          </Button>
        </Box>
      </Drawer>

      {/* ===== MAIN CONTENT ===== */}
      <Box component="main" sx={{ flexGrow: 1, p: 4, color: 'white' }}>
        <Typography variant="h4" sx={{ fontFamily: 'Space Grotesk', fontWeight: 700, mb: 4 }}>{activeTab}</Typography>

        {/* DASHBOARD TAB */}
        {activeTab === 'Dashboard' && (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 3, bgcolor: '#111', border: '1px solid #222', borderRadius: 3 }}>
                  <Typography variant="caption" color="gray">Total Movies</Typography>
                  <Typography variant="h4" sx={{ color: '#00D1FF', fontWeight: 'bold' }}>{totalMovies}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 3, bgcolor: '#111', border: '1px solid #222', borderRadius: 3 }}>
                  <Typography variant="caption" color="gray">Avg Rating</Typography>
                  <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold' }}>{avgRating} ★</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 3, bgcolor: '#111', border: '1px solid #222', borderRadius: 3 }}>
                  <Typography variant="caption" color="gray">Total Users</Typography>
                  <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>--</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 3, bgcolor: '#111', border: '1px solid #222', borderRadius: 3 }}>
                  <Typography variant="caption" color="gray">System Status</Typography>
                  <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>Online</Typography>
                </Paper>
              </Grid>
            </Grid>
            <Paper sx={{ p: 3, bgcolor: '#111', border: '1px solid #222', borderRadius: 3, minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="gray">Activity Chart (Coming Soon)</Typography>
            </Paper>
          </>
        )}

        {/* MOVIES TAB */}
        {activeTab === 'Movies' && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
              <Button variant="contained" startIcon={<AddRounded />} onClick={() => handleOpen()} sx={{ bgcolor: '#00D1FF', color: 'black', fontWeight: 700 }}>
                Add Movie
              </Button>
            </Box>
            <TableContainer component={Paper} sx={{ bgcolor: '#111', border: '1px solid #222' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#888' }}>Title</TableCell>
                    <TableCell sx={{ color: '#888' }}>Rating</TableCell>
                    <TableCell sx={{ color: '#888' }}>Year</TableCell>
                    <TableCell sx={{ color: '#888' }}>Genres</TableCell>
                    <TableCell sx={{ color: '#888' }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {movies.map((movie) => (
                    <TableRow key={movie._id} sx={{ '&:hover': { bgcolor: '#1a1a1a' } }}>
                      <TableCell sx={{ color: 'white', fontWeight: 500 }}>{movie.title}</TableCell>
                      <TableCell><Chip label={movie.rating} size="small" sx={{ bgcolor: '#222', color: '#FFD700' }} /></TableCell>
                      <TableCell sx={{ color: '#ccc' }}>{new Date(movie.releaseDate).getFullYear()}</TableCell>
                      <TableCell sx={{ color: '#ccc' }}>{movie.genres?.slice(0, 2).join(', ')}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpen(movie)} sx={{ color: '#00D1FF' }}><EditRounded /></IconButton>
                        <IconButton onClick={() => handleDelete(movie._id)} sx={{ color: '#ff4d4d' }}><DeleteRounded /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* USERS TAB */}
        {activeTab === 'Users' && (
          <Paper sx={{ p: 4, bgcolor: '#111', border: '1px solid #222', borderRadius: 3, textAlign: 'center' }}>
            <PeopleRounded sx={{ fontSize: 60, color: '#333', mb: 2 }} />
            <Typography color="gray">User Management (Coming Soon)</Typography>
          </Paper>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'Settings' && (
          <Paper sx={{ p: 4, bgcolor: '#111', border: '1px solid #222', borderRadius: 3, textAlign: 'center' }}>
            <SettingsRounded sx={{ fontSize: 60, color: '#333', mb: 2 }} />
            <Typography color="gray">System Settings (Coming Soon)</Typography>
          </Paper>
        )}
      </Box>

      {/* ===== ADD/EDIT MOVIE MODAL ===== */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#111', color: 'white', border: '1px solid #333' } }}>
        <DialogTitle sx={{ fontFamily: 'Space Grotesk' }}>{editingMovie ? 'Edit Movie' : 'Add New Movie'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Title" fullWidth value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} sx={{ input: { color: 'white' }, label: { color: 'gray' } }} />
            <Grid container spacing={2}>
              <Grid item xs={6}><TextField label="Rating (0-10)" type="number" fullWidth value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} sx={{ input: { color: 'white' }, label: { color: 'gray' } }} /></Grid>
              <Grid item xs={6}><TextField label="Duration (min)" type="number" fullWidth value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} sx={{ input: { color: 'white' }, label: { color: 'gray' } }} /></Grid>
            </Grid>
            <TextField label="Release Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={formData.releaseDate} onChange={e => setFormData({...formData, releaseDate: e.target.value})} sx={{ input: { color: 'white' }, label: { color: 'gray' } }} />
            <TextField label="Genres (comma separated)" fullWidth value={formData.genres} onChange={e => setFormData({...formData, genres: e.target.value})} sx={{ input: { color: 'white' }, label: { color: 'gray' } }} />
            <TextField label="Description" multiline rows={3} fullWidth value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} sx={{ textarea: { color: 'white' }, label: { color: 'gray' } }} />
            <TextField label="Poster URL" fullWidth value={formData.posterUrl} onChange={e => setFormData({...formData, posterUrl: e.target.value})} sx={{ input: { color: 'white' }, label: { color: 'gray' } }} />
            <TextField label="Backdrop URL" fullWidth value={formData.backdropUrl} onChange={e => setFormData({...formData, backdropUrl: e.target.value})} sx={{ input: { color: 'white' }, label: { color: 'gray' } }} />
            <TextField label="Director" fullWidth value={formData.director} onChange={e => setFormData({...formData, director: e.target.value})} sx={{ input: { color: 'white' }, label: { color: 'gray' } }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="gray">Featured Movie:</Typography>
              <Button 
                variant={formData.featured ? "contained" : "outlined"} 
                size="small"
                onClick={() => setFormData({...formData, featured: !formData.featured})}
                sx={{ bgcolor: formData.featured ? '#00D1FF' : 'transparent', color: formData.featured ? 'black' : '#00D1FF' }}
              >
                {formData.featured ? "YES" : "NO"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: 'gray' }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#00D1FF', color: 'black' }}>{editingMovie ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Admin;
