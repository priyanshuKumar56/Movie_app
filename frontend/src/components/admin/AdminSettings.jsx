
import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Grid, Alert, Divider } from '@mui/material';
import { SaveRounded, LockResetRounded } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { changePassword } from '../../app/slices/authSlice';
import { toast } from 'react-toastify';

const AdminSettings = () => {
  const dispatch = useDispatch();
  const [passData, setPassData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passData.newPassword !== passData.confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    if (passData.newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      await dispatch(changePassword({ 
          currentPassword: passData.currentPassword, 
          newPassword: passData.newPassword 
      })).unwrap();
      
      setSuccess("Password updated successfully");
      setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success("Security credentials updated");
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to update password');
    }
  };

  return (
    <Box maxWidth="md">
      <Typography variant="h4" sx={{ fontFamily: 'Space Grotesk', fontWeight: 700, mb: 4 }}>System Settings</Typography>

      {/* Security Section */}
      <Paper sx={{ p: 4, bgcolor: '#141414', border: '1px solid #222', borderRadius: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{ p: 1.5, bgcolor: 'rgba(229, 9, 20, 0.1)', borderRadius: '50%', color: '#E50914' }}>
                <LockResetRounded />
            </Box>
            <Box>
                <Typography variant="h6" fontWeight="bold">Security & Authentication</Typography>
                <Typography variant="body2" color="gray">Manage your admin access credentials</Typography>
            </Box>
        </Box>
        
        <Divider sx={{ borderColor: '#222', mb: 4 }} />

        {error && <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(211, 47, 47, 0.1)', color: '#ffbdad' }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3, bgcolor: 'rgba(56, 142, 60, 0.1)', color: '#a5d6a7' }}>{success}</Alert>}

        <form onSubmit={handlePasswordChange}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField 
                        label="Current Password" 
                        type="password" 
                        fullWidth 
                        required
                        value={passData.currentPassword}
                        onChange={(e) => setPassData({...passData, currentPassword: e.target.value})}
                        sx={fieldStyle}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField 
                        label="New Password" 
                        type="password" 
                        fullWidth 
                        required
                        helperText="Min. 8 characters"
                        value={passData.newPassword}
                        onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
                        sx={fieldStyle}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField 
                        label="Confirm New Password" 
                        type="password" 
                        fullWidth 
                        required
                        value={passData.confirmPassword}
                        onChange={(e) => setPassData({...passData, confirmPassword: e.target.value})}
                        sx={fieldStyle}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        size="large"
                        startIcon={<SaveRounded />}
                        sx={{ 
                            bgcolor: '#E50914', 
                            color: 'white', 
                            fontWeight: 700, 
                            px: 4, 
                            py: 1.5,
                            mt: 1,
                            '&:hover': { bgcolor: '#b20710' } 
                        }}
                    >
                        Update Security
                    </Button>
                </Grid>
            </Grid>
        </form>
      </Paper>

      {/* General Settings Placeholder */}
      <Paper sx={{ p: 4, bgcolor: '#141414', border: '1px solid #222', borderRadius: 3, opacity: 0.5 }}>
         <Typography variant="h6" fontWeight="bold" gutterBottom>General Preferences</Typography>
         <Typography color="gray">Platform configuration settings are currently locked by the System Administrator.</Typography>
      </Paper>
    </Box>
  );
};

const fieldStyle = {
    '& .MuiOutlinedInput-root': { color: 'white', bgcolor: '#0a0a0a' },
    '& .MuiInputLabel-root': { color: 'gray' },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#555' },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#E50914' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#E50914' },
    '& .MuiFormHelperText-root': { color: '#666' }
};

export default AdminSettings;
