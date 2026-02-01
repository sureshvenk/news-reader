# News Reader - Full Stack Web Application

A modern, production-ready news reader application that fetches articles from NewsAPI with a secure backend and responsive frontend.

## 🎯 Overview

This is a complete full-stack web application consisting of:

- **Backend**: Express.js API with Redis caching, rate limiting, and comprehensive logging
- **Frontend**: React app with TanStack Query, Tailwind CSS, and advanced UX features

## ✨ Key Features

### Backend
- 🔐 Secure API key management (never exposed to frontend)
- ⚡ Redis caching with configurable TTL
- 🛡️ Rate limiting (100 requests per 15 minutes per IP)
- 📊 Comprehensive logging with Winston
- 🔒 Security headers with Helmet
- ✔️ Input validation with Zod
- 🏥 Health check endpoints
- 📝 Structured error handling

### Frontend
- 🎨 Modern, responsive UI with Tailwind CSS
- 🚀 Fast data fetching with TanStack Query
- 🔍 Real-time search with debouncing
- 📂 Category filtering
- ♿ Full accessibility support
- 📱 Mobile-first responsive design
- ⚠️ Error boundaries and error handling
- 🔄 Retry logic for failed requests

## 📋 Prerequisites

- Node.js 16+
- npm or yarn
- Redis (for caching)
- NewsAPI.org API key (free at https://newsapi.org)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Navigate to project directory
cd news-reader

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edit `.env` and add your NewsAPI key:
```env
NODE_ENV=development
PORT=5000
NEWS_API_KEY=your_api_key_here
REDIS_HOST=localhost
REDIS_PORT=6379
CORS_ORIGIN=http://localhost:5173
```

#### Frontend (.env.local)
```bash
cd ../frontend
cp .env.example .env.local
```

### 3. Start Redis

**Windows (using Docker):**
```bash
docker run -d -p 6379:6379 redis:latest
```

**macOS:**
```bash
brew install redis
brew services start redis
```

**Linux:**
```bash
sudo apt-get install redis-server
sudo service redis-server start
```

### 4. Start Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server running at http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App running at http://localhost:5173
```

Visit `http://localhost:5173` in your browser! 🎉

## 📁 Project Structure

```
news-reader/
├── backend/
│   ├── src/
│   │   ├── config/           # Configuration (env, logger, redis)
│   │   ├── middleware/       # Express middleware
│   │   ├── routes/           # API endpoints
│   │   ├── services/         # Business logic
│   │   ├── types/            # TypeScript types
│   │   ├── utils/            # Helpers
│   │   └── server.ts         # Main server
│   ├── logs/                 # Log files (generated)
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # API client
│   │   ├── types/            # Type definitions
│   │   ├── utils/            # Utilities
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── index.html
│   ├── .env.example
│   └── README.md
├── .gitignore
└── README.md (this file)
```

## 🔌 API Endpoints

### Health Check
```http
GET /api/health
```

### Top Headlines
```http
GET /api/news/top-headlines?country=us&category=business&page=1&pageSize=20
```

### Search News
```http
GET /api/news/search?q=bitcoin&sortBy=publishedAt&page=1
```

### By Category
```http
GET /api/news/categories/technology?country=us&page=1
```

See [Backend README](./backend/README.md) for detailed documentation.

## 🛠️ Development

### Backend Development
```bash
cd backend

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build
```

### Frontend Development
```bash
cd frontend

# Linting
npm run lint

# Build for production
npm run build
```

## 📦 Production Deployment

### Backend
```bash
cd backend
npm run build
NODE_ENV=production npm start
```

### Frontend
```bash
cd frontend
npm run build
# Serve dist/ directory with a web server
```

## 🔐 Security Features

- ✅ API keys never exposed to frontend
- ✅ HTTPS ready
- ✅ CORS properly configured
- ✅ Rate limiting enabled
- ✅ Helmet security headers
- ✅ Input validation and sanitization
- ✅ Error handling without exposing internals
- ✅ SQL injection protection (N/A - no DB, but validated inputs)
- ✅ XSS protection
- ✅ CSRF ready

## 📊 Caching Strategy

| Resource | TTL | Strategy |
|----------|-----|----------|
| Top Headlines | 10 min | Server-side Redis + Client TanStack Query |
| Search Results | 10 min | Server-side Redis + Client cache |
| Categories | 15 min | Server-side Redis + Client cache |

## 📝 Logging

- **Console**: Colored output for development
- **File**: Daily rotating logs
  - `logs/combined-YYYY-MM-DD.log` - All logs (30-day rotation)
  - `logs/error-YYYY-MM-DD.log` - Errors only (14-day rotation)
  - `logs/exceptions-YYYY-MM-DD.log` - Unhandled exceptions

## 🧪 Testing

### Backend
```bash
cd backend
# Tests coming soon
```

### Frontend
```bash
cd frontend
# Tests coming soon
```

## 🐛 Troubleshooting

### Redis Connection Error
```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG
```

### API Key Error
- Get free key: https://newsapi.org
- Add to `.env`: `NEWS_API_KEY=your_key`
- Restart backend

### CORS Error
- Check `CORS_ORIGIN` in backend `.env`
- Ensure frontend URL matches

### Build Issues
```bash
# Clear dependencies and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📚 Documentation

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

## 🤝 Contributing

Contributions welcome! Please ensure:
- Code follows project style
- Tests pass
- No console errors
- Accessibility standards met

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [TanStack Query](https://tanstack.com/query/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NewsAPI Documentation](https://newsapi.org/)

## 📞 Support

For issues or questions:
1. Check the README files
2. Review the code comments
3. Check error logs in `backend/logs/`
4. Verify environment variables are set correctly

---

Made with ❤️ for learning and production use.
