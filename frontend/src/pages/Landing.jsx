import React, { useState } from 'react';
import { Box, Typography, Button, Container, Grid, Card, TextField, Select, MenuItem, FormControl, InputAdornment, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  PlayCircleFilledRounded, 
  DevicesRounded, 
  CloudDownloadRounded, 
  FamilyRestroomRounded,
  StarRounded,
  ArrowForwardRounded,
  SearchRounded,
  FilterListRounded,
  LockRounded
} from '@mui/icons-material';

// Mock movie data for public preview
const mockMovies = [
  { id: 1, title: 'The Shawshank Redemption', rating: 9.3, year: 1994, genre: 'Drama', poster: 'https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_.jpg' },
  { id: 2, title: 'The Godfather', rating: 9.2, year: 1972, genre: 'Crime', poster: 'https://m.media-amazon.com/images/M/MV5BYTJkNGQyZDgtZDQ0NC00MDM0LWEzZWQtYzUzZDEwMDljZWNjXkEyXkFqcGc@._V1_.jpg' },
  { id: 3, title: 'The Dark Knight', rating: 9.0, year: 2008, genre: 'Action', poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg' },
  { id: 4, title: 'Pulp Fiction', rating: 8.9, year: 1994, genre: 'Crime', poster: 'https://m.media-amazon.com/images/M/MV5BYTViYTE3ZGQtNDBlMC00ZTAyLTkyODMtZGRiZDg0MjA2YThkXkEyXkFqcGc@._V1_.jpg' },
  { id: 5, title: 'Forrest Gump', rating: 8.8, year: 1994, genre: 'Drama', poster: 'https://m.media-amazon.com/images/M/MV5BNDYwNzVjMTItZmU5YS00YjQ5LTljYjgtMjY2NDVmYWMyNWFmXkEyXkFqcGc@._V1_.jpg' },
  { id: 6, title: 'Inception', rating: 8.8, year: 2010, genre: 'Sci-Fi', poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg' },
  { id: 7, title: 'Fight Club', rating: 8.8, year: 1999, genre: 'Drama', poster: 'https://m.media-amazon.com/images/M/MV5BOTgyOGQ1NDItNGU3Ny00MjU3LTg2YWEtNmEyYjBiMjI1Y2M5XkEyXkFqcGc@._V1_.jpg' },
  { id: 8, title: 'Interstellar', rating: 8.7, year: 2014, genre: 'Sci-Fi', poster: 'https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_.jpg' },
];

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [mockSearch, setMockSearch] = useState('');
  const [mockSort, setMockSort] = useState('rating');

  const handleEnterApp = () => {
    if (user?.role === 'ADMIN') navigate('/admin');
    else navigate('/browse');
  };

  const handleMovieClick = () => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/browse');
    }
  };

  const features = [
    { icon: <PlayCircleFilledRounded sx={{ fontSize: 50 }} />, title: 'Unlimited Streaming', desc: 'Watch IMDb Top 250 movies anytime, anywhere.' },
    { icon: <DevicesRounded sx={{ fontSize: 50 }} />, title: 'Multi-Device', desc: 'Stream on your phone, tablet, laptop, and TV.' },
    { icon: <CloudDownloadRounded sx={{ fontSize: 50 }} />, title: 'Smart Search', desc: 'Find movies by name, genre, or description instantly.' },
    { icon: <FamilyRestroomRounded sx={{ fontSize: 50 }} />, title: 'Role-Based Access', desc: 'Users browse, Admins manage. Secure and seamless.' },
  ];

  const stats = [
    { value: '250+', label: 'Top Movies' },
    { value: '10K+', label: 'Active Users' },
    { value: '4.9', label: 'User Rating' },
  ];

  return (
    <Box sx={{ bgcolor: '#0a0a0a', color: 'white', overflowX: 'hidden' }}>
      
      {/* ===== NAVBAR ===== */}
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, bgcolor: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #222' }}>
        <Container maxWidth="xl" sx={{ py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontFamily: 'Space Grotesk', fontWeight: 700 }}>
            Cine<span style={{ color: '#00D1FF' }}>Sphere</span>
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {isAuthenticated ? (
              <Button onClick={handleEnterApp} variant="contained" sx={{ bgcolor: '#00D1FF', color: 'black', fontWeight: 700 }}>Launch App</Button>
            ) : (
              <>
                <Button onClick={() => navigate('/login')} sx={{ color: 'white' }}>Log In</Button>
                <Button onClick={() => navigate('/register')} variant="contained" sx={{ bgcolor: '#00D1FF', color: 'black', fontWeight: 700 }}>Sign Up Free</Button>
              </>
            )}
          </Box>
        </Container>
      </Box>

      {/* ===== HERO SECTION ===== */}
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
        position: 'relative',
        pt: 10
      }}>
        <Box sx={{ position: 'absolute', top: '20%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,209,255,0.2) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <Box sx={{ position: 'absolute', bottom: '10%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(229,9,20,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Typography variant="overline" sx={{ color: '#00D1FF', fontWeight: 700, letterSpacing: 2, mb: 2, display: 'block' }}>
                  🎬 PREMIUM STREAMING PLATFORM
                </Typography>
                <Typography variant="h1" sx={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: { xs: '2.5rem', md: '4rem' }, lineHeight: 1.1, mb: 3 }}>
                  Your Gateway to <br/><span style={{ color: '#00D1FF' }}>Cinema Excellence</span>
                </Typography>
                <Typography variant="h6" sx={{ color: '#888', mb: 4, maxWidth: 500, lineHeight: 1.7 }}>
                  Explore the IMDb Top 250. Search, sort, and discover movies like never before. Built for movie lovers.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button 
                    onClick={() => navigate('/register')} 
                    variant="contained" 
                    size="large"
                    endIcon={<ArrowForwardRounded />}
                    sx={{ bgcolor: '#00D1FF', color: 'black', px: 5, py: 1.5, fontWeight: 700, fontSize: '1.1rem' }}
                  >
                    Start Watching
                  </Button>
                  <Button 
                    onClick={() => navigate('/login')} 
                    variant="outlined" 
                    size="large"
                    sx={{ borderColor: '#444', color: 'white', px: 4, py: 1.5, fontWeight: 600 }}
                  >
                    I Have an Account
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
                <Box sx={{ 
                  position: 'relative', 
                  height: { xs: 300, md: 500 }, 
                  borderRadius: 4, 
                  overflow: 'hidden',
                  boxShadow: '0 30px 60px rgba(0,209,255,0.15)',
                  border: '1px solid #333'
                }}>
                  <Box component="img" src="https://image.tmdb.org/t/p/original/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 3, background: 'linear-gradient(to top, #000, transparent)' }}>
                    <Typography variant="h5" fontWeight="bold">Featured: Oppenheimer</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <StarRounded sx={{ color: '#FFD700' }} />
                      <Typography>8.9 IMDb</Typography>
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ===== STATS BAR ===== */}
      <Box sx={{ py: 6, bgcolor: '#111', borderTop: '1px solid #222', borderBottom: '1px solid #222' }}>
        <Container maxWidth="md">
          <Grid container spacing={4} justifyContent="center">
            {stats.map((stat, i) => (
              <Grid item xs={4} key={i} sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#00D1FF' }}>{stat.value}</Typography>
                <Typography variant="body1" color="gray">{stat.label}</Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ===== PUBLIC MOVIE PREVIEW SECTION ===== */}
      <Box sx={{ py: 10, bgcolor: '#0d0d0d' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" sx={{ fontFamily: 'Space Grotesk', fontWeight: 700, mb: 2 }}>
              Explore Our Collection
            </Typography>
            <Typography variant="h6" color="gray" sx={{ mb: 4 }}>
              Get a taste of what awaits you. Sign up to unlock the full experience.
            </Typography>
          </Box>

          {/* Mock Search & Filter Bar */}
          <Box sx={{ display: 'flex', gap: 2, mb: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
            <TextField 
              placeholder="Search movies..."
              value={mockSearch}
              onChange={(e) => setMockSearch(e.target.value)}
              onClick={handleMovieClick}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchRounded sx={{ color: '#666' }} /></InputAdornment>,
                readOnly: true
              }}
              sx={{ 
                width: { xs: '100%', md: 400 },
                bgcolor: '#1a1a1a', 
                borderRadius: 2,
                cursor: 'pointer',
                input: { color: 'white', cursor: 'pointer' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00D1FF' }
              }}
            />
            <FormControl sx={{ minWidth: 180 }}>
              <Select
                value={mockSort}
                onChange={(e) => setMockSort(e.target.value)}
                onClick={handleMovieClick}
                displayEmpty
                sx={{ 
                  bgcolor: '#1a1a1a', 
                  color: 'white', 
                  borderRadius: 2,
                  '.MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
                  '.MuiSvgIcon-root': { color: 'white' }
                }}
              >
                <MenuItem value="rating">Sort: Rating</MenuItem>
                <MenuItem value="year">Sort: Year</MenuItem>
                <MenuItem value="name">Sort: Name</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {['Action', 'Drama', 'Sci-Fi', 'Crime'].map((genre) => (
                <Chip 
                  key={genre}
                  label={genre}
                  onClick={handleMovieClick}
                  sx={{ 
                    bgcolor: '#1a1a1a', 
                    color: 'white', 
                    border: '1px solid #333',
                    cursor: 'pointer',
                    '&:hover': { borderColor: '#00D1FF', bgcolor: 'rgba(0,209,255,0.1)' }
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Mock Movie Cards Grid */}
          <Grid container spacing={3}>
            {mockMovies.map((movie, index) => (
              <Grid item xs={6} sm={4} md={3} lg={1.5} key={movie.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  style={{ cursor: 'pointer' }}
                  onClick={handleMovieClick}
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
                      src={movie.poster}
                      alt={movie.title}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    
                    {/* Lock Overlay */}
                    <Box sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      right: 0, 
                      bottom: 0, 
                      bgcolor: 'rgba(0,0,0,0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s',
                      '&:hover': { opacity: 1 }
                    }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <LockRounded sx={{ fontSize: 40, color: '#00D1FF', mb: 1 }} />
                        <Typography variant="body2" fontWeight="bold">Sign Up to Watch</Typography>
                      </Box>
                    </Box>
                    
                    {/* Gradient Overlay */}
                    <Box sx={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      left: 0, 
                      right: 0, 
                      p: 1.5,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)'
                    }}>
                      <Typography variant="body2" fontWeight="bold" noWrap>{movie.title}</Typography>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                        <StarRounded sx={{ fontSize: 14, color: '#FFD700' }} />
                        <Typography variant="caption">{movie.rating}</Typography>
                        <Typography variant="caption" color="gray">• {movie.year}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* CTA to Sign Up */}
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button 
              onClick={() => navigate('/register')}
              variant="contained" 
              size="large"
              endIcon={<ArrowForwardRounded />}
              sx={{ bgcolor: '#00D1FF', color: 'black', px: 6, py: 1.5, fontWeight: 700, fontSize: '1.1rem' }}
            >
              Sign Up to Unlock All Movies
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ===== FEATURES SECTION ===== */}
      <Box sx={{ py: 12 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" sx={{ fontFamily: 'Space Grotesk', fontWeight: 700, mb: 2 }}>
            Why Choose CineSphere?
          </Typography>
          <Typography variant="h6" align="center" color="gray" sx={{ mb: 8, maxWidth: 600, mx: 'auto' }}>
            Everything you need for the ultimate movie experience.
          </Typography>
          <Grid container spacing={4}>
            {features.map((feat, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card sx={{ bgcolor: '#151515', border: '1px solid #222', borderRadius: 4, p: 3, height: '100%', textAlign: 'center', transition: 'all 0.3s', '&:hover': { borderColor: '#00D1FF', transform: 'translateY(-5px)' } }}>
                    <Box sx={{ color: '#00D1FF', mb: 2 }}>{feat.icon}</Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>{feat.title}</Typography>
                    <Typography variant="body2" color="gray">{feat.desc}</Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ===== HOW IT WORKS ===== */}
      <Box sx={{ py: 12, bgcolor: '#0d0d0d' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" sx={{ fontFamily: 'Space Grotesk', fontWeight: 700, mb: 8 }}>
            Get Started in 3 Steps
          </Typography>
          <Grid container spacing={6}>
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up for free in seconds.' },
              { step: '02', title: 'Browse Movies', desc: 'Explore IMDb Top 250 with smart filters.' },
              { step: '03', title: 'Enjoy & Manage', desc: 'Watch and manage your collection.' },
            ].map((item, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '5rem', fontWeight: 800, color: '#222', fontFamily: 'Space Grotesk' }}>{item.step}</Typography>
                  <Typography variant="h5" fontWeight="bold" sx={{ mt: -2, mb: 1 }}>{item.title}</Typography>
                  <Typography color="gray">{item.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ===== CTA SECTION ===== */}
      <Box sx={{ py: 12, background: 'linear-gradient(135deg, #00D1FF 0%, #0099cc 100%)', textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontFamily: 'Space Grotesk', fontWeight: 800, color: 'black', mb: 2 }}>
            Ready to Dive In?
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(0,0,0,0.7)', mb: 4 }}>
            Join thousands of movie enthusiasts today.
          </Typography>
          <Button 
            onClick={() => navigate('/register')} 
            variant="contained" 
            size="large"
            sx={{ bgcolor: 'black', color: 'white', px: 6, py: 2, fontSize: '1.2rem', fontWeight: 700, '&:hover': { bgcolor: '#222' } }}
          >
            Create Free Account
          </Button>
        </Container>
      </Box>

      {/* ===== FOOTER ===== */}
      <Box sx={{ py: 6, bgcolor: '#0a0a0a', borderTop: '1px solid #222' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" sx={{ fontFamily: 'Space Grotesk', fontWeight: 700, mb: 2 }}>
                Cine<span style={{ color: '#00D1FF' }}>Sphere</span>
              </Typography>
              <Typography variant="body2" color="gray">Premium movie discovery platform powered by IMDb Top 250.</Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Product</Typography>
              <Typography variant="body2" color="gray" sx={{ mb: 1, cursor: 'pointer' }}>Features</Typography>
              <Typography variant="body2" color="gray" sx={{ mb: 1, cursor: 'pointer' }}>Pricing</Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Company</Typography>
              <Typography variant="body2" color="gray" sx={{ mb: 1, cursor: 'pointer' }}>About</Typography>
              <Typography variant="body2" color="gray" sx={{ mb: 1, cursor: 'pointer' }}>Contact</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Legal</Typography>
              <Typography variant="body2" color="gray">© 2024 CineSphere. All rights reserved.</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
