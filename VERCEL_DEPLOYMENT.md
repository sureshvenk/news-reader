# Vercel Deployment Guide

## Frontend Deployment to Vercel

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure project settings:
   - **Framework**: Vite
   - **Root Directory**: `./frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Add Environment Variables
In Vercel Project Settings → Environment Variables, add:
```
VITE_API_URL = https://your-backend-api.com
```

### Step 4: Deploy
Click Deploy - Vercel will automatically build and deploy!

---

## Backend Deployment Options

### Option A: Railway (Recommended for this setup)

1. **Create account** at [railway.app](https://railway.app)
2. **Push code to GitHub**
3. **Connect GitHub repo** to Railway
4. **Select `/backend` folder** as root
5. **Add environment variables**:
   - `NEWS_API_KEY`: Your NewsAPI key
   - `NODE_ENV`: production
   - `REDIS_URL`: Railway Redis connection string
   - `PORT`: 3000 (or Railway-provided port)
   - `CORS_ORIGIN`: https://your-vercel-domain.vercel.app

6. **Add Redis plugin** in Railway dashboard

### Option B: Render.com

1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Select `/backend` folder
5. Set build/start commands:
   - Build: `npm install && npm run build`
   - Start: `npm start`
6. Add environment variables (same as above)
7. Add Redis add-on

### Option C: Heroku

1. Install Heroku CLI
2. Create Procfile in backend:
```
web: npm start
```
3. Deploy:
```bash
heroku create your-app-name
heroku addons:create heroku-redis:premium-0
git push heroku main
```

---

## Environment Variables Needed

### Frontend (.env.production in Vercel)
```
VITE_API_URL=https://your-backend-url.com
```

### Backend (.env)
```
NODE_ENV=production
PORT=3000
NEWS_API_KEY=your_newsapi_key
REDIS_URL=your_redis_connection_string
CORS_ORIGIN=https://your-vercel-frontend.vercel.app
```

---

## Changes Already Made

✅ Removed local proxy from vite.config.ts
✅ Frontend uses VITE_API_URL environment variable
✅ Created vercel.json for frontend deployment

## Next Steps

1. Create GitHub repository
2. Push code to GitHub
3. Deploy frontend to Vercel
4. Choose backend service (Railway recommended)
5. Deploy backend
6. Update VITE_API_URL in Vercel with backend URL
7. Test the application
