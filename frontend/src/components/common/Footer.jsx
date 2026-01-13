import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'secondary.main', color: 'white', py: 3, mt: 'auto' }}>
      <Container>
        <Typography variant="body2" align="center">
          © 2024 MovieApp. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
