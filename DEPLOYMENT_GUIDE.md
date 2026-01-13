# Project Cleanup and Deployment Guide

## 1. Unused / Cleanup Candidates

Based on the project structure, the following files appear to be documentation or local operational scripts that are likely not needed for the production application deployed to Render/Vercel.

**You can delete these if you no longer need the documentation:**
- `DOCKER_FIXES_SUMMARY.md`
- `DOCKER_SETUP.md`
- `IMPLEMENTATION_GUIDE.md`
- `QUICKSTART.md`

**Local Development Files (Do not deploy):**
- `backend/src/scripts/` (Contains `seedMovies.js` and `syncImdb.js`. Keep them locally for maintenance, but they aren't used by the running app).
- `backend/create_admin.js` (One-time setup script).
- `backend/logs/` (Should be ignored by git).
- `.env` files (Never commit these).

**Configuration Check:**
- I have updated `.gitignore` to track `package-lock.json`. This is crucial for deployment stability.

---

## 2. Deployment Setup

### Backend (Render)
I have added a `render.yaml` file to your root directory. This allows for "Infrastructure as Code" deployment.

1. Push your code to a GitHub repository.
2. Go to [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** -> **Blueprint**.
4. Connect your repository.
5. Render will detect `movieapp-backend` from `render.yaml`.
6. Click **Apply**.
7. **Important**: You must manually set the Environment Variables in the Render Dashboard for your service:
   - `MONGODB_URI`: Your production MongoDB connection string (e.g., from MongoDB Atlas).
   - `JWT_SECRET`: A strong secret key.
   - `CORS_ORIGIN`: Your frontend URL (e.g., `https://movieapp-frontend.vercel.app`).

### Frontend (Vercel)
I have added `vercel.json` to the `frontend` folder to ensure client-side routing works correctly.

1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. **Configure Project**:
   - **Framework Preset**: Create React App (should auto-detect).
   - **Root Directory**: Click "Edit" and select `frontend`.
   - **Environment Variables**: Add:
     - `REACT_APP_API_URL`: The URL of your deployed Render backend (e.g., `https://movieapp-backend.onrender.com/api/v1`).
5. Click **Deploy**.

### Notes
- Ensure your MongoDB Atlas IP Access List allows access from all IPs (`0.0.0.0/0`) or configure it specifically for Render IPs (though Render IPs change, so `0.0.0.0/0` is common for non-enterprise).
