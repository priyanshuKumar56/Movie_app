import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Avatar, IconButton } from '@mui/material';
import { 
  HomeRounded, 
  ExploreRounded, 
  FavoriteRounded, 
  HistoryRounded, 
  AdminPanelSettingsRounded, 
  LogoutRounded,
  MenuOpenRounded
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../app/slices/authSlice';

const drawerWidth = 240;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const menuItems = [
    { text: 'Discover', icon: <HomeRounded />, path: '/' },
    { text: 'Browse', icon: <ExploreRounded />, path: '/search' },
    { text: 'My List', icon: <FavoriteRounded />, path: '/profile' },
  ];

  if (user?.role === 'ADMIN') {
    menuItems.push({ text: 'Admin Console', icon: <AdminPanelSettingsRounded />, path: '/admin' });
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const drawerContent = (
    <Box sx={{ 
      height: '100%', 
      bgcolor: '#0f0f0f', // Deep matte black in sidebar
      color: '#e0e0e0',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid rgba(255,255,255,0.05)'
    }}>
      {/* Brand */}
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontFamily: 'Space Grotesk', fontWeight: 700, letterSpacing: '-0.5px' }}>
          Cine<span style={{ color: '#00D1FF' }}>Sphere</span>
        </Typography>
      </Box>

      {/* Nav Items */}
      <List sx={{ px: 2, flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem 
              button 
              key={item.text} 
              onClick={() => navigate(item.path)}
              sx={{ 
                borderRadius: 3, 
                mb: 1,
                bgcolor: isActive ? 'rgba(0, 209, 255, 0.1)' : 'transparent',
                color: isActive ? '#00D1FF' : '#888',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: '#fff' }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ fontFamily: 'Outfit', fontWeight: isActive ? 600 : 400 }} 
              />
            </ListItem>
          );
        })}
      </List>

      {/* User Mini Profile */}
      {user ? (
        <Box sx={{ p: 2, m: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>{user.name}</Typography>
              <Typography variant="caption" color="gray" sx={{ display: 'block' }}>{user.role}</Typography>
            </Box>
          </Box>
          <ListItem button onClick={handleLogout} sx={{ p: 0, mt: 1 }}>
            <ListItemIcon sx={{ minWidth: 30, color: '#ff4d4d' }}><LogoutRounded fontSize="small"/></ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ variant: 'caption', color: '#ff4d4d' }} />
          </ListItem>
        </Box>
      ) : (
        <Box sx={{ p: 3 }}>
          <ListItem 
              button 
              onClick={() => navigate('/login')}
              sx={{ bgcolor: '#00D1FF', borderRadius: 3, textAlign: 'center', justifyContent: 'center', color: 'black' }}
            >
              <Typography sx={{ fontWeight: 700, fontFamily: 'Outfit' }}>Sign In</Typography>
          </ListItem>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#050505' }}>
      {/* Sidebar for Desktop */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 }, display: { xs: 'none', sm: 'block' } }}>
        <Drawer
          variant="permanent"
          sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' } }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
      >
        {drawerContent}
      </Drawer>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` }, p: 0, position: 'relative' }}>
         <IconButton 
            onClick={() => setMobileOpen(true)}
            sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1100, display: { sm: 'none' }, color: 'white', bgcolor: 'rgba(0,0,0,0.5)' }}
          >
            <MenuOpenRounded />
         </IconButton>
         {children}
      </Box>
    </Box>
  );
};

export default Layout;
