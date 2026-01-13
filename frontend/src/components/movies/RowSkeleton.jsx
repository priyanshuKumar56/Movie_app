import React from 'react';
import { Box, Skeleton, IconButton } from '@mui/material';
import { ArrowBackIosNewRounded, ArrowForwardIosRounded } from '@mui/icons-material';

const RowSkeleton = ({ title }) => {
  return (
    <Box sx={{ position: 'relative', px: { xs: 2, md: 6 }, mb: 4 }}>
      {/* Title Skeleton */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Skeleton variant="rectangular" width={4} height={24} sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1, mr: 1 }} />
        <Skeleton variant="text" width={200} height={32} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
      </Box>

      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {/* Navigation Arrow Skeleton */}
        <Box sx={{ position: 'absolute', left: -20, zIndex: 10 }}>
           <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
        </Box>

        {/* Cards Skeleton */}
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 2.5, 
            overflowX: 'hidden', 
            width: '100%',
            pb: 4
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Box key={item} sx={{ minWidth: { xs: 140, sm: 180, md: 220 }, width: { xs: 140, sm: 180, md: 220 } }}>
               <Skeleton 
                 variant="rectangular" 
                 width="100%" 
                 sx={{ 
                   aspectRatio: '2/3', 
                   bgcolor: 'rgba(255,255,255,0.08)',
                   borderRadius: 3,
                   mb: 1
                 }} 
               />
            </Box>
          ))}
        </Box>
        
         {/* Navigation Arrow Skeleton */}
         <Box sx={{ position: 'absolute', right: -20, zIndex: 10 }}>
           <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
        </Box>
      </Box>
    </Box>
  );
};

export default RowSkeleton;
