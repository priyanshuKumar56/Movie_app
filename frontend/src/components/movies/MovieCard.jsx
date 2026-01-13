import React from 'react';
import { Box, Typography } from '@mui/material';
import { StarRounded, PlayCircleFilledWhiteRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      style={{ cursor: 'pointer', height: '100%', position: 'relative' }}
      onClick={() => navigate(`/movies/${movie._id}`)}
    >
      <Box 
        sx={{ 
          position: 'relative', 
          borderRadius: 3, 
          overflow: 'hidden', 
          aspectRatio: '2/3',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          bgcolor: '#1a1a1a',
          '&:hover .overlay': { opacity: 1 }
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
          }}
        />
        
        {/* Hover Overlay */}
        <Box 
          className="overlay"
          sx={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 2,
            textAlign: 'center'
          }}
        >
          <PlayCircleFilledWhiteRounded sx={{ fontSize: 48, color: '#00D1FF', mb: 2, filter: 'drop-shadow(0 4px 10px rgba(0,209,255,0.4))' }} />
          
          <Box sx={{ mt: 'auto', width: '100%', textAlign: 'left' }}>
            <Typography 
               variant="h6" 
               sx={{ 
                 fontFamily: 'Space Grotesk', 
                 fontWeight: 800, 
                 lineHeight: 1.2, 
                 mb: 0.5, 
                 color: 'white',
                 textShadow: '0 2px 10px rgba(0,0,0,0.8)'
               }}
            >
              {movie.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                 <StarRounded sx={{ fontSize: 16, color: '#FFD700' }} />
                 <Typography variant="body2" fontWeight="bold" color="#FFD700">{movie.rating}</Typography>
               </Box>
               <Typography variant="caption" sx={{ color: '#ccc', bgcolor: 'rgba(255,255,255,0.1)', px: 1, py: 0.2, borderRadius: 1 }}>
                 {new Date(movie.releaseDate).getFullYear()}
               </Typography>
            </Box>
            
            <Typography variant="caption" sx={{ color: '#aaa', mt: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>
               {movie.genres?.[0]}
            </Typography>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default MovieCard;
