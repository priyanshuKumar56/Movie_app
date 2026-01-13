import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CircularProgress, Box } from '@mui/material';
import { getProfile } from '../../app/slices/authSlice';

const ProtectedRoute = ({ children, requiredRole }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading, token } = useSelector((state) => state.auth);

  useEffect(() => {
    // If we have a token but no user data, fetch the profile
    if (token && !user && !loading) {
      dispatch(getProfile());
    }
  }, [token, user, loading, dispatch]);

  // Show loading while fetching user data
  if (loading || (token && !user)) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="#0a0a0a"
      >
        <CircularProgress sx={{ color: '#00D1FF' }} />
      </Box>
    );
  }

  // If no token or not authenticated, redirect to login
  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role requirement
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/browse" replace />;
  }

  return children;
};

export default ProtectedRoute;
