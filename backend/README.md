# News Reader Backend

A secure, production-ready Express.js API server for fetching news from NewsAPI with Redis caching, rate limiting, and comprehensive logging.

## Features

- ✅ **Secure API Key Management** - API key stored in environment variables, never exposed to frontend
- ✅ **Redis Caching** - Configurable TTL caching to reduce API calls
- ✅ **Rate Limiting** - 100 requests per 15 minutes per IP
- ✅ **Comprehensive Logging** - Winston logger with daily rotating files
- ✅ **Security Headers** - Helmet middleware for production security
- ✅ **Input Validation** - Zod schema validation for all inputs
- ✅ **Error Handling** - Structured error responses with proper HTTP status codes
- ✅ **Health Checks** - Redis and application health monitoring
- ✅ **Request Logging** - All requests logged with timestamp, IP, and response time

## Prerequisites

- Node.js 16+ and npm/yarn
- Redis (for caching)
- NewsAPI.org API key (free tier available at https://newsapi.org)

## Installation

1. Clone the repository and navigate to the backend directory:

```bash
cd backend
npm install
```

2. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

3. Update `.env` with your configuration:

```env
NODE_ENV=development
PORT=5000
NEWS_API_KEY=your_api_key_here
REDIS_HOST=localhost
REDIS_PORT=6379
CORS_ORIGIN=http://localhost:5173
```

## Redis Setup

### On Windows:

Using WSL2 or Docker:

```bash
# Using Docker
docker run -d -p 6379:6379 redis:latest

# Or install Redis directly on Windows from: https://github.com/microsoftarchive/redis/releases
```

### On macOS:

```bash
# Using Homebrew
brew install redis
brew services start redis
```

### On Linux:

```bash
sudo apt-get install redis-server
sudo service redis-server start
```

## Running the Server

### Development

```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Production

```bash
npm run build
npm start
```

## API Endpoints

### Health Check

```http
GET /api/health
```

Returns server status and Redis connection info.

### Top Headlines

```http
GET /api/news/top-headlines?country=us&category=business&page=1&pageSize=20
```

Query Parameters:
- `country` (string, default: 'us') - Country code
- `category` (string, optional) - News category
- `page` (number, default: 1) - Page number
- `pageSize` (number, default: 20, max: 100) - Results per page

### Search News

```http
GET /api/news/search?q=bitcoin&sortBy=publishedAt&page=1&pageSize=20
```

Query Parameters:
- `q` (string, required) - Search query
- `language` (string, optional) - Language code
- `sortBy` (string, default: 'relevancy') - 'relevancy', 'popularity', or 'publishedAt'
- `page` (number, default: 1) - Page number
- `pageSize` (number, default: 20, max: 100) - Results per page

### News by Category

```http
GET /api/news/categories/technology?country=us&page=1&pageSize=20
```

Parameters:
- `category` (string) - Category slug (business, entertainment, general, health, science, sports, technology)

Valid Categories: `business`, `entertainment`, `general`, `health`, `science`, `sports`, `technology`

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "source": {
          "id": "bbc-news",
          "name": "BBC News"
        },
        "author": "John Doe",
        "title": "Article Title",
        "description": "Article description",
        "url": "https://example.com/article",
        "urlToImage": "https://example.com/image.jpg",
        "publishedAt": "2024-01-29T10:30:00Z",
        "content": "Full article content..."
      }
    ],
    "totalResults": 50,
    "page": 1,
    "pageSize": 20
  },
  "cached": false
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description"
}
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | development | Environment (development/production) |
| `PORT` | 5000 | Server port |
| `NEWS_API_KEY` | - | NewsAPI.org API key (required) |
| `NEWS_API_BASE_URL` | https://newsapi.org/v2 | NewsAPI base URL |
| `REDIS_HOST` | localhost | Redis host |
| `REDIS_PORT` | 6379 | Redis port |
| `REDIS_PASSWORD` | - | Redis password (if required) |
| `REDIS_DB` | 0 | Redis database number |
| `CACHE_TTL` | 600 | Cache time-to-live in seconds (10 minutes) |
| `RATE_LIMIT_WINDOW_MS` | 900000 | Rate limit window (15 minutes) |
| `RATE_LIMIT_MAX_REQUESTS` | 100 | Max requests per window |
| `CORS_ORIGIN` | http://localhost:5173 | Frontend URL for CORS |
| `LOG_LEVEL` | info | Winston log level |

## Development

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Logging

Logs are written to:
- **Console** - Development output with colors
- **logs/combined-YYYY-MM-DD.log** - All logs (30-day rotation)
- **logs/error-YYYY-MM-DD.log** - Error logs only (14-day rotation)
- **logs/exceptions-YYYY-MM-DD.log** - Unhandled exceptions (14-day rotation)

Log levels: `error`, `warn`, `info`, `debug`

## Security Features

- **Helmet.js** - Sets security HTTP headers
- **CORS** - Configurable cross-origin policy
- **Rate Limiting** - IP-based request limiting
- **Input Validation** - Zod schema validation
- **Input Sanitization** - HTML tag removal and trimming
- **Error Handling** - No stack traces in production
- **Environment Variables** - Sensitive config in .env

## Architecture

```
backend/
├── src/
│   ├── config/        # Configuration files
│   ├── middleware/    # Express middleware
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── types/         # TypeScript types
│   ├── utils/         # Helper functions
│   └── server.ts      # Main server file
├── logs/              # Log files (generated)
├── dist/              # Compiled JavaScript (generated)
└── package.json
```

## Troubleshooting

### Redis Connection Error

1. Ensure Redis is running: `redis-cli ping` (should return "PONG")
2. Check Redis host/port in `.env`
3. If using Docker: `docker ps` to verify container is running

### Rate Limit Exceeded

The API allows 100 requests per 15 minutes per IP. Wait for the window to reset or increase `RATE_LIMIT_MAX_REQUESTS` in `.env`.

### API Key Error

1. Get a free key at https://newsapi.org
2. Add to `.env`: `NEWS_API_KEY=your_key`
3. Restart the server

## License

MIT
