# News Reader - Complete Setup & Deployment Guide

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Development Environment](#development-environment)
3. [Production Deployment](#production-deployment)
4. [Docker Setup](#docker-setup)
5. [Troubleshooting](#troubleshooting)
6. [Architecture Overview](#architecture-overview)

## Initial Setup

### Prerequisites

- Node.js 16+ (check with `node --version`)
- npm or yarn
- Redis (for caching)
- NewsAPI.org API key (free at https://newsapi.org)
- Git (for version control)

### 1. Get NewsAPI Key

1. Visit https://newsapi.org
2. Sign up for a free account
3. Copy your API key from the dashboard
4. Keep it safe - never commit to git

### 2. Clone and Install

```bash
# Navigate to project root
cd news-reader

# Install backend
cd backend
npm install

# Install frontend
cd ../frontend
npm install

# Back to root
cd ..
```

### 3. Set Up Redis

#### Windows
```bash
# Option A: Using Docker (recommended)
docker run -d -p 6379:6379 --name news-redis redis:latest

# Option B: Using Windows Subsystem for Linux (WSL)
# Install Redis in WSL, then start it:
redis-server

# Option C: Direct Windows installation
# Download from: https://github.com/microsoftarchive/redis/releases
# Extract and run redis-server.exe
```

#### macOS
```bash
# Using Homebrew
brew install redis
brew services start redis

# Verify it's running
redis-cli ping  # Should return PONG
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install redis-server
sudo service redis-server start

# Verify it's running
redis-cli ping  # Should return PONG
```

## Development Environment

### 1. Configure Backend

```bash
cd backend

# Create .env file
cp .env.example .env

# Edit .env and add your values:
# NODE_ENV=development
# PORT=5000
# NEWS_API_KEY=your_api_key_here
# REDIS_HOST=localhost
# REDIS_PORT=6379
# CORS_ORIGIN=http://localhost:5173
```

### 2. Configure Frontend

```bash
cd ../frontend

# Create .env.local file
cp .env.example .env.local

# Default values are fine for local development:
# VITE_API_URL=http://localhost:5000
```

### 3. Start Backend

```bash
cd backend
npm run dev

# Expected output:
# Server is running on port 5000
# Connected to Redis
```

### 4. Start Frontend (new terminal)

```bash
cd frontend
npm run dev

# Expected output:
# VITE v5.0.8  ready in XXX ms
# ➜  Local:   http://localhost:5173/
```

### 5. Test the Application

1. Open http://localhost:5173 in your browser
2. You should see the News Reader app
3. Try searching for "bitcoin"
4. Try filtering by categories
5. Click "Read More" to open articles

### Verify Setup

```bash
# Test backend health
curl http://localhost:5000/api/health

# Expected response:
# {
#   "success": true,
#   "timestamp": "2024-01-29T...",
#   "uptime": 123.456,
#   "redis": { "connected": true }
# }

# Test Redis
redis-cli ping
# Expected: PONG
```

## Production Deployment

### Backend

#### 1. Build
```bash
cd backend
npm run build
npm run type-check
```

#### 2. Configure Production .env
```env
NODE_ENV=production
PORT=5000
NEWS_API_KEY=your_production_api_key
REDIS_HOST=your.redis.host
REDIS_PORT=6379
REDIS_PASSWORD=your_password
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=warn
```

#### 3. Run Production Server
```bash
NODE_ENV=production npm start
```

#### 4. Deploy (Example: Heroku)
```bash
# Create Heroku app
heroku create news-reader-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set NEWS_API_KEY=your_api_key
heroku config:set REDIS_URL=your_redis_url

# Deploy
git push heroku main
```

### Frontend

#### 1. Build
```bash
cd frontend
npm run build
```

#### 2. Verify Build
```bash
npm run preview
# Should start a preview server at http://localhost:4173
```

#### 3. Deploy Options

**Option A: Vercel (Recommended)**
```bash
npm i -g vercel
vercel
# Follow prompts, set VITE_API_URL during setup
```

**Option B: Netlify**
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

**Option C: Traditional Server**
```bash
# Upload `dist/` folder to your web server
# Configure your web server to serve index.html for all routes

# Example nginx configuration:
location / {
  try_files $uri $uri/ /index.html;
}
```

## Docker Setup

### Prerequisites
- Docker installed
- Docker Compose installed

### Build and Run

```bash
# From project root
docker-compose up -d

# Check services are running
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Access Application
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Redis: localhost:6379

### Rebuild Images
```bash
docker-compose up -d --build
```

### Access Container Shells
```bash
# Backend shell
docker-compose exec backend sh

# Frontend shell
docker-compose exec frontend sh

# Redis CLI
docker-compose exec redis redis-cli
```

## Troubleshooting

### Redis Connection Error

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:6379`

**Solutions**:
```bash
# Check if Redis is running
redis-cli ping  # Should return PONG

# Start Redis
# macOS
brew services start redis

# Linux
sudo service redis-server start

# Windows Docker
docker run -d -p 6379:6379 redis:latest
```

### API Key Error

**Error**: `Invalid API Key`

**Solutions**:
1. Verify key at https://newsapi.org
2. Check `.env` file has correct key (no quotes)
3. Restart backend after changing key
4. Test with curl:
   ```bash
   curl "https://newsapi.org/v2/top-headlines?apiKey=YOUR_KEY&country=us" | json_pp
   ```

### CORS Error

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solutions**:
1. Check backend `.env`:
   ```env
   CORS_ORIGIN=http://localhost:5173  # Exactly match frontend URL
   ```
2. Restart backend
3. Check frontend `.env`:
   ```env
   VITE_API_URL=http://localhost:5000  # Exactly match backend URL
   ```

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solutions**:
```bash
# Windows - Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Or change port in backend .env
PORT=5001
```

### Build Failures

**TypeScript Errors**:
```bash
# Backend
cd backend
npm run type-check

# Frontend
cd frontend
npm run build
```

**Dependency Issues**:
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install

# For M1/M2 Macs
npm install --arch=arm64
```

### Performance Issues

1. **Clear caches**:
   ```bash
   # Redis
   redis-cli FLUSHALL
   
   # Frontend browser cache
   # In DevTools: Application > Clear site data
   ```

2. **Check logs**:
   ```bash
   # Backend logs
   tail -f backend/logs/combined-*.log
   
   # Browser console
   # F12 > Console tab
   ```

3. **Monitor resources**:
   - Backend: `htop` or Task Manager
   - Frontend DevTools: Network tab
   - Redis: `redis-cli info`

## Architecture Overview

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Browser                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP/HTTPS
                     ↓
┌─────────────────────────────────────────────────────────┐
│              Frontend (React + Vite)                    │
│  - TanStack Query (Client-side caching)                │
│  - Tailwind CSS (Styling)                              │
│  - TypeScript (Type Safety)                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ REST API Calls
                     ↓
┌─────────────────────────────────────────────────────────┐
│          Backend (Express.js + TypeScript)             │
│  - Rate Limiting                                        │
│  - Input Validation (Zod)                              │
│  - Security Headers (Helmet)                           │
│  - Logging (Winston)                                   │
└────────────────────┬────────────────────────────────────┘
                     │
       ┌─────────────┴──────────────┐
       ↓                            ↓
    ┌──────────┐            ┌───────────────┐
    │ NewsAPI  │            │  Redis Cache  │
    │ (External)           │  (Local/Cloud)|
    └──────────┘            └───────────────┘
```

### Data Flow

1. **Request**: User searches for "technology"
2. **Frontend**: Debounces (300ms) and sends GET request
3. **Backend**:
   - Checks rate limit
   - Validates input
   - Checks Redis cache
   - If miss: calls NewsAPI
   - Caches result (10 min TTL)
4. **Response**: Returns articles + cache status
5. **Frontend**: TanStack Query caches locally (5 min)
6. **Display**: Renders articles in grid

## Performance Benchmarks

**Initial Load**: ~1-2 seconds
**Cached Request**: ~100-200ms
**Search**: ~500ms (debounced)
**API Response**: ~500-1000ms

## Next Steps

1. ✅ Setup complete!
2. 📖 Read the detailed READMEs:
   - [Backend README](./backend/README.md)
   - [Frontend README](./frontend/README.md)
3. 🧪 Run tests (when implemented)
4. 🚀 Deploy to production
5. 📊 Monitor performance
6. 🔄 Set up CI/CD pipeline

## Support

For detailed information:
- Backend: [backend/README.md](./backend/README.md)
- Frontend: [frontend/README.md](./frontend/README.md)
- API Docs: Check `/api` endpoint in backend

---

Happy coding! 🚀
