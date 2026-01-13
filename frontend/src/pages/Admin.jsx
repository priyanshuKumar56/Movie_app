
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies } from '../app/slices/movieSlice';

// Components
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminMovies from '../components/admin/AdminMovies';
import AdminSettings from '../components/admin/AdminSettings';

const Admin = () => {
  const dispatch = useDispatch();
  const { movies, loading } = useSelector((state) => state.movies);
  const [activeTab, setActiveTab] = useState('Dashboard');

  useEffect(() => {
    // Initial fetch
    dispatch(fetchMovies({ limit: 1000 })); // Fetch more for admin analytics
  }, [dispatch]);

  return (
    <Box sx={{ display: 'flex', bgcolor: '#050505', minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>
      
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 5 }, width: { sm: `calc(100% - 260px)` }, color: 'white' }}>
        
        {activeTab === 'Dashboard' && <AdminDashboard movies={movies} />}
        {activeTab === 'Movies' && <AdminMovies movies={movies} loading={loading} />}
        {activeTab === 'Settings' && <AdminSettings />}
        
        {activeTab === 'Users' && (
             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column' }}>
                <Typography variant="h5" color="gray">User Management Module</Typography>
                <Typography variant="body2" color="#444">Coming in v2.0</Typography>
             </Box>
        )}

      </Box>
    </Box>
  );
};

export default Admin;
