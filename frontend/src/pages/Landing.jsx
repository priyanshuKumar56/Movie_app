import React, { useState } from 'react';
import { Box, Typography, Button, Container, Grid, Card,Select,MenuItem, FormControl, InputAdornment, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlayCircleFilledRounded, 
  DevicesRounded, 
   
  FamilyRestroomRounded,
  StarRounded,
  ArrowForwardRounded,
  
  LockRounded,
  
  TrendingUpRounded
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
  // const [mockSearch, setMockSearch] = useState('');
  const [mockSort, setMockSort] = useState('rating');

  const handleEnterApp = () => {
    if (user?.role === 'ADMIN') navigate('/admin');
    else navigate('/browse');
  };

  // Redirect on interaction
  const handleInteraction = () => {
    if (!isAuthenticated) navigate('/register');
    else navigate('/browse');
  };

  const features = [
    { icon: <PlayCircleFilledRounded sx={{ fontSize: 40 }} />, title: 'Unlimited 4K Streaming', desc: 'Experience cinema-quality visual fidelity with our adaptive 4K streaming technology.' },
    { icon: <DevicesRounded sx={{ fontSize: 40 }} />, title: 'Cross-Platform Sync', desc: 'Start on your TV, finish on your phone. Your progress follows you everywhere.' },
    { icon: <TrendingUpRounded sx={{ fontSize: 40 }} />, title: 'Curated Collections', desc: 'Hand-picked lists by film critics and community voting ensure you watch only the best.' },
    { icon: <FamilyRestroomRounded sx={{ fontSize: 40 }} />, title: 'Family Friendly', desc: 'Robust parental controls and dedicated kids profiles for safe viewing.' },
  ];

  const stats = [
    { value: '250+', label: 'Masterpieces' },
    { value: '1M+', label: 'Monthly Users' },
    { value: '4.9', label: 'App Store Rating' },
  ];

  return (
    <Box sx={{ bgcolor: '#000', color: 'white', overflowX: 'hidden', minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>
      
      {/* ===== NAVBAR ===== */}
      <Box 
        component={motion.div}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ 
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, 
          bgcolor: 'rgba(0,0,0,0.7)', 
          backdropFilter: 'blur(12px)', 
          borderBottom: '1px solid rgba(255,255,255,0.05)' 
        }}
      >
        <Container maxWidth="xl" sx={{ py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontFamily: 'Space Grotesk', 
              fontWeight: 800, 
              background: 'linear-gradient(45deg, #fff, #00D1FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-1px'
            }}
          >
            Cine<span style={{ WebkitTextFillColor: '#00D1FF' }}>Sphere</span>
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {isAuthenticated ? (
              <Button 
                onClick={handleEnterApp} 
                variant="contained" 
                sx={{ 
                  bgcolor: '#00D1FF', 
                  color: 'black', 
                  fontWeight: 700, 
                  borderRadius: '50px',
                  px: 3,
                  '&:hover': { bgcolor: '#33E1FF', transform: 'scale(1.05)' }
                }}
              >
                Launch App
              </Button>
            ) : (
              <>
                <Button 
                  onClick={() => navigate('/login')} 
                  sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white' } }}
                >
                  Log In
                </Button>
                <Button 
                  onClick={() => navigate('/register')} 
                  variant="contained" 
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'black', 
                    fontWeight: 700,
                    borderRadius: '50px',
                    px: 3,
                    '&:hover': { bgcolor: '#f0f0f0', transform: 'scale(1.05)' }
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Container>
      </Box>

      {/* ===== HERO SECTION ===== */}
      <Box sx={{ 
        position: 'relative', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center',
        overflow: 'hidden',
        pt: 10
      }}>
        {/* Background Gradients */}
        <Box sx={{ 
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'radial-gradient(circle at 15% 50%, rgba(0, 209, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 85% 30%, rgba(229, 9, 20, 0.1) 0%, transparent 50%)',
          zIndex: 0
        }} />
        <Box sx={{ 
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '100vw', height: '100vh',
          background: 'url("https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg") center/cover no-repeat',
          opacity: 0.05,
          zIndex: -1
        }} />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
                <Chip 
                  label="Available on all platforms" 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.1)', 
                    color: '#00D1FF', 
                    border: '1px solid rgba(0,209,255,0.2)',
                    mb: 3,
                    fontWeight: 600
                  }} 
                />
                <Typography variant="h1" sx={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: { xs: '3.5rem', md: '5.5rem' }, lineHeight: 1.1, mb: 3 }}>
                  Storytelling <br/>
                  <span style={{ 
                    background: 'linear-gradient(90deg, #00D1FF 0%, #ffffff 100%)', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent' 
                  }}>
                    Redefined.
                  </span>
                </Typography>
                <Typography variant="h6" sx={{ color: '#aaa', mb: 5, maxWidth: 550, lineHeight: 1.8, fontSize: '1.1rem' }}>
                  Dive into a world of curated cinema. From timeless classics to modern masterpieces, CineSphere is your gateway to the art of film.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button 
                    onClick={() => navigate('/register')} 
                    variant="contained" 
                    size="large"
                    endIcon={<ArrowForwardRounded />}
                    sx={{ 
                      bgcolor: '#00D1FF', 
                      color: 'black', 
                      px: 5, py: 2, 
                      fontWeight: 700, 
                      fontSize: '1.1rem',
                      borderRadius: '12px',
                      boxShadow: '0 10px 30px rgba(0,209,255,0.3)',
                      transition: 'all 0.3s',
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 20px 40px rgba(0,209,255,0.4)', bgcolor: '#33E1FF' }
                    }}
                  >
                    Start Your Journey
                  </Button>
                  <Button 
                    onClick={() => navigate('/login')} 
                    variant="outlined" 
                    size="large"
                    startIcon={<PlayCircleFilledRounded />}
                    sx={{ 
                      borderColor: 'rgba(255,255,255,0.2)', 
                      color: 'white', 
                      px: 4, py: 2, 
                      fontWeight: 600,
                      borderRadius: '12px',
                      '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' }
                    }}
                  >
                    Watch Demo
                  </Button>
                </Box>
                
                <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                  {stats.map((stat, i) => (
                    <Box key={i}>
                      <Typography variant="h4" fontWeight="bold" color="white">{stat.value}</Typography>
                      <Typography variant="caption" color="gray" fontWeight="600" sx={{ letterSpacing: 1, textTransform: 'uppercase' }}>{stat.label}</Typography>
                    </Box>
                  ))}
                </Box>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <motion.div 
                initial={{ opacity: 0, y: 50, rotate: 5 }} 
                animate={{ opacity: 1, y: 0, rotate: 0 }} 
                transition={{ duration: 1, type: "spring" }}
              >
                <Box sx={{ position: 'relative', perspective: '1000px', transformStyle: 'preserve-3d', maxWidth: 550, mx: 'auto' }}>
                  {/* Floating Cards Effect */}
                  <Card sx={{ 
                    position: 'relative', 
                    zIndex: 2,
                    borderRadius: 4, 
                    overflow: 'hidden', 
                    boxShadow: '0 50px 100px rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    bgcolor: '#1a1a1a',
                    transform: 'rotateY(-10deg) rotateX(5deg)',
                    transition: 'transform 0.5s',
                    '&:hover': { transform: 'rotateY(0deg) rotateX(0deg) scale(1.02)' }
                  }}>
                    <Box component="img" src="https://image.tmdb.org/t/p/original/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg" sx={{ width: '100%', height: 'auto', display: 'block' }} />
                    <Box sx={{ 
                      position: 'absolute', bottom: 0, left: 0, right: 0, 
                      background: 'linear-gradient(to top, rgba(0,0,0,1), transparent)', 
                      p: 4, pt: 12 
                    }}>
                      <Typography variant="h4" fontFamily="Space Grotesk" fontWeight="bold">The Lord of the Rings</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <StarRounded sx={{ color: '#FFD700' }} />
                        <Typography fontWeight="bold">9.0</Typography>
                        <Typography color="gray">• Fantasy • 2003</Typography>
                      </Box>
                    </Box>
                  </Card>
                  
                  {/* Decorative Elements */}
                  <Box sx={{ 
                    position: 'absolute', top: -30, right: -30, zIndex: 1,
                    width: '100%', height: '100%', 
                    borderRadius: 4, 
                    border: '2px dashed rgba(255,255,255,0.1)',
                    transform: 'translateZ(-50px)'
                  }} />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ===== FEATURES GRID ===== */}
      <Box sx={{ py: 15, bgcolor: '#050505' }}>
        <Container maxWidth="lg">
          <Typography variant="overline" color="primary" fontWeight="bold" letterSpacing={2} align="center" display="block" mb={1}>
            PREMIUM EXPERIENCE
          </Typography>
          <Typography variant="h3" align="center" sx={{ fontFamily: 'Space Grotesk', fontWeight: 700, mb: 10 }}>
            Why CineSphere is <span style={{ color: '#00D1FF' }}>Different</span>
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feat, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <motion.div whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Box sx={{ 
                    p: 4, 
                    height: '100%',
                    borderRadius: 4, 
                    bgcolor: '#0a0a0a', 
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.3s',
                    '&:hover': { 
                      bgcolor: '#111', 
                      borderColor: '#00D1FF',
                      boxShadow: '0 10px 30px rgba(0,209,255,0.1)'
                    }
                  }}>
                    <Box sx={{ 
                      color: '#00D1FF', 
                      mb: 3, 
                      p: 2, 
                      bgcolor: 'rgba(0,209,255,0.1)', 
                      borderRadius: '16px', 
                      width: 'fit-content' 
                    }}>
                      {feat.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>{feat.title}</Typography>
                    <Typography variant="body2" color="gray" lineHeight={1.6}>{feat.desc}</Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ===== DISCOVERY PREVIEW ===== */}
      <Box sx={{ py: 15, bgcolor: '#000', position: 'relative' }}>
         <Box sx={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, #222, transparent)' }} />
         
         <Container maxWidth="xl">
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'center', md: 'end' }, mb: 8, gap: 4 }}>
              <Box>
                <Typography variant="h3" sx={{ fontFamily: 'Space Grotesk', fontWeight: 700, mb: 2 }}>
                  Browse the <span style={{ color: '#E50914' }}>Classics</span>
                </Typography>
                <Typography variant="h6" color="gray" sx={{ maxWidth: 600 }}>
                  A sneak peek into our vast library of high-fidelity content. <br/>
                  <span style={{ color: '#fff', fontSize: '0.9rem' }}>Join to unlock all features.</span>
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl variant="filled" hiddenLabel size="small">
                   <Select 
                      value={mockSort} 
                      onChange={(e) => setMockSort(e.target.value)}
                      sx={{ bgcolor: '#1a1a1a', borderRadius: 2, color: 'white', '& .MuiSvgIcon-root': { color: 'white' } }}
                   >
                      <MenuItem value="rating">Top Rated</MenuItem>
                      <MenuItem value="year">Newest</MenuItem>
                   </Select>
                </FormControl>
                <Button 
                   endIcon={<ArrowForwardRounded />}
                   onClick={() => navigate('/register')}
                   sx={{ color: '#00D1FF' }}
                >
                  View All
                </Button>
              </Box>
            </Box>

            <Grid container spacing={3}>
              {mockMovies.map((movie, index) => (
                <Grid item xs={6} sm={4} md={3} lg={1.5} key={movie.id}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -10 }}
                    style={{ cursor: 'pointer' }}
                    onClick={handleInteraction}
                  >
                    <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', aspectRatio: '2/3', bgcolor: '#111' }}>
                      <Box component="img" src={movie.poster} sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', '&:hover': { transform: 'scale(1.1)' } }} />
                      
                      {/* Hover Overlay */}
                      <Box sx={{ 
                        position: 'absolute', inset: 0, 
                        bgcolor: 'rgba(0,0,0,0.8)', 
                        opacity: 0, 
                        transition: '0.3s', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        '&:hover': { opacity: 1 }
                      }}>
                        <LockRounded sx={{ color: '#00D1FF', fontSize: 40, mb: 1 }} />
                        <Typography variant="caption" fontWeight="bold">SUBSCRIBE</Typography>
                      </Box>
                    </Box>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 1.5 }} noWrap>{movie.title}</Typography>
                    <Typography variant="caption" color="gray">{movie.year} • {movie.genre}</Typography>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
         </Container>
      </Box>

      {/* ===== CALL TO ACTION ===== */}
      <Box sx={{ 
        py: 15, 
        position: 'relative', 
        overflow: 'hidden',
        textAlign: 'center',
      }}>
        <Box sx={{ 
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'linear-gradient(135deg, #00D1FF 0%, #0066cc 100%)',
          opacity: 0.1,
          zIndex: -1
        }} />
        
        <Container maxWidth="md">
          <Typography variant="h2" sx={{ fontFamily: 'Space Grotesk', fontWeight: 800, mb: 3 }}>
            Ready to Stream?
          </Typography>
          <Typography variant="h6" color="#888" sx={{ mb: 6 }}>
            Join the fastest growing community of movie lovers today.
          </Typography>
          
          <Button 
            onClick={() => navigate('/register')} 
            variant="contained" 
            size="large"
            sx={{ 
              bgcolor: 'white', 
              color: 'black', 
              px: 8, py: 2.5, 
              fontSize: '1.2rem', 
              fontWeight: 800,
              borderRadius: '50px',
              boxShadow: '0 20px 40px rgba(255,255,255,0.1)',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.05)', bgcolor: '#f5f5f5' }
            }}
          >
            Create Your Free Account
          </Button>
          <Typography variant="caption" display="block" sx={{ mt: 2, color: '#666' }}>
            No credit card required for standard access.
          </Typography>
        </Container>
      </Box>

      {/* ===== FOOTER ===== */}
      <Box sx={{ py: 8, borderTop: '1px solid #222', bgcolor: '#050505' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="space-between">
            <Grid item xs={12} md={4}>
              <Typography variant="h5" sx={{ fontFamily: 'Space Grotesk', fontWeight: 700, mb: 2 }}>
                Cine<span style={{ color: '#00D1FF' }}>Sphere</span>
              </Typography>
              <Typography variant="body2" color="gray">
                The ultimate destination for movie enthusiasts. Discover, track, and watch your favorite films in one place.
              </Typography>
            </Grid>
            
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" fontWeight="bold" color="white" gutterBottom>Platform</Typography>
              <Typography variant="body2" color="gray" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#00D1FF' } }}>Browse Movies</Typography>
              <Typography variant="body2" color="gray" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#00D1FF' } }}>Top Rated</Typography>
              <Typography variant="body2" color="gray" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#00D1FF' } }}>Coming Soon</Typography>
            </Grid>
            
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" fontWeight="bold" color="white" gutterBottom>Community</Typography>
              <Typography variant="body2" color="gray" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#00D1FF' } }}>Forums</Typography>
              <Typography variant="body2" color="gray" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#00D1FF' } }}>Guidelines</Typography>
              <Typography variant="body2" color="gray" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#00D1FF' } }}>Support</Typography>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Typography variant="subtitle2" fontWeight="bold" color="white" gutterBottom>Administrative</Typography>
              <Button 
                startIcon={<LockRounded fontSize="small" />}
                onClick={() => navigate('/admin/login')}
                sx={{ 
                  textTransform: 'none', 
                  color: 'gray', 
                  p: 0,
                  '&:hover': { color: '#E50914', bgcolor: 'transparent' } 
                }}
              >
                Admin Login
              </Button>
            </Grid>
          </Grid>
          <Box sx={{ mt: 8, pt: 4, borderTop: '1px solid #1a1a1a', textAlign: 'center' }}>
            <Typography variant="caption" color="#444">© 2024 CineSphere Inc. All rights reserved.</Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
