import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Typography, Grid, CircularProgress, TextField, FormControl, Select, MenuItem, InputAdornment, Avatar, IconButton, Menu } from '@mui/material';
import { SearchRounded, ArrowDropDownRounded } from '@mui/icons-material';
import { searchMovies, fetchMovies, clearSearchResults } from '../app/slices/movieSlice';
import { logout } from '../app/slices/authSlice';
import MovieCard from '../components/movies/MovieCard';
import useDebounce from '../hooks/useDebounce';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [localQuery, setLocalQuery] = useState(queryParam);
  const [sortBy, setSortBy] = useState('-rating');
  const debouncedQuery = useDebounce(localQuery, 500);
  const [anchorEl, setAnchorEl] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchResults, movies, searchLoading, loading } = useSelector((state) => state.movies);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (debouncedQuery) {
      setSearchParams({ q: debouncedQuery });
      dispatch(searchMovies({ query: debouncedQuery, page: 1, limit: 50 }));
    } else {
      dispatch(fetchMovies({ page: 1, limit: 50, sort: sortBy }));
    }
  }, [debouncedQuery, sortBy, dispatch, setSearchParams]);

  const displayMovies = debouncedQuery ? searchResults : movies;

  // Sort movies locally
  const sortedMovies = [...displayMovies].sort((a, b) => {
    switch (sortBy) {
      case '-rating': return b.rating - a.rating;
      case 'rating': return a.rating - b.rating;
      case '-releaseDate': return new Date(b.releaseDate) - new Date(a.releaseDate);
      case 'releaseDate': return new Date(a.releaseDate) - new Date(b.releaseDate);
      case 'title': return a.title.localeCompare(b.title);
      case '-title': return b.title.localeCompare(a.title);
      case '-duration': return b.duration - a.duration;
      case 'duration': return a.duration - b.duration;
      default: return 0;
    }
  });

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a0a', color: 'white' }}>
      
      {/* ===== TOP NAVBAR (Same as Browse) ===== */}
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, bgcolor: '#0a0a0a', py: 1.5, px: 4, borderBottom: '1px solid #222' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" sx={{ fontFamily: 'Space Grotesk', fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate('/browse')}>
            Cine<span style={{ color: '#00D1FF' }}>Sphere</span>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
      </Box>

      {/* ===== SEARCH & FILTER BAR ===== */}
      <Container maxWidth="xl" sx={{ pt: 12, pb: 4 }}>
        <Typography variant="h4" sx={{ fontFamily: 'Space Grotesk', fontWeight: 700, mb: 4 }}>
          {debouncedQuery ? `Results for "${debouncedQuery}"` : 'Browse All Movies'}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
          {/* Search Input */}
          <TextField 
            placeholder="Search movies by name or description..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchRounded sx={{ color: '#888' }} /></InputAdornment>
            }}
            sx={{ 
              flex: 1, 
              minWidth: 300,
              bgcolor: '#111', 
              borderRadius: 2,
              input: { color: 'white' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00D1FF' }
            }}
          />

          {/* Sort Dropdown */}
          <FormControl sx={{ minWidth: 200 }}>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              sx={{ 
                bgcolor: '#111', 
                color: 'white', 
                borderRadius: 2,
                '.MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00D1FF' },
                '.MuiSvgIcon-root': { color: 'white' }
              }}
            >
              <MenuItem value="-rating">Rating: High to Low</MenuItem>
              <MenuItem value="rating">Rating: Low to High</MenuItem>
              <MenuItem value="-releaseDate">Newest First</MenuItem>
              <MenuItem value="releaseDate">Oldest First</MenuItem>
              <MenuItem value="title">Name: A-Z</MenuItem>
              <MenuItem value="-title">Name: Z-A</MenuItem>
              <MenuItem value="-duration">Duration: Longest</MenuItem>
              <MenuItem value="duration">Duration: Shortest</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* ===== MOVIE GRID ===== */}
        {searchLoading || loading ? (
          <Box display="flex" justifyContent="center" py={10}><CircularProgress sx={{ color: '#00D1FF' }} /></Box>
        ) : (
          <Grid container spacing={3}>
            {sortedMovies.length > 0 ? (
              sortedMovies.map((movie) => (
                <Grid item key={movie._id} xs={6} sm={4} md={3} lg={2}>
                  <MovieCard movie={movie} />
                </Grid>
              ))
            ) : (
              <Box sx={{ width: '100%', textAlign: 'center', py: 10 }}>
                <Typography variant="h6" color="gray">No movies found.</Typography>
              </Box>
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Search;
