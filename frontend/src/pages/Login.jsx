import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Container, Link, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../app/slices/authSlice';

// Reusing Layout just for style, or keep standalone
const AuthLayout = ({ children }) => (
  <Box
    sx={{
      minHeight: '100vh',
      width: '100%',
      // Using a darker, more tech-focused background for CineSphere
      bgcolor: '#050505',
      backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0, 209, 255, 0.05) 0%, rgba(0,0,0,0) 50%)`,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <Box sx={{ p: 4, display: 'flex', alignItems: 'center' }}>
       <Typography variant="h5" sx={{ fontFamily: 'Space Grotesk', fontWeight: 700, letterSpacing: '-0.5px', color: 'white', cursor: 'pointer' }} onClick={() => window.location.href='/'}>
          Cine<span style={{ color: '#00D1FF' }}>Sphere</span>
        </Typography>
    </Box>
    <Container maxWidth="xs" sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box
        sx={{
          bgcolor: '#111',
          p: { xs: 4, md: 6 },
          borderRadius: 4,
          width: '100%',
          mb: 8,
          color: 'white',
          border: '1px solid #222',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}
      >
        {children}
      </Box>
    </Container>
  </Box>
);

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/browse');
      }
    }
    return () => dispatch(clearError());
  }, [isAuthenticated, user, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <AuthLayout>
      <Typography variant="h4" fontWeight={700} mb={1} fontFamily="Space Grotesk">Welcome back</Typography>
      <Typography variant="body2" color="gray" mb={4}>Please enter your details to sign in.</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          variant="outlined"
          label="Email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          sx={{ mb: 2, bgcolor: '#0a0a0a', input: { color: 'white' }, label: { color: 'gray' } }}
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Password"
          type="password"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          sx={{ mb: 4, bgcolor: '#0a0a0a', input: { color: 'white' }, label: { color: 'gray' } }}
        />
        
        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          sx={{ 
            bgcolor: '#00D1FF', 
            color: 'black',
            py: 1.5, 
            fontWeight: 700, 
            fontSize: '1rem', 
            mb: 2,
            '&:hover': { bgcolor: '#00b8e6' }
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
        </Button>

        <Typography variant="body2" color="gray" align="center" mt={3}>
          Don't have an account? <Link component="button" onClick={() => navigate('/register')} underline="hover" sx={{ color: '#00D1FF', fontWeight: 600 }}>Sign up</Link>
        </Typography>
      </form>
    </AuthLayout>
  );
};

export default Login;
export { AuthLayout };
