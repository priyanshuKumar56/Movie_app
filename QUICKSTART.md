# 🚀 Quick Start Guide - Netflix-Grade Movie Platform

## ⚡ Get Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- MongoDB installed locally OR MongoDB Atlas account
- Redis installed locally OR Redis Cloud account
- Git installed

---

## 📦 Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## 🔧 Step 2: Configure Environment Variables

### Backend Configuration

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your settings:

```env
# Minimum required configuration
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/movieapp
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-super-secret-key-min-32-characters-long
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-characters
JWT_REFRESH_EXPIRE=30d
CORS_ORIGIN=http://localhost:3000
```

### Frontend Configuration

```bash
cd ../frontend
cp .env.example .env
```

Edit `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_ENV=development
```

---

## 🗄️ Step 3: Start MongoDB and Redis

### Option A: Local Installation

```bash
# Start MongoDB
mongod

# Start Redis (in new terminal)
redis-server
```

### Option B: Docker

```bash
# Start MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:7

# Start Redis
docker run -d -p 6379:6379 --name redis redis:7-alpine
```

### Option C: Cloud Services (Recommended for Production)

**MongoDB Atlas:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

**Redis Cloud:**
1. Go to https://redis.com/try-free/
2. Create free database
3. Get host and port
4. Update `REDIS_HOST` and `REDIS_PORT` in `.env`

---

## 🎬 Step 4: Start the Application

### Option A: Manual Start (Recommended for Development)

```bash
# Terminal 1: Start Backend
cd backend
npm run dev

# Terminal 2: Start Frontend
cd frontend
npm start
```

### Option B: Concurrent Start

```bash
# From root directory
npm run dev
```

### Option C: Docker Compose

```bash
docker-compose up -d
```

---

## 🎯 Step 5: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/v1
- **Health Check**: http://localhost:5000/health

---

## 👤 Step 6: Create Admin User

### Option A: Using API (Postman/Thunder Client)

```http
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@movieapp.com",
  "password": "Admin123!",
  "role": "ADMIN"
}
```

### Option B: Using MongoDB Shell

```javascript
use movieapp

db.users.insertOne({
  name: "Admin User",
  email: "admin@movieapp.com",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWEHK.YG", // Admin123!
  role: "ADMIN",
  isActive: true,
  isVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

## 🎬 Step 7: Seed Sample Movies (Optional)

### Option A: Sync from IMDb

```bash
# Login as admin first, then:
POST http://localhost:5000/api/v1/admin/sync-imdb
Authorization: Bearer <your-admin-token>
```

### Option B: Manual Seed Script

```bash
cd backend
node src/scripts/seedMovies.js
```

---

## 🧪 Step 8: Test the Application

### Test Backend

```bash
cd backend
npm test
```

### Test Frontend

```bash
cd frontend
npm test
```

### Manual Testing Checklist

- [ ] Register new user
- [ ] Login with credentials
- [ ] Browse movies on home page
- [ ] Search for movies
- [ ] View movie details
- [ ] Add movie to favorites (requires login)
- [ ] Admin: Create new movie
- [ ] Admin: Edit movie
- [ ] Admin: Delete movie
- [ ] Admin: Sync IMDb

---

## 📊 API Endpoints Quick Reference

### Authentication
```
POST   /api/v1/auth/register      - Register user
POST   /api/v1/auth/login         - Login
POST   /api/v1/auth/logout        - Logout
GET    /api/v1/auth/me            - Get profile
POST   /api/v1/auth/refresh       - Refresh token
```

### Movies
```
GET    /api/v1/movies             - Get all movies
GET    /api/v1/movies/:id         - Get movie by ID
GET    /api/v1/movies/search      - Search movies
GET    /api/v1/movies/trending    - Get trending
POST   /api/v1/movies             - Create movie (Admin)
PUT    /api/v1/movies/:id         - Update movie (Admin)
DELETE /api/v1/movies/:id         - Delete movie (Admin)
```

### User Features
```
POST   /api/v1/users/favorites/:movieId    - Add to favorites
DELETE /api/v1/users/favorites/:movieId    - Remove from favorites
GET    /api/v1/users/favorites             - Get favorites
POST   /api/v1/users/watchlist/:movieId    - Add to watchlist
DELETE /api/v1/users/watchlist/:movieId    - Remove from watchlist
GET    /api/v1/users/watchlist             - Get watchlist
POST   /api/v1/users/watch-history         - Add to history
GET    /api/v1/users/watch-history         - Get history
```

### Admin
```
POST   /api/v1/admin/sync-imdb    - Sync IMDb Top 250
GET    /api/v1/admin/stats        - Get system stats
GET    /api/v1/admin/users        - Get all users
PUT    /api/v1/admin/users/:id/role - Update user role
POST   /api/v1/admin/clear-cache  - Clear cache
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error

```bash
# Check if MongoDB is running
mongosh

# If not, start it
mongod
```

### Redis Connection Error

```bash
# Check if Redis is running
redis-cli ping

# If not, start it
redis-server
```

### Port Already in Use

```bash
# Kill process on port 5000
npx kill-port 5000

# Kill process on port 3000
npx kill-port 3000
```

### Module Not Found Error

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Error

- Check `CORS_ORIGIN` in backend `.env`
- Should match frontend URL (http://localhost:3000)

---

## 📈 Next Steps

1. **Complete Frontend UI** - See `IMPLEMENTATION_GUIDE.md`
2. **Add Tests** - Write unit and integration tests
3. **Deploy** - Follow deployment guide in README
4. **Add Features** - Implement advanced features

---

## 📚 Documentation

- **Full Documentation**: See `README.md`
- **Implementation Guide**: See `IMPLEMENTATION_GUIDE.md`
- **API Documentation**: Coming soon (Swagger)

---

## 🆘 Need Help?

- Check `IMPLEMENTATION_GUIDE.md` for detailed architecture
- Review error logs in `backend/logs/`
- Check browser console for frontend errors
- Verify all environment variables are set

---

## ✅ Success Checklist

- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] MongoDB running
- [ ] Redis running
- [ ] Backend server started (port 5000)
- [ ] Frontend app started (port 3000)
- [ ] Admin user created
- [ ] Sample movies loaded
- [ ] Can register/login
- [ ] Can browse movies
- [ ] Can search movies

---

**🎉 Congratulations! Your Netflix-grade movie platform is running!**

Visit http://localhost:3000 to see it in action.
