import React, { useRef, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ArrowBackIosNewRounded, ArrowForwardIosRounded, StarRounded, PlayCircleFilledWhiteRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MovieRow = ({ title, movies }) => {
  const rowRef = useRef(null);
  const [isMoved, setIsMoved] = useState(false);
  const navigate = useNavigate();

  const handleClick = (direction) => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ position: 'relative', px: { xs: 2, md: 6 } }}>
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 2, 
          fontWeight: 700, 
          fontFamily: 'Space Grotesk',
          fontSize: { xs: '1.2rem', md: '1.5rem' },
          color: 'rgba(255,255,255,0.9)',
          borderLeft: '4px solid #00D1FF',
          pl: 2
        }}
      >
        {title}
      </Typography>

      <Box sx={{ position: 'relative', '&:hover .nav-arrow': { opacity: 1 } }}>
        {/* Left Arrow */}
        <IconButton 
          className="nav-arrow"
          onClick={() => handleClick('left')}
          sx={{ 
            position: 'absolute', 
            left: -25, 
            top: '50%', 
            transform: 'translateY(-50%)',
            zIndex: 40,
            color: 'white',
            bgcolor: 'rgba(20,20,20,0.8)',
            border: '1px solid #333',
            opacity: 0,
            transition: 'all 0.2s',
            display: !isMoved ? 'none' : 'flex',
            '&:hover': { bgcolor: '#00D1FF', color: 'black', borderColor: '#00D1FF' }
          }}
        >
          <ArrowBackIosNewRounded />
        </IconButton>

        {/* Movie Cards Container */}
        <Box 
          ref={rowRef}
          sx={{ 
            display: 'flex', 
            gap: 2, 
            overflowX: 'auto', 
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            pb: 4, // Space for hover zoom
            pt: 1,
            px: 1
          }}
        >
          {movies.map((movie) => (
            <motion.div
              key={movie._id}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.2 }}
              style={{ flexShrink: 0, cursor: 'pointer' }}
              onClick={() => navigate(`/movies/${movie._id}`)}
            >
              <Box 
                sx={{ 
                  position: 'relative',
                  width: { xs: 150, md: 200 },
                  height: { xs: 225, md: 300 },
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                  bgcolor: '#1a1a1a'
                }}
              >
                <Box
                  component="img"
                  src={movie.posterUrl || 'https://via.placeholder.com/200x300'}
                  alt={movie.title}
                  sx={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                  }}
                />
                
                {/* Hover Overlay */}
                <Box 
                  sx={{ 
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.6), transparent)',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    '&:hover': { opacity: 1 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    p: 2
                  }}
                >
                  <PlayCircleFilledWhiteRounded sx={{ fontSize: 40, color: '#00D1FF', mb: 'auto', alignSelf: 'center', mt: 'auto', opacity: 0.8 }} />
                  
                  <Typography variant="body1" fontWeight="bold" noWrap sx={{ mb: 0.5 }}>{movie.title}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
                     <Typography variant="caption" color="rgba(255,255,255,0.7)">
                       {new Date(movie.releaseDate).getFullYear()} • {movie.genres?.[0]}
                     </Typography>
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                       <StarRounded sx={{ fontSize: 14, color: '#FFD700' }} />
                       <Typography variant="caption" fontWeight="bold" color="#FFD700">{movie.rating}</Typography>
                     </Box>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          ))}
        </Box>

        {/* Right Arrow */}
        <IconButton 
          className="nav-arrow"
          onClick={() => handleClick('right')}
          sx={{ 
            position: 'absolute', 
            right: -25, 
            top: '50%', 
            transform: 'translateY(-50%)',
            zIndex: 40,
            color: 'white',
            bgcolor: 'rgba(20,20,20,0.8)',
            border: '1px solid #333',
            opacity: 0,
            transition: 'all 0.2s',
            '&:hover': { bgcolor: '#00D1FF', color: 'black', borderColor: '#00D1FF' }
          }}
        >
          <ArrowForwardIosRounded />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MovieRow;
