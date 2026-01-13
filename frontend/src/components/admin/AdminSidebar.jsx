
import React from 'react';
import { 
  Box, Typography, Drawer, List, ListItem, ListItemIcon, 
  ListItemText, Avatar, Divider, Button 
} from '@mui/material';
import { 
  DashboardRounded, MovieRounded, PeopleRounded, 
  SettingsRounded, LogoutRounded, SecurityRounded 
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../app/slices/authSlice';

const drawerWidth = 260;

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardRounded /> },
    { text: 'Movies', icon: <MovieRounded /> },
    { text: 'Users', icon: <PeopleRounded /> },
    { text: 'Settings', icon: <SettingsRounded /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': { 
          width: drawerWidth, 
          boxSizing: 'border-box',
          bgcolor: '#050505',
          color: 'white',
          borderRight: '1px solid #222'
        }
      }}
    >
      {/* Brand Header */}
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontFamily: 'Space Grotesk', fontWeight: 700, letterSpacing: '-0.5px' }}>
          Cine<span style={{ color: '#E50914' }}>Sphere</span>
        </Typography>
        <Typography variant="overline" sx={{ color: '#666', letterSpacing: 2 }}>Admin Portal</Typography>
      </Box>

      <Divider sx={{ borderColor: '#222', mb: 2 }} />

      {/* Navigation */}
      <List sx={{ px: 2 }}>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => setActiveTab(item.text)}
            sx={{ 
              borderRadius: 3, 
              mb: 1,
              py: 1.5,
              transition: 'all 0.2s',
              bgcolor: activeTab === item.text ? '#E50914' : 'transparent',
              color: activeTab === item.text ? 'white' : '#888',
              '&:hover': { 
                bgcolor: activeTab === item.text ? '#cc0000' : 'rgba(255,255,255,0.05)',
                color: 'white',
                transform: 'translateX(5px)'
              }
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 45 }}>{item.icon}</ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ 
                fontWeight: activeTab === item.text ? 700 : 500,
                fontSize: '0.95rem'
              }} 
            />
          </ListItem>
        ))}
      </List>

      {/* User Profile Footer */}
      <Box sx={{ mt: 'auto', p: 3 }}>
        <Box sx={{ 
          p: 2, 
          bgcolor: '#111', 
          borderRadius: 3, 
          mb: 2, 
          border: '1px solid #222',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Avatar 
            src={user?.avatar} 
            sx={{ width: 40, height: 40, border: '2px solid #E50914' }} 
            alt={user?.name}
          >
            {user?.name?.[0]}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="subtitle2" fontWeight="bold" noWrap>{user?.name}</Typography>
            <Typography variant="caption" color="gray" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <SecurityRounded sx={{ fontSize: 12, color: '#E50914' }} /> Administrator
            </Typography>
          </Box>
        </Box>
        
        <Button 
          fullWidth 
          startIcon={<LogoutRounded />} 
          onClick={handleLogout}
          sx={{ 
            color: '#888', 
            justifyContent: 'flex-start',
            px: 2,
            '&:hover': { color: '#E50914', bgcolor: 'transparent' }
          }}
        >
          Sign Out
        </Button>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;
