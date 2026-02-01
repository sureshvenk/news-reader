# Environment Variables Guide

## Backend Environment Variables

### Location
```
backend/.env
```

### Required Variables

| Variable | Value | Description | Example |
|----------|-------|-------------|---------|
| `NEWS_API_KEY` | string | NewsAPI.org API key | `abcd1234efgh5678` |
| `NODE_ENV` | string | Environment type | `development` or `production` |
| `PORT` | number | Server port | `5000` |

### Optional Variables

| Variable | Default | Description | Example |
|----------|---------|-------------|---------|
| `NEWS_API_BASE_URL` | `https://newsapi.org/v2` | NewsAPI base URL | `https://newsapi.org/v2` |
| `REDIS_HOST` | `localhost` | Redis server host | `localhost` or `redis.example.com` |
| `REDIS_PORT` | `6379` | Redis server port | `6379` |
| `REDIS_PASSWORD` | (none) | Redis password | `mypassword` |
| `REDIS_DB` | `0` | Redis database number | `0` |
| `CACHE_TTL` | `600` | Cache time-to-live in seconds | `600` (10 minutes) |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit window in milliseconds | `900000` (15 minutes) |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Max requests per window | `100` |
| `CORS_ORIGIN` | `http://localhost:5173` | Frontend URL for CORS | `http://localhost:5173` or `https://example.com` |
| `LOG_LEVEL` | `info` | Winston log level | `debug`, `info`, `warn`, `error` |

### Backend .env Example

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# News API Configuration
NEWS_API_KEY=your_news_api_key_here
NEWS_API_BASE_URL=https://newsapi.org/v2

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
CACHE_TTL=600

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=info
```

### Backend Production .env Example

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# News API Configuration
NEWS_API_KEY=your_production_key_here
NEWS_API_BASE_URL=https://newsapi.org/v2

# Redis Configuration (Cloud)
REDIS_HOST=your-redis.cloud.io
REDIS_PORT=6379
REDIS_PASSWORD=your_secure_password
REDIS_DB=0
CACHE_TTL=600

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=https://yourdomain.com

# Logging
LOG_LEVEL=warn
```

## Frontend Environment Variables

### Location
```
frontend/.env.local
```

### Variables

| Variable | Default | Description | Example |
|----------|---------|-------------|---------|
| `VITE_API_URL` | `http://localhost:5000` | Backend API URL | `http://localhost:5000` or `https://api.example.com` |

### Frontend .env.local Example

```env
VITE_API_URL=http://localhost:5000
```

### Frontend Production .env.local Example

```env
VITE_API_URL=https://api.yourdomain.com
```

## Getting API Keys

### NewsAPI.org

1. Visit https://newsapi.org
2. Click "Get API Key" button
3. Sign up for free account
4. Check your email for verification
5. Copy your API key
6. Add to `backend/.env`:
   ```env
   NEWS_API_KEY=your_key_here
   ```

**Free Tier Limits:**
- 100 requests per day
- 30 requests per 24 hours (rolling window)
- For production, upgrade to paid plan

## Setting Environment Variables

### Development

#### Option 1: Using .env file (Recommended)
```bash
# Create file
cp backend/.env.example backend/.env

# Edit with your values
nano backend/.env
# or use your favorite editor
```

#### Option 2: Command line (Temporary)
```bash
# macOS/Linux
export NODE_ENV=development
export NEWS_API_KEY=your_key

npm run dev

# Windows (PowerShell)
$env:NODE_ENV = "development"
$env:NEWS_API_KEY = "your_key"

npm run dev
```

#### Option 3: Using .env.local (Frontend)
```bash
# Create file
cp frontend/.env.example frontend/.env.local

# Edit with your values
nano frontend/.env.local
```

### Production

#### Option 1: Using .env file
```bash
# Backend
backend/.env with production values

# Frontend
frontend/.env.production with API URL
```

#### Option 2: Using system environment variables
```bash
# Set in shell profile, systemd service, or container
export NODE_ENV=production
export PORT=5000
export NEWS_API_KEY=prod_key
```

#### Option 3: Using .env files in deployment
```bash
# In deployment platform:
# - Vercel: Project Settings > Environment Variables
# - Heroku: Config Variables
# - AWS: Environment Variables in Lambda/EC2
# - Docker: Use docker-compose.yml or .env file
```

## Environment Variable Priority

Variables are loaded in this order (first found wins):

1. Shell environment variables (`export VAR=value`)
2. `.env` file (for backend)
3. `.env.local` file (for frontend)
4. `.env.example` file (default values)
5. Code defaults

## Common Mistakes

❌ **Don't:**
```env
# Wrong - with quotes (redis-cli won't parse)
REDIS_HOST="localhost"

# Wrong - spaces around =
REDIS_HOST = localhost

# Wrong - exposing keys in .env (commit this!)
NEWS_API_KEY=secret123
```

✅ **Do:**
```env
# Correct - no quotes
REDIS_HOST=localhost

# Correct - no spaces
REDIS_HOST=localhost

# Correct - ignore .env in .gitignore
NEWS_API_KEY=secret123

# Add .env to .gitignore
echo ".env" >> .gitignore
```

## Validation Checks

### Backend
```bash
# Check if API key is set
grep "NEWS_API_KEY=" backend/.env

# Verify environment is loaded
curl -H "X-Forwarded-For: 127.0.0.1" http://localhost:5000/api/health
```

### Frontend
```bash
# Check if API URL is configured
grep "VITE_API_URL" frontend/.env.local
```

## Troubleshooting

### "Cannot find api key"
- Check `backend/.env` exists
- Verify `NEWS_API_KEY=value` is set
- Check no spaces around `=`
- Restart backend after changing

### "Redis connection refused"
- Check `REDIS_HOST` and `REDIS_PORT` in `.env`
- Verify Redis is running: `redis-cli ping`
- For Docker: ensure container is running

### "CORS error"
- Check `CORS_ORIGIN` matches frontend URL
- For production, ensure HTTPS URLs match exactly
- Restart backend after changing

### "Port already in use"
- Change `PORT` in `.env` (e.g., `5001`)
- Or kill process on port: `lsof -i :5000`

## Environment-Specific Notes

### Development
- Use `localhost` for all hosts
- Lower `CACHE_TTL` for faster updates
- Set `LOG_LEVEL=debug` for debugging
- Use local Redis

### Staging
- Use internal server names
- Medium `CACHE_TTL` (300-600s)
- Set `LOG_LEVEL=info`
- Use staging Redis

### Production
- Use production API URLs
- Higher `CACHE_TTL` (600-3600s)
- Set `LOG_LEVEL=warn`
- Use managed Redis service
- Use strong `REDIS_PASSWORD`
- Enable HTTPS only
- Set appropriate `CORS_ORIGIN`
- Higher `RATE_LIMIT_MAX_REQUESTS`

## Docker Environment Variables

### Using docker-compose.yml
```yaml
services:
  backend:
    environment:
      NODE_ENV: production
      PORT: 5000
      NEWS_API_KEY: ${NEWS_API_KEY}
      REDIS_HOST: redis
```

### Using .env file with docker-compose
```bash
# Create .env in root
cat > .env << EOF
NEWS_API_KEY=your_key
EOF

# Run docker-compose
docker-compose up
```

## Security Best Practices

1. **Never commit secrets**
   ```bash
   echo ".env" >> .gitignore
   echo "*.local" >> .gitignore
   ```

2. **Use strong values**
   ```env
   REDIS_PASSWORD=generate-strong-password-here
   ```

3. **Rotate API keys regularly**
   - Generate new keys on NewsAPI
   - Update in all environments
   - Revoke old keys

4. **Use environment-specific keys**
   ```env
   # Development
   NEWS_API_KEY=dev_key_limited_calls
   
   # Production
   NEWS_API_KEY=prod_key_unlimited_calls
   ```

5. **Log sensitive values carefully**
   ```typescript
   // Don't log API keys
   console.log(apiKey) // ❌
   console.log('API configured') // ✅
   ```

## Reference

- [NewsAPI.org Docs](https://newsapi.org/docs)
- [Node.js dotenv Docs](https://github.com/motdotla/dotenv)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Redis Configuration](https://redis.io/documentation)

---

For more help, see the main README.md and SETUP.md files.
