# 🎬 Netflix-Grade Movie Platform

> A production-ready, scalable movie application with microservices architecture, advanced caching, and enterprise-level features.

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Home   │  │  Search  │  │  Admin   │  │  Profile │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                    ┌───────┴───────┐
                    │  API Gateway  │
                    │   (Express)   │
                    └───────┬───────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
   ┌────▼────┐        ┌────▼────┐        ┌────▼────┐
   │  Auth   │        │  Movie  │        │ Search  │
   │ Service │        │ Service │        │ Service │
   └────┬────┘        └────┬────┘        └────┬────┘
        │                   │                   │
   ┌────▼────┐        ┌────▼────┐        ┌────▼────┐
   │ MongoDB │        │ MongoDB │        │  Redis  │
   │  Users  │        │  Movies │        │  Cache  │
   └─────────┘        └────┬────┘        └─────────┘
                            │
                      ┌────▼────┐
                      │ BullMQ  │
                      │  Queue  │
                      └─────────┘
```

## 🚀 Key Features

### Netflix-Level Capabilities
- ✅ **Microservices Architecture** - Independent scaling
- ✅ **Redis Caching** - 90% faster reads
- ✅ **Job Queue System** - Async IMDb data ingestion
- ✅ **Advanced Search** - Fuzzy search with debouncing
- ✅ **JWT + RBAC** - Enterprise security
- ✅ **Rate Limiting** - API abuse prevention
- ✅ **Error Tracking** - Winston logging + Sentry integration
- ✅ **Infinite Scroll** - Smooth UX like Netflix
- ✅ **Skeleton Loaders** - Perceived performance
- ✅ **Responsive Design** - Mobile-first approach

### Advanced Features
- 🎯 **Watch History** - Track user viewing
- 📊 **Trending Movies** - Popularity algorithm
- 🔐 **Audit Logs** - Admin action tracking
- 🎨 **Dark Mode** - System preference detection
- 📱 **PWA Ready** - Installable web app
- 🌐 **API Versioning** - Backward compatibility

## 📦 Tech Stack

### Frontend
- **React 18** - Latest features (Suspense, Transitions)
- **Redux Toolkit** - State management
- **React Router v6** - Navigation
- **Material-UI v5** - Component library
- **Framer Motion** - Animations
- **React Query** - Server state caching
- **Axios** - HTTP client with interceptors

### Backend
- **Node.js 18+** - Runtime
- **Express.js** - Web framework
- **MongoDB + Mongoose** - Database
- **Redis** - Caching layer
- **BullMQ** - Job queue
- **JWT** - Authentication
- **Helmet** - Security headers
- **Express Rate Limit** - API protection
- **Winston** - Logging
- **Joi** - Validation

### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **Vercel** - Frontend hosting
- **Railway** - Backend hosting
- **MongoDB Atlas** - Database hosting
- **Redis Cloud** - Cache hosting

## 🛠️ Installation

### Prerequisites
```bash
node >= 18.0.0
npm >= 9.0.0
MongoDB >= 6.0
Redis >= 7.0
```

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Configure your .env file
npm run dev
```

### Docker Setup (Recommended)
```bash
docker-compose up -d
```

## 🔧 Environment Variables

### Backend (.env)
```env
# Server
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
MONGODB_URI=mongodb://localhost:27017/movieapp
MONGODB_TEST_URI=mongodb://localhost:27017/movieapp_test

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRE=30d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# IMDb Scraping
IMDB_SCRAPE_ENABLED=true
IMDB_SCRAPE_INTERVAL=86400000

# External APIs
TMDB_API_KEY=your-tmdb-api-key
OMDB_API_KEY=your-omdb-api-key

# Logging
LOG_LEVEL=debug
SENTRY_DSN=

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_ENV=development
REACT_APP_ENABLE_ANALYTICS=false
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "USER"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Movie Endpoints

#### Get All Movies (Paginated)
```http
GET /api/v1/movies?page=1&limit=20&sort=-rating
Authorization: Bearer <token>
```

#### Search Movies
```http
GET /api/v1/movies/search?q=inception&page=1&limit=10
Authorization: Bearer <token>
```

#### Get Movie Details
```http
GET /api/v1/movies/:id
Authorization: Bearer <token>
```

#### Create Movie (Admin Only)
```http
POST /api/v1/movies
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "title": "Inception",
  "description": "A thief who steals corporate secrets...",
  "rating": 8.8,
  "duration": 148,
  "releaseDate": "2010-07-16",
  "genres": ["Action", "Sci-Fi", "Thriller"],
  "posterUrl": "https://example.com/poster.jpg"
}
```

#### Update Movie (Admin Only)
```http
PUT /api/v1/movies/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "rating": 9.0
}
```

#### Delete Movie (Admin Only)
```http
DELETE /api/v1/movies/:id
Authorization: Bearer <admin-token>
```

### Admin Endpoints

#### Sync IMDb Top 250
```http
POST /api/v1/admin/sync-imdb
Authorization: Bearer <admin-token>
```

#### Get Audit Logs
```http
GET /api/v1/admin/audit-logs?page=1&limit=50
Authorization: Bearer <admin-token>
```

#### Get System Stats
```http
GET /api/v1/admin/stats
Authorization: Bearer <admin-token>
```

## 🎨 Frontend Architecture

```
frontend/
├── src/
│   ├── app/
│   │   ├── store.js              # Redux store
│   │   └── slices/
│   │       ├── authSlice.js
│   │       ├── movieSlice.js
│   │       └── uiSlice.js
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── movies/
│   │   │   ├── MovieCard.jsx
│   │   │   ├── MovieRow.jsx
│   │   │   ├── MovieGrid.jsx
│   │   │   └── MovieDetails.jsx
│   │   └── admin/
│   │       ├── MovieForm.jsx
│   │       ├── AdminDashboard.jsx
│   │       └── AuditLogs.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Search.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Admin.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useDebounce.js
│   │   └── useInfiniteScroll.js
│   ├── utils/
│   │   ├── api.js
│   │   ├── constants.js
│   │   └── helpers.js
│   └── styles/
│       └── theme.js
```

## 🔐 Security Features

1. **JWT Authentication** - Secure token-based auth
2. **RBAC** - Role-based access control
3. **Rate Limiting** - Prevent API abuse
4. **Helmet.js** - Security headers
5. **CORS** - Cross-origin protection
6. **Input Validation** - Joi schemas
7. **SQL Injection Prevention** - Mongoose sanitization
8. **XSS Protection** - Content Security Policy

## ⚡ Performance Optimizations

1. **Redis Caching** - Cache frequently accessed data
2. **Database Indexing** - Optimized queries
3. **Lazy Loading** - Code splitting
4. **Image Optimization** - WebP format
5. **Compression** - Gzip/Brotli
6. **CDN Integration** - Static asset delivery
7. **Debounced Search** - Reduce API calls
8. **Infinite Scroll** - Pagination optimization

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test
npm run test:coverage

# Frontend tests
cd frontend
npm test
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 📊 Monitoring & Logging

- **Winston** - Application logging
- **Morgan** - HTTP request logging
- **Sentry** - Error tracking
- **PM2** - Process monitoring

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Railway)
```bash
cd backend
railway up
```

### Docker Deployment
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📈 Scalability Considerations

1. **Horizontal Scaling** - Multiple backend instances
2. **Load Balancing** - NGINX reverse proxy
3. **Database Sharding** - Partition large datasets
4. **Microservices** - Service separation
5. **Message Queue** - Async processing
6. **CDN** - Global content delivery

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

MIT License - see LICENSE file

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- IMDb for movie data
- TMDB API for additional metadata
- Netflix for UX inspiration
- Material-UI for components

## 📞 Support

For support, email support@movieapp.com or join our Slack channel.

---

**Built with ❤️ using MERN Stack + Advanced System Design**
