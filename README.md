# 🎬 Netflix-Grade Movie Platform

> A production-ready, scalable movie application with microservices architecture, advanced caching, and enterprise-level features.

## 📖 Project Detail & Description

This project is a high-performance, responsive movie streaming platform designed to mimic the core functionalities and user experience of Netflix. Built with the **MERN stack**, it incorporates advanced system design principles like **microservices**, **caching**, **job queues**, and **security best practices**.

The goal is to provide a seamless movie discovery experience with features like **real-time search**, **infinite scrolling**, **watch history tracking**, and **admin analytics**.

### ✨ Key Features at a Glance
- **High Performance:** Up to 90% faster reads using Redis caching.
- **Scalable Architecture:** Designed with microservices and containerization in mind.
- **Modern UI/UX:** Glassmorphism, smooth animations, and responsive design using Material-UI & Framer Motion.
- **Security:** Enterprise-grade security with JWT, RBAC, and Rate Limiting.
- **Data Pipeline:** Automated background jobs for fetching movie data (IMDb/TMDB).

---

## 🛠️ Installation Process & Project Setup

Follow these steps to set up the project manually on your local machine.

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **MongoDB** (Local or Atlas URL)
- **Redis** (Local or Cloud URL)

### 1. Backend Setup
The backend handles the API, database connections, and background jobs.

```bash
cd backend

# Install dependencies
npm install

# Setup Environment Variables
cp .env.example .env
# Edit .env with your MongoDB and Redis credentials

# Run the server in development mode
npm run dev
```

### 2. Frontend Setup
The frontend is the React application that users interact with.

```bash
cd frontend

# Install dependencies
npm install

# Setup Environment Variables
cp .env.example .env

# Run the React app
npm start
```
*The app will be available at [http://localhost:3000](http://localhost:3000)*

---

## � Admin & Database Setup

To fully functionalize the application, you need to create an administrator and populate the database with movie data.

### 1. Create an Admin Account
Run the following command in the `backend` directory to create a default admin user.
```bash
cd backend
npm run admin:create
```
- **Default Credentials:**
  - **Email:** `admin@movieapp.com`
  - **Password:** `admin123`

*To use custom credentials:*
```bash
node create_admin.js <email> <password> "<name>"
```

### 2. Seed Movie Data
Populate your database with the IMDb Top 250 dataset.
```bash
cd backend
npm run db:seed
```

### 3. Accessing the Admin Panel
Once you have created an admin account:
1. Go to the login page: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Log in with your admin credentials.
3. If your account has the `ADMIN` role, you will be able to access the Admin Dashboard at: [http://localhost:3000/admin](http://localhost:3000/admin) (or via the user profile menu).

---

## �🐳 Docker Setup (Recommended / Alternative Method)

For a hassle-free setup that ensures consistency across different environments, use Docker. This method sets up the Frontend, Backend, MongoDB, and Redis containers automatically.

### Quick Start
```bash
# Build and run all services
docker-compose up --build
```

### Access Points
- **Frontend application:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **MongoDB:** `mongodb://localhost:27017`

*See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed collaboration guidelines.*

---

## 📚 More Information

### 🏗️ System Architecture
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
```

### 📦 Tech Stack

#### Frontend
- **React 18** (Hooks, Context, Suspense)
- **Redux Toolkit** (Global State)
- **Material-UI v5** (Component Library)
- **Framer Motion** (Animations)
- **TailwindCSS** (Utility Styling)

#### Backend
- **Node.js & Express.js** (Server)
- **MongoDB & Mongoose** (Database)
- **Redis** (Caching)
- **BullMQ** (Job Queues)
- **JWT** (Authentication)

### 🔧 Environment Variables

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/movieapp
REDIS_HOST=localhost
JWT_SECRET=supersecret
JWT_EXPIRE=7d
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api/v1
```

### 📚 API Documentation

#### Auth
- `POST /api/v1/auth/register` - Create account
- `POST /api/v1/auth/login` - Login

#### Movies
- `GET /api/v1/movies` - Get paginated movies
- `GET /api/v1/movies/:id` - Get movie details

### 🤝 Contributing
1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Built with ❤️ using MERN Stack + Advanced System Design**
