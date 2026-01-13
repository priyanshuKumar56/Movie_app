import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Grid, Paper, 
  FormControl, InputLabel, Select, MenuItem, Chip, 
  IconButton, Alert, LinearProgress 
} from '@mui/material';
import { CloudUpload, Close, MovieCreation } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 
  'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 
  'Documentary', 'Animation'
];

const AdminCreateMovie = () => {
  const { token } = useSelector((state) => state.auth);
  const [importLoading, setImportLoading] = useState(false);
  const [jsonFile, setJsonFile] = useState(null);

  // Manual Creation Form
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      releaseDate: '',
      duration: '',
      rating: '',
      genres: [],
      posterUrl: '',
      trailerUrl: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      description: Yup.string().required('Description is required'),
      releaseDate: Yup.string().required('Release date is required'),
      duration: Yup.number().required('Duration is required').positive().integer(),
      rating: Yup.number().min(0).max(10),
      genres: Yup.array().min(1, 'Select at least one genre'),
      posterUrl: Yup.string().url('Must be a valid URL'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await axios.post('http://localhost:5000/api/v1/movies', values, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Movie created successfully!');
        resetForm();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to create movie');
      }
    },
  });

  // Bulk Import Handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/json') {
      setJsonFile(file);
    } else {
      toast.error('Please upload a valid JSON file');
    }
  };

  const handleImport = async () => {
    if (!jsonFile) return;

    setImportLoading(true);
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const movies = JSON.parse(e.target.result);
        
        await axios.post('http://localhost:5000/api/v1/movies/import', movies, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        toast.success('Movies imported successfully!');
        setJsonFile(null);
      } catch (error) {
        console.error(error);
        if (error instanceof SyntaxError) {
             toast.error('Invalid JSON file format');
        } else {
             toast.error(error.response?.data?.message || 'Failed to import movies');
        }
      } finally {
        setImportLoading(false);
      }
    };

    reader.readAsText(jsonFile);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>Add New Movies</Typography>
        <Typography color="gray">Create individual movies or bulk import from JSON</Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Manual Entry Form */}
        <Grid item xs={12} lg={7}>
          <Paper sx={{ p: 4, bgcolor: '#111', borderRadius: 3, border: '1px solid #222' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <MovieCreation sx={{ color: '#E50914', fontSize: 30 }} />
              <Typography variant="h6">Manual Entry</Typography>
            </Box>

            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="title"
                    label="Movie Title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    name="description"
                    label="Synopsis"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="date"
                    name="releaseDate"
                    label="Release Date"
                    InputLabelProps={{ shrink: true }}
                    value={formik.values.releaseDate}
                    onChange={formik.handleChange}
                    error={formik.touched.releaseDate && Boolean(formik.errors.releaseDate)}
                    helperText={formik.touched.releaseDate && formik.errors.releaseDate}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number"
                    name="duration"
                    label="Duration (mins)"
                    value={formik.values.duration}
                    onChange={formik.handleChange}
                    error={formik.touched.duration && Boolean(formik.errors.duration)}
                    helperText={formik.touched.duration && formik.errors.duration}
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number"
                    name="rating"
                    label="Rating (0-10)"
                    inputProps={{ step: 0.1, min: 0, max: 10 }}
                    value={formik.values.rating}
                    onChange={formik.handleChange}
                    error={formik.touched.rating && Boolean(formik.errors.rating)}
                    helperText={formik.touched.rating && formik.errors.rating}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Genres</InputLabel>
                    <Select
                      multiple
                      name="genres"
                      value={formik.values.genres}
                      onChange={formik.handleChange}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {GENRES.map((genre) => (
                        <MenuItem key={genre} value={genre}>{genre}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="posterUrl"
                    label="Poster URL"
                    value={formik.values.posterUrl}
                    onChange={formik.handleChange}
                    error={formik.touched.posterUrl && Boolean(formik.errors.posterUrl)}
                    helperText={formik.touched.posterUrl && formik.errors.posterUrl}
                  />
                </Grid>
              </Grid>

              <Button 
                type="submit" 
                variant="contained" 
                fullWidth 
                size="large"
                sx={{ mt: 4, bgcolor: '#E50914', '&:hover': { bgcolor: '#B20710' } }}
              >
                Create Movie
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Bulk Import */}
        <Grid item xs={12} lg={5}>
          <Paper sx={{ p: 4, bgcolor: '#111', borderRadius: 3, border: '1px solid #222', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <CloudUpload sx={{ color: '#00D1FF', fontSize: 30 }} />
              <Typography variant="h6">Bulk Import</Typography>
            </Box>

            <Box 
              sx={{ 
                border: '2px dashed #333', 
                borderRadius: 2, 
                p: 4, 
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: '#0a0a0a',
                transition: 'all 0.2s',
                '&:hover': { borderColor: '#555', bgcolor: '#151515' }
              }}
              component="label"
            >
              <input 
                type="file" 
                hidden 
                accept=".json" 
                onChange={handleFileChange} 
              />
              <CloudUpload sx={{ fontSize: 48, color: '#444', mb: 2 }} />
              <Typography variant="body1" fontWeight="bold">Click to upload JSON</Typography>
              <Typography variant="caption" color="gray">Format: Array of movie objects</Typography>
            </Box>

            {jsonFile && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(0, 209, 255, 0.1)', borderRadius: 2, border: '1px solid #00D1FF' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" noWrap sx={{ maxWidth: '80%' }}>{jsonFile.name}</Typography>
                  <IconButton size="small" onClick={() => setJsonFile(null)}><Close fontSize="small" /></IconButton>
                </Box>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  onClick={handleImport}
                  disabled={importLoading}
                  sx={{ mt: 2, borderColor: '#00D1FF', color: '#00D1FF' }}
                >
                  {importLoading ? 'Importing...' : 'Process Import'}
                </Button>
                {importLoading && <LinearProgress sx={{ mt: 2 }} />}
              </Box>
            )}

            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle2" gutterBottom>Expected JSON Format:</Typography>
              <Paper sx={{ p: 2, bgcolor: '#000', fontFamily: 'monospace', fontSize: '0.75rem', color: '#0f0' }}>
{`[
  {
    "title": "Inception",
    "description": "...",
    "releaseDate": "2010-07-16",
    "duration": 148,
    "rating": 8.8,
    "genres": ["Action", "Sci-Fi"],
    "posterUrl": "https://..."
  }
]`}
              </Paper>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminCreateMovie;
