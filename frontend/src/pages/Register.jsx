import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Alert, CircularProgress, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../app/slices/authSlice';
import { AuthLayout } from './Login';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
        // New users are always USER role initially
        navigate('/browse');
    }
    return () => dispatch(clearError());
  }, [isAuthenticated, navigate, dispatch]);

  useEffect(() => {
    if (error) console.error("Registration Error:", error);
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  return (
    <AuthLayout>
      <Typography variant="h4" fontWeight={700} mb={1} fontFamily="Space Grotesk">Create Account</Typography>
      <Typography variant="body2" color="gray" mb={4}>Join CineSphere today.</Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          variant="outlined"
          label="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          sx={{ mb: 2, bgcolor: '#0a0a0a', input: { color: 'white' }, label: { color: 'gray' } }}
          required
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Email address"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          sx={{ mb: 2, bgcolor: '#0a0a0a', input: { color: 'white' }, label: { color: 'gray' } }}
          required
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          sx={{ mb: 4, bgcolor: '#0a0a0a', input: { color: 'white' }, label: { color: 'gray' } }}
          required
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
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Start Membership'}
        </Button>

        <Typography variant="body2" color="gray" align="center" mt={3}>
          Already have an account?{' '}
          <Link component="button" onClick={() => navigate('/login')} underline="hover" sx={{ color: '#00D1FF', fontWeight: 600 }}>
            Sign in
          </Link>
        </Typography>
      </form>
    </AuthLayout>
  );
};

export default Register;
