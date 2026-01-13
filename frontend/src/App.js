import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Landing from './pages/Landing';
import Home from './pages/Home'; // This is the "Listing Page"
import Login from './pages/Login';
import Register from './pages/Register';
import MovieDetails from './pages/MovieDetails';
import Search from './pages/Search';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import Profile from './pages/Profile';

import ProtectedRoute from './components/common/ProtectedRoute';
import { getProfile } from './app/slices/authSlice';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !isAuthenticated) {
      dispatch(getProfile());
    }
  }, [dispatch, token, isAuthenticated]);

  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: { main: '#00D1FF' },
      secondary: { main: '#E50914' },
      background: { default: '#050505', paper: '#111111' },
      text: { primary: '#ffffff', secondary: '#aaaaaa' },
    },
    typography: {
      fontFamily: "'Outfit', 'Roboto', sans-serif",
      h1: { fontFamily: "'Space Grotesk', sans-serif" },
      h2: { fontFamily: "'Space Grotesk', sans-serif" },
      h3: { fontFamily: "'Space Grotesk', sans-serif" },
      h4: { fontFamily: "'Space Grotesk', sans-serif" },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiButton: { styleOverrides: { root: { borderRadius: 8 } } },
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />

          {/* User Routes (Listing Page & Discovery) */}
          <Route
            path="/browse"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movies/:id"
            element={
              <ProtectedRoute>
                <MovieDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes (Separate Panel) */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        theme="dark"
        toastStyle={{ backgroundColor: '#111', color: 'white', border: '1px solid #333' }}
      />
    </ThemeProvider>
  );
}

export default App;
