import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks
export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async ({ page = 1, limit = 20, sort = '-rating', ...filters } = {}, { rejectWithValue }) => {
    try {
      const params = { page, limit, sort, ...filters };
      const response = await api.get('/movies', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch movies');
    }
  }
);

export const fetchMovieById = createAsyncThunk(
  'movies/fetchMovieById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/movies/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch movie');
    }
  }
);

export const searchMovies = createAsyncThunk(
  'movies/searchMovies',
  async ({ query, page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await api.get('/movies/search', {
        params: { q: query, page, limit },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
  }
);

export const fetchTrendingMovies = createAsyncThunk(
  'movies/fetchTrending',
  async (limit = 10, { rejectWithValue }) => {
    try {
      const response = await api.get('/movies/trending', { params: { limit } });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch trending movies');
    }
  }
);

export const createMovie = createAsyncThunk(
  'movies/createMovie',
  async (movieData, { rejectWithValue }) => {
    try {
      const response = await api.post('/movies', movieData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create movie');
    }
  }
);

export const updateMovie = createAsyncThunk(
  'movies/updateMovie',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/movies/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update movie');
    }
  }
);

export const deleteMovie = createAsyncThunk(
  'movies/deleteMovie',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/movies/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete movie');
    }
  }
);

const initialState = {
  movies: [],
  currentMovie: null,
  trending: [],
  searchResults: [],
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },
  loading: false,
  searchLoading: false,
  error: null,
  filters: {
    genre: null,
    minRating: null,
    maxRating: null,
    year: null,
    sort: '-rating',
  },
};

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Movies
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Movie by ID
      .addCase(fetchMovieById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMovie = action.payload;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search Movies
      .addCase(searchMovies.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.data;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      })
      // Fetch Trending
      .addCase(fetchTrendingMovies.fulfilled, (state, action) => {
        state.trending = action.payload;
      })
      // Create Movie
      .addCase(createMovie.fulfilled, (state, action) => {
        state.movies.unshift(action.payload);
      })
      // Update Movie
      .addCase(updateMovie.fulfilled, (state, action) => {
        const index = state.movies.findIndex((m) => m._id === action.payload._id);
        if (index !== -1) {
          state.movies[index] = action.payload;
        }
        if (state.currentMovie?._id === action.payload._id) {
          state.currentMovie = action.payload;
        }
      })
      // Delete Movie
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.movies = state.movies.filter((m) => m._id !== action.payload);
      });
  },
});

export const { clearError, setFilters, clearFilters, clearSearchResults } = movieSlice.actions;
export default movieSlice.reducer;
