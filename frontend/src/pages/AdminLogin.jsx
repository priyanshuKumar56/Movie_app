
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Container, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../app/slices/authSlice';
import { AdminPanelSettingsRounded } from '@mui/icons-material';

const AdminAuthLayout = ({ children }) => (
  <Box
    sx={{
      minHeight: '100vh',
      width: '100%',
      bgcolor: '#050505',
      // Red accent for Admin
      backgroundImage: `radial-gradient(circle at 50% 50%, rgba(229, 9, 20, 0.08) 0%, rgba(0,0,0,0) 50%)`,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <Box sx={{ p: 4, display: 'flex', alignItems: 'center' }}>
       <Typography variant="h5" sx={{ fontFamily: 'Space Grotesk', fontWeight: 700, letterSpacing: '-0.5px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1 }} onClick={() => window.location.href='/'}>
          Cine<span style={{ color: '#E50914' }}>Sphere</span> Admin
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
          border: '1px solid #333',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}
      >
        {children}
      </Box>
    </Container>
  </Box>
);

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        // If they logged in but are not admin, maybe warn them?
        // For now, we just redirect them to browse if they are regular users trying to use admin login.
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
    <AdminAuthLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Box sx={{ p: 2, bgcolor: 'rgba(229,9,20,0.1)', borderRadius: '50%', mb: 2 }}>
            <AdminPanelSettingsRounded sx={{ fontSize: 40, color: '#E50914' }} />
        </Box>
        <Typography variant="h4" fontWeight={700} fontFamily="Space Grotesk">Admin Access</Typography>
        <Typography variant="body2" color="gray">Secure login for platform administrators.</Typography>
      </Box>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          variant="outlined"
          label="Admin Email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          sx={{ mb: 2, bgcolor: '#0a0a0a', input: { color: 'white' }, label: { color: 'gray' }, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#E50914' } } }}
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Password"
          type="password"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          sx={{ mb: 4, bgcolor: '#0a0a0a', input: { color: 'white' }, label: { color: 'gray' }, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#E50914' } } }}
        />
        
        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          sx={{ 
            bgcolor: '#E50914', 
            color: 'white',
            py: 1.5, 
            fontWeight: 700, 
            fontSize: '1rem', 
            mb: 2,
            '&:hover': { bgcolor: '#b20710' }
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Access Dashboard'}
        </Button>
      </form>
    </AdminAuthLayout>
  );
};

export default AdminLogin;
