import React, { useRef, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ArrowBackIosNewRounded, ArrowForwardIosRounded, NavigateNextRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard';

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

  if (!movies || movies.length === 0) return null;

  return (
    <Box sx={{ position: 'relative', px: { xs: 2, md: 6 }, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700, 
              fontFamily: 'Space Grotesk',
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              color: 'rgba(255,255,255,0.95)',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Box component="span" sx={{ width: 4, height: 24, bgcolor: '#00D1FF', borderRadius: 1 }} />
            {title}
          </Typography>

          <Box 
            sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer', 
                color: '#00D1FF', 
                opacity: 0, 
                transition: 'all 0.3s',
                transform: 'translateX(-10px)',
                '.row-container:hover &': { opacity: 1, transform: 'translateX(0)' }
            }}
            onClick={() => navigate('/browse')}
            className="explore-link"
          >
              <Typography variant="body2" fontWeight="bold">Explore All</Typography>
              <NavigateNextRounded />
          </Box>
      </Box>

      <Box className="row-container" sx={{ position: 'relative', '&:hover .nav-arrow': { opacity: 1 } }}>
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
            bgcolor: 'rgba(5,5,5,0.8)',
            border: '1px solid rgba(255,255,255,0.1)',
            opacity: 0,
            transition: 'all 0.2s',
            backdropFilter: 'blur(5px)',
            display: !isMoved ? 'none' : 'flex',
            '&:hover': { bgcolor: '#00D1FF', color: 'black', borderColor: '#00D1FF' }
          }}
        >
          <ArrowBackIosNewRounded fontSize="small" />
        </IconButton>

        {/* Movie Cards Container */}
        <Box 
          ref={rowRef}
          sx={{ 
            display: 'flex', 
            gap: 2.5, 
            overflowX: 'auto', 
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            pb: 4,
            pt: 1,
            px: 1
          }}
        >
          {movies.map((movie) => (
            <Box key={movie._id} sx={{ minWidth: { xs: 140, sm: 180, md: 220 }, width: { xs: 140, sm: 180, md: 220 } }}>
               <MovieCard movie={movie} />
            </Box>
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
            bgcolor: 'rgba(5,5,5,0.8)',
            border: '1px solid rgba(255,255,255,0.1)',
            opacity: 0,
            transition: 'all 0.2s',
            backdropFilter: 'blur(5px)',
            '&:hover': { bgcolor: '#00D1FF', color: 'black', borderColor: '#00D1FF' }
          }}
        >
          <ArrowForwardIosRounded fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MovieRow;
