# 🎬 CineSphere - Premium Movie Analytics Platform

## 🎯 Project Overview

**CineSphere** is a sophisticated movie discovery and analytics platform built on the MERN stack. Unlike generic clones, CineSphere features a professional dashboard interface, advanced data visualization, and robust management tools.

---

## ✨ Key Differentiators

### 🎨 Unique UI/UX
- **Glassmorphic Sidebar**: Modern navigation replacing standard top-bars.
- **Discovery Grid**: Chip-based filtering and sorting dashboard.
- **Deep Dark Theme**: "OLED Black" background with **Electric Cyan (#00D1FF)** accents.
- **Vertical Movie Cards**: Information-rich cards with gradient overlays.

### 🛠️ Advanced Features (MERN)
1.  **Smart Sorting**: Users can sort movies by Rating, Release Date, Title, and Duration instantly.
2.  **Admin Console**: Integrated Modal-based Create/Edit workflow for seamless management.
3.  **Lazy Data Ingestion**: Background job queues (BullMQ) handle massive data imports without blocking the UI.
4.  **Role-Based Security**: Custom Layouts adapt based on `USER` vs `ADMIN` roles.

---

## 🏗️ System Architecture

### Frontend (React + Redux + MUI)
- **Layout Engine**: `Layout.jsx` creates a responsive shell with collapsible sidebar.
- **State**: Redux Toolkit manages `auth`, `movies`, and `ui` slices.
- **Routing**: Protected Routes ensure Admin-only access to console features.

### Backend (Node + Express + MongoDB)
- **API**: RESTful endpoints with advanced query features (sort, filter, page).
- **Queues**: Redis-backed BullMQ for scraping IMDb Top 250.
- **Security**: JWT Auth + Helmet + Rate Limiting.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm run install:all

# 2. Configure environment
cd backend && cp .env.example .env
cd ../frontend && cp .env.example .env

# 3. Start Application
npm run dev
```

**Access:**
- **App**: http://localhost:3000
- **API**: http://localhost:5000/api/v1

---

## ✅ Completed Requirements Checklist

- [x] **New Name & Identity**: Rebranded to **CineSphere**.
- [x] **New UI Structure**: Sidebar + Grid Dashboard.
- [x] **User Features**:
    - [x] View IMDb Top 250 (via Queues).
    - [x] Search by Name/Description.
    - [x] Sort by Name, Rating, Date, Duration.
- [x] **Admin Features**:
    - [x] Add New Movie (Modal Form).
    - [x] Edit/Delete Movie.
    - [x] JWT Authentication + RBAC.
- [x] **Tech Stack**: MERN, Material-UI, Redux, Redis.

---

**CineSphere is ready for deployment 🚀**
