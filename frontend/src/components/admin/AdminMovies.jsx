
import React, { useState } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Paper, 
  TextField, Chip, InputAdornment, Dialog, DialogTitle,
  DialogContent, DialogActions, Grid, Tooltip, Pagination
} from '@mui/material';
import { 
  EditRounded, DeleteRounded, AddRounded, SearchRounded, 
  FilterListRounded, VisibilityRounded 
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { deleteMovie, createMovie, updateMovie, fetchMovies } from '../../app/slices/movieSlice';

const AdminMovies = ({ movies, loading }) => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', rating: '', releaseDate: '', 
    duration: '', genres: '', posterUrl: '', backdropUrl: '',
    director: '', featured: false
  });

  const rowsPerPage = 10;

  // Filter & Pagination Logic
  const filteredMovies = movies.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.director?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredMovies.length / rowsPerPage);
  const paginatedMovies = filteredMovies.slice((page - 1) * rowsPerPage, page * rowsPerPage);

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
    
    // Optimistic / Reload approach: Wait for action then reload
    if (editingMovie) {
       await dispatch(updateMovie({ id: editingMovie._id, data: movieData }));
    } else {
       await dispatch(createMovie(movieData));
    }
    setOpenDialog(false);
    // Refresh list to ensure consistency
    dispatch(fetchMovies({ limit: 100 }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie? This action cannot be undone.')) {
      await dispatch(deleteMovie(id));
      dispatch(fetchMovies({ limit: 100 }));
    }
  };

  return (
    <Box>
      {/* Header Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontFamily: 'Space Grotesk', fontWeight: 700 }}>Movie Management</Typography>
        <Button 
            variant="contained" 
            startIcon={<AddRounded />} 
            onClick={() => handleOpen()} 
            sx={{ bgcolor: '#E50914', color: 'white', fontWeight: 700, borderRadius: 2, px: 3, '&:hover': { bgcolor: '#b20710' } }}
        >
          Add New Movie
        </Button>
      </Box>

      {/* Filter Bar */}
      <Paper sx={{ p: 2, mb: 4, bgcolor: '#141414', border: '1px solid #222', borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField 
            placeholder="Search movies by title, director..." 
            variant="outlined" 
            size="small"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            fullWidth
            InputProps={{
                startAdornment: <InputAdornment position="start"><SearchRounded sx={{ color: '#666' }} /></InputAdornment>,
            }}
            sx={{ 
                bgcolor: '#0a0a0a', 
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                input: { color: 'white' }
            }} 
        />
        <IconButton sx={{ color: '#666', border: '1px solid #333', borderRadius: 2 }}><FilterListRounded /></IconButton>
      </Paper>

      {/* Movies Table */}
      <TableContainer component={Paper} sx={{ bgcolor: '#141414', border: '1px solid #222', borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#1a1a1a' }}>
              <TableCell sx={{ color: '#aaa', fontWeight: 600 }}>Poster</TableCell>
              <TableCell sx={{ color: '#aaa', fontWeight: 600 }}>Title</TableCell>
              <TableCell sx={{ color: '#aaa', fontWeight: 600 }}>Rating</TableCell>
              <TableCell sx={{ color: '#aaa', fontWeight: 600 }}>Release Year</TableCell>
              <TableCell sx={{ color: '#aaa', fontWeight: 600 }}>Genres</TableCell>
              <TableCell sx={{ color: '#aaa', fontWeight: 600 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedMovies.map((movie) => (
              <TableRow key={movie._id} sx={{ '&:hover': { bgcolor: '#1f1f1f' }, transition: 'background-color 0.2s' }}>
                <TableCell>
                    <Box component="img" src={movie.posterUrl} sx={{ width: 40, height: 60, borderRadius: 1, objectFit: 'cover' }} />
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>{movie.title}</TableCell>
                <TableCell><Chip label={movie.rating} size="small" sx={{ bgcolor: 'rgba(255, 215, 0, 0.1)', color: '#FFD700', fontWeight: 'bold' }} /></TableCell>
                <TableCell sx={{ color: '#ccc' }}>{new Date(movie.releaseDate).getFullYear()}</TableCell>
                <TableCell sx={{ color: 'gray' }}>{movie.genres?.slice(0, 2).join(', ')}</TableCell>
                <TableCell align="right">
                  <Tooltip title="View Details"><IconButton sx={{ color: '#aaa', '&:hover': { color: 'white' } }}><VisibilityRounded /></IconButton></Tooltip>
                  <Tooltip title="Edit"><IconButton onClick={() => handleOpen(movie)} sx={{ color: '#00D1FF', '&:hover': { bgcolor: 'rgba(0, 209, 255, 0.1)' } }}><EditRounded /></IconButton></Tooltip>
                  <Tooltip title="Delete"><IconButton onClick={() => handleDelete(movie._id)} sx={{ color: '#ff4d4d', '&:hover': { bgcolor: 'rgba(255, 77, 77, 0.1)' } }}><DeleteRounded /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {paginatedMovies.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'gray' }}>No movies found matching your search.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination 
            count={totalPages} 
            page={page} 
            onChange={(e, v) => setPage(v)} 
            color="primary" 
            sx={{ '& .MuiPaginationItem-root': { color: 'white' }, '& .Mui-selected': { bgcolor: '#E50914 !important' } }}
        />
      </Box>

      {/* ADD/EDIT DIALOG */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="md" 
        fullWidth 
        PaperProps={{ sx: { bgcolor: '#141414', color: 'white', border: '1px solid #333', borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontFamily: 'Space Grotesk', fontWeight: 700, borderBottom: '1px solid #222' }}>
            {editingMovie ? 'Edit Movie Details' : 'Add New Movie'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                     <TextField label="Movie Title" fullWidth value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} sx={fieldStyle} />
                </Grid>
                <Grid item xs={12} md={6}>
                     <TextField label="Director" fullWidth value={formData.director} onChange={e => setFormData({...formData, director: e.target.value})} sx={fieldStyle} />
                </Grid>
            </Grid>
            
            <Grid container spacing={3}>
              <Grid item xs={4}><TextField label="Rating (0-10)" type="number" fullWidth value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} sx={fieldStyle} /></Grid>
              <Grid item xs={4}><TextField label="Duration (min)" type="number" fullWidth value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} sx={fieldStyle} /></Grid>
              <Grid item xs={4}><TextField type="date" fullWidth value={formData.releaseDate} onChange={e => setFormData({...formData, releaseDate: e.target.value})} sx={fieldStyle} /></Grid>
            </Grid>

            <TextField label="Genres (comma separated)" placeholder="Action, Drama, Sci-Fi" fullWidth value={formData.genres} onChange={e => setFormData({...formData, genres: e.target.value})} sx={fieldStyle} />
            <TextField label="Description/Plot" multiline rows={4} fullWidth value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} sx={fieldStyle} />
            
            <Typography variant="subtitle2" color="gray" mt={1}>Media Assets</Typography>
            <TextField label="Poster Image URL" fullWidth value={formData.posterUrl} onChange={e => setFormData({...formData, posterUrl: e.target.value})} sx={fieldStyle} />
            <TextField label="Backdrop Image URL" fullWidth value={formData.backdropUrl} onChange={e => setFormData({...formData, backdropUrl: e.target.value})} sx={fieldStyle} />
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: '#0a0a0a', borderRadius: 2 }}>
              <Typography variant="body2" color="white" fontWeight="600">Featured on Homepage?</Typography>
              <Button 
                variant={formData.featured ? "contained" : "outlined"} 
                size="small"
                onClick={() => setFormData({...formData, featured: !formData.featured})}
                sx={{ 
                    bgcolor: formData.featured ? '#E50914' : 'transparent', 
                    color: formData.featured ? 'white' : '#E50914',
                    borderColor: '#E50914',
                    '&:hover': { bgcolor: formData.featured ? '#b20710' : 'rgba(229, 9, 20, 0.1)' }
                }}
              >
                {formData.featured ? "YES, FEATURE IT" : "NO"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #222' }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: 'gray', px: 3 }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#E50914', color: 'white', px: 4, fontWeight: 700, '&:hover': { bgcolor: '#b20710' } }}>
            {editingMovie ? 'Save Changes' : 'Create Movie'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const fieldStyle = {
    '& .MuiOutlinedInput-root': { color: 'white', bgcolor: '#0a0a0a' },
    '& .MuiInputLabel-root': { color: 'gray' },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#555' },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#E50914' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#E50914' }
};

export default AdminMovies;
