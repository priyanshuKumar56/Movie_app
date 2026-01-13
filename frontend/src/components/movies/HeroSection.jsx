import React from 'react';
import { Box, Typography, Button, alpha } from '@mui/material';
import { PlayArrow, InfoOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HeroSection = ({ movie }) => {
  const navigate = useNavigate();

  if (!movie) return null;

  return (
    <Box 
      sx={{ 
        position: 'relative', 
        height: '85vh', 
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        backgroundImage: `linear-gradient(to top, #141414, transparent 50%), linear-gradient(to right, #141414 0%, transparent 50%), url(${movie.backdropUrl || movie.posterUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top'
      }}
    >
      <Box sx={{ p: { xs: 2, md: 6 }, maxWidth: { xs: '100%', md: '50%' }, mt: '20vh' }}>
        <Typography 
          variant="h1" 
          component="h1"
          sx={{ 
            fontSize: { xs: '2.5rem', md: '5rem' }, 
            fontWeight: 800, 
            mb: 2, 
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            lineHeight: 1
          }}
        >
          {movie.title}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#46d369', 
              fontWeight: 700 
            }}
          >
            {Math.round(movie.rating * 10)}% Match
          </Typography>
          <Typography variant="h6" sx={{ color: 'white' }}>
            {new Date(movie.releaseDate).getFullYear()}
          </Typography>
          <Box 
            sx={{ 
              border: '1px solid white', 
              px: 1, 
              borderRadius: 0.5,
              fontSize: '0.9rem' 
            }}
          >
            HD
          </Box>
        </Box>
        
        <Typography 
          variant="body1" 
          sx={{ 
            fontSize: { xs: '1rem', md: '1.4rem' }, 
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
            mb: 4,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {movie.description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<PlayArrow sx={{ fontSize: '2rem !important' }} />}
            sx={{ 
              bgcolor: 'white', 
              color: 'black', 
              px: 4, 
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 700,
              '&:hover': { bgcolor: alpha('#fff', 0.8) }
            }}
            onClick={() => navigate(`/watch/${movie._id}`)}
          >
            Play
          </Button>
          <Button
            variant="contained"
            startIcon={<InfoOutlined sx={{ fontSize: '2rem !important' }} />}
            sx={{ 
              bgcolor: 'rgba(109, 109, 110, 0.7)', 
              color: 'white', 
              px: 4, 
              py: 1.5, 
              fontSize: '1.1rem',
              fontWeight: 700,
              '&:hover': { bgcolor: 'rgba(109, 109, 110, 0.4)' }
            }}
            onClick={() => navigate(`/movies/${movie._id}`)}
          >
            More Info
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default HeroSection;
