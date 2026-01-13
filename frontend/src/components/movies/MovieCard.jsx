import React from 'react';
import { Box, Typography } from '@mui/material';
import { StarRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      style={{ cursor: 'pointer', height: '100%' }}
      onClick={() => navigate(`/movies/${movie._id}`)}
    >
      <Box 
        sx={{ 
          position: 'relative', 
          borderRadius: 2, 
          overflow: 'hidden', 
          aspectRatio: '2/3',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          bgcolor: '#1a1a1a'
        }}
      >
        <Box
          component="img"
          src={movie.posterUrl || "https://via.placeholder.com/300x450"}
          alt={movie.title}
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = "https://via.placeholder.com/300x450?text=Poster+Not+Available";
          }}
          sx={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            transition: 'transform 0.3s',
            '&:hover': { transform: 'scale(1.05)' }
          }}
        />
        
        {/* Gradient Overlay */}
        <Box sx={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          height: '50%', 
          background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}>
          <Typography 
            variant="body1" 
            sx={{ 
              fontFamily: 'Space Grotesk', 
              fontWeight: 700, 
              lineHeight: 1.2, 
              mb: 0.5, 
              color: 'white',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {movie.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <StarRounded sx={{ fontSize: 16, color: '#FFD700' }} />
            <Typography variant="caption" sx={{ color: '#ddd' }}>{movie.rating}</Typography>
            <Typography variant="caption" sx={{ color: '#666' }}>•</Typography>
            <Typography variant="caption" sx={{ color: '#ddd' }}>{new Date(movie.releaseDate).getFullYear()}</Typography>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default MovieCard;
