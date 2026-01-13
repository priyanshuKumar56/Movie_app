import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import { fetchMoviesByCategory } from '../../app/slices/movieSlice';
import MovieRow from './MovieRow';
import RowSkeleton from './RowSkeleton';
import { Box } from '@mui/material';

const LazyRow = ({ id, title, genre, sort }) => {
  const dispatch = useDispatch();
  const { data, loading, loaded } = useSelector((state) => state.movies.categories[id] || { data: [], loading: false, loaded: false });
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px', // Fetch 200px before it comes into view
  });

  useEffect(() => {
    if (inView && !loaded && !loading) {
      dispatch(fetchMoviesByCategory({ category: id, genre, sort }));
    }
  }, [inView, loaded, loading, id, genre, sort, dispatch]);

  if (!inView && !loaded) {
    return <Box ref={ref} sx={{ minHeight: 300, mb: 4 }} />; // Placeholder to trigger intersection
  }

  if (loading && !loaded) {
    return (
      <Box ref={ref} sx={{  mb: 4 }}>
        <RowSkeleton title={title} />
      </Box>
    );
  }

  if (data && data.length > 0) {
    return (
      <Box sx={{ mb: 4 }}>
         <MovieRow title={title} movies={data} />
      </Box>
    );
  }

  return null; // Hide if no data found
};

export default LazyRow;
