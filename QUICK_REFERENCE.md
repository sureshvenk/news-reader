# Quick Reference Commands

## 🚀 Development

### Backend
```bash
# Start development server
cd backend && npm run dev

# Build for production
cd backend && npm run build

# Start production server
cd backend && npm start

# Type checking
cd backend && npm run type-check

# Linting
cd backend && npm run lint
```

### Frontend
```bash
# Start development server
cd frontend && npm run dev

# Build for production
cd frontend && npm run build

# Preview production build
cd frontend && npm run preview

# Linting
cd frontend && npm run lint
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild images
docker-compose up -d --build

# Access backend shell
docker-compose exec backend sh

# Access Redis
docker-compose exec redis redis-cli
```

## 🔧 Utility Commands

### Redis
```bash
# Check if running
redis-cli ping
# Response: PONG

# Flush all cache
redis-cli FLUSHALL

# Check memory usage
redis-cli INFO memory

# Start server (if not running)
redis-server
```

### Testing Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Top headlines
curl http://localhost:5000/api/news/top-headlines

# Search news
curl "http://localhost:5000/api/news/search?q=bitcoin"

# Category news
curl "http://localhost:5000/api/news/categories/technology"
```

### Process Management
```bash
# Find process on port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

## 📦 Dependencies

### Add Package (Backend)
```bash
cd backend
npm install <package-name>
npm install --save-dev <package-name>
```

### Add Package (Frontend)
```bash
cd frontend
npm install <package-name>
npm install --save-dev <package-name>
```

## 🔐 Environment Setup

### Backend .env
```bash
cd backend
cp .env.example .env
# Edit .env and add:
# - NEWS_API_KEY
# - REDIS_HOST and REDIS_PORT
# - CORS_ORIGIN
```

### Frontend .env.local
```bash
cd frontend
cp .env.example .env.local
# Keep defaults or update VITE_API_URL
```

## 🧪 Testing

### Run Tests (when added)
```bash
# Backend unit tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# E2E tests
cd frontend && npm run test:e2e
```

## 📊 Logs

```bash
# View backend logs
tail -f backend/logs/combined-*.log

# View error logs only
tail -f backend/logs/error-*.log

# Clear logs
rm backend/logs/*.log
```

## 🚀 Deployment

### Build Both
```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

### Production Environment Variables
```bash
# Backend production .env
NODE_ENV=production
PORT=5000
NEWS_API_KEY=<your-prod-key>
REDIS_HOST=<your-redis-host>
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=warn
```

### Deploy Backend (Heroku)
```bash
cd backend
heroku create <app-name>
heroku config:set NODE_ENV=production
heroku config:set NEWS_API_KEY=<key>
git push heroku main
```

### Deploy Frontend (Vercel)
```bash
cd frontend
npm i -g vercel
vercel --prod
```

## 🔍 Debugging

### Browser DevTools
```javascript
// In browser console
// Check API calls
const response = await fetch('http://localhost:5000/api/news/top-headlines')
const data = await response.json()
console.log(data)

// Check TanStack Query cache
import { QueryClient } from '@tanstack/react-query'
// The cache is stored in React DevTools
```

### Backend Debugging
```bash
# Set DEBUG environment variable
DEBUG=* npm run dev

# Or use Node debugger
node --inspect src/server.ts
# Visit chrome://inspect in browser
```

## 📚 Documentation

- `README.md` - Project overview
- `SETUP.md` - Detailed setup guide
- `COMPLETION_SUMMARY.md` - What was built
- `backend/README.md` - API documentation
- `frontend/README.md` - Component guide

## ⚡ Performance Tips

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear caches
redis-cli FLUSHALL
rm -rf .next .vite dist

# Profile performance
# Backend: Add console.time/console.timeEnd
# Frontend: Use Lighthouse in DevTools
```

## 🆘 Common Issues

### Port Already in Use
```bash
# Change PORT in backend .env or kill process
# Windows
taskkill /F /IM node.exe
```

### Redis Connection Error
```bash
# Start Redis
docker run -d -p 6379:6379 redis:latest
# or
redis-server
```

### Clear Everything and Restart
```bash
# Backend
cd backend
rm -rf node_modules dist
npm install
npm run build

# Frontend
cd frontend
rm -rf node_modules dist .vite
npm install
npm run build
```

## 🎯 One-Liner Commands

```bash
# Start both services (from root)
npm --prefix backend run dev & npm --prefix frontend run dev

# Full rebuild
npm --prefix backend run build && npm --prefix frontend run build

# Type check both
npm --prefix backend run type-check && npm --prefix frontend run type-check

# Clean all
rm -rf backend/node_modules backend/dist frontend/node_modules frontend/dist
```

---

For more detailed information, see the full README files in each directory.
