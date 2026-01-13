
import React from 'react';
import { Box, Typography,  Grid, Paper } from '@mui/material';
import { AttachMoneyRounded, MovieCreationRounded, PeopleAltRounded, TrendingUpRounded } from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }) => (
  <Paper sx={{ 
    p: 3, 
    bgcolor: '#141414', 
    border: '1px solid #222', 
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    transition: 'transform 0.2s',
    '&:hover': { transform: 'translateY(-5px)', borderColor: color }
  }}>
    <Box sx={{ p: 2, borderRadius: '50%', bgcolor: `${color}20`, color: color }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="body2" color="gray" fontWeight="600">{title}</Typography>
      <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>{value}</Typography>
    </Box>
  </Paper>
);

const ActivityChart = ({ movies }) => {
    const genres = {};
    movies.forEach(m => {
        if(m.genres) {
            m.genres.forEach(g => {
                genres[g] = (genres[g] || 0) + 1;
            });
        }
    });

    // Get top 7 genres for better distribution view
    const sortedGenres = Object.entries(genres).sort((a,b) => b[1] - a[1]).slice(0, 7);
    const maxCount = Math.max(...sortedGenres.map(g => g[1]), 1); // Avoid div by zero
    
    // SVG Dimensions
    const height = 250;
    const width = 600;
    const padding = 40;
    const barWidth = 40;
    const gap = (width - (padding * 2) - (sortedGenres.length * barWidth)) / (sortedGenres.length - 1);

    return (
        <Paper sx={{ p: 4, bgcolor: '#141414', border: '1px solid #222', borderRadius: 4, height: '100%', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight="bold">Genre Analytics</Typography>
                  <Typography variant="caption" color="gray">Distribution of content across categories</Typography>
                </Box>
                <TrendingUpRounded sx={{ color: '#E50914' }} />
            </Box>
            
            <Box sx={{ width: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
                <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ minWidth: 500 }}>
                    {/* Gradients */}
                    <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#E50914" />
                            <stop offset="100%" stopColor="#8a040b" />
                        </linearGradient>
                    </defs>

                    {/* Grid Lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
                        const y = padding + (height - padding * 2) * (1 - tick);
                        return (
                            <g key={i}>
                                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#333" strokeDasharray="4 4" strokeWidth="1" />
                                <text x={padding - 10} y={y + 4} fill="#666" fontSize="10" textAnchor="end">{Math.round(tick * maxCount)}</text>
                            </g>
                        );
                    })}

                    {/* Bars */}
                    {sortedGenres.map(([genre, count], i) => {
                        const barHeight = (count / maxCount) * (height - padding * 2);
                        const x = padding + i * (barWidth + gap);
                        const y = height - padding - barHeight;
                        
                        return (
                            <g key={genre} className="chart-bar">
                                {/* Bar */}
                                <rect 
                                    x={x} 
                                    y={y} 
                                    width={barWidth} 
                                    height={barHeight} 
                                    rx={4}
                                    fill="url(#barGradient)"
                                    style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                                />
                                {/* Hover Effect Overlay (invisible usually, handled via CSS) */}
                                <rect 
                                    x={x} 
                                    y={padding} 
                                    width={barWidth} 
                                    height={height - padding * 2} 
                                    fill="transparent"
                                    onMouseEnter={(e) => {
                                      // Simple tooltip logic could go here, or handled via parent state
                                    }}
                                />
                                {/* Label */}
                                <text 
                                    x={x + barWidth / 2} 
                                    y={height - padding + 20} 
                                    fill="#888" 
                                    fontSize="11" 
                                    textAnchor="middle" 
                                    fontWeight="bold"
                                    style={{ textTransform: 'uppercase' }}
                                >
                                    {genre.substring(0, 6)}
                                </text>
                                {/* Value on top */}
                                <text 
                                    x={x + barWidth / 2} 
                                    y={y - 8} 
                                    fill="white" 
                                    fontSize="12" 
                                    textAnchor="middle" 
                                    fontWeight="bold"
                                >
                                    {count}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </Box>
        </Paper>
    );
};

const RecentMovies = ({ movies }) => {
    // Last 5 movies
    const recent = [...movies].sort((a,b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt)).slice(0, 5);

    return (
        <Paper sx={{ p: 4, bgcolor: '#141414', border: '1px solid #222', borderRadius: 4, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" mb={3}>Recently Added</Typography>
            <Box >
                {recent.map((movie, i) => (
                    <Box key={movie._id} sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2, 
                        mb: 2, 
                        p: 1.5, 
                        borderRadius: 2,
                        '&:hover': { bgcolor: '#1f1f1f' } 
                    }}>
                        <Box component="img" src={movie.posterUrl} sx={{ width: 40, height: 60, borderRadius: 1, objectFit: 'cover' }} />
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" fontWeight="bold" noWrap>{movie.title}</Typography>
                            <Typography variant="caption" color="gray">{new Date(movie.releaseDate).getFullYear()} • {movie.genres?.[0]}</Typography>
                        </Box>
                        <Box sx={{ p: 0.5, px: 1, bgcolor: '#222', borderRadius: 1 }}>
                             <Typography variant="caption" fontWeight="bold" color="#E50914">{movie.rating}</Typography>
                        </Box>
                    </Box>
                ))}
                {recent.length === 0 && <Typography color="gray" align="center">No movies added yet.</Typography>}
            </Box>
        </Paper>
    );
};

const AdminDashboard = ({ movies }) => {
  const totalMovies = movies.length;
  const avgRating = movies.length ? (movies.reduce((a, m) => a + m.rating, 0) / movies.length).toFixed(1) : 0;
  
  return (
    <Box>
      <Typography variant="h4" sx={{ fontFamily: 'Space Grotesk', fontWeight: 700, mb: 4 }}>Overview</Typography>
      
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Movies" value={totalMovies} icon={<MovieCreationRounded />} color="#E50914" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Average Rating" value={avgRating} icon={<AttachMoneyRounded />} color="#FFD700" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Users" value="2.4k" icon={<PeopleAltRounded />} color="#00D1FF" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Traffic Growth" value="+12%" icon={<TrendingUpRounded />} color="#4CAF50" />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
            <ActivityChart movies={movies} />
        </Grid>
        <Grid item xs={12} md={5}>
            <RecentMovies movies={movies} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
