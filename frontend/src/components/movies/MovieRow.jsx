import React, { useRef, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ArrowBackIosNewRounded, ArrowForwardIosRounded } from '@mui/icons-material';
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
    <Box sx={{ mb: 4, position: 'relative', px: { xs: 2, md: 4 } }}>
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 2, 
          fontWeight: 700, 
          fontFamily: 'Space Grotesk',
          fontSize: { xs: '1.2rem', md: '1.5rem' },
          color: 'white'
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
            left: -20, 
            top: '50%', 
            transform: 'translateY(-50%)',
            zIndex: 40,
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.7)',
            opacity: 0,
            transition: 'all 0.2s',
            display: !isMoved ? 'none' : 'flex',
            '&:hover': { bgcolor: '#00D1FF', color: 'black' }
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
            py: 1
          }}
        >
          {movies.map((movie) => (
            <motion.div
              key={movie._id}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              transition={{ duration: 0.2 }}
              style={{ flexShrink: 0, cursor: 'pointer' }}
              onClick={() => navigate(`/movies/${movie._id}`)}
            >
              <Box 
                sx={{ 
                  position: 'relative',
                  width: { xs: 140, md: 180 },
                  height: { xs: 200, md: 260 },
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }}
              >
                <Box
                  component="img"
                  src={movie.posterUrl || 'https://via.placeholder.com/180x260'}
                  alt={movie.title}
                  sx={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'transform 0.3s'
                  }}
                />
                {/* Hover Overlay */}
                <Box 
                  sx={{ 
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 1.5,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    '&:hover': { opacity: 1 }
                  }}
                  className="card-overlay"
                >
                  <Typography variant="body2" fontWeight="bold" noWrap>{movie.title}</Typography>
                  <Typography variant="caption" color="#00D1FF">{movie.rating} ★</Typography>
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
            right: -20, 
            top: '50%', 
            transform: 'translateY(-50%)',
            zIndex: 40,
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.7)',
            opacity: 0,
            transition: 'all 0.2s',
            '&:hover': { bgcolor: '#00D1FF', color: 'black' }
          }}
        >
          <ArrowForwardIosRounded />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MovieRow;
