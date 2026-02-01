@echo off
REM News Reader - Quick Start for Windows

setlocal enabledelayedexpansion

echo.
echo ==========================================
echo    News Reader - Quick Start
echo ==========================================
echo.

REM Check prerequisites
echo Checking prerequisites...

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo [X] Node.js not found. Please install Node.js 16+
  exit /b 1
) else (
  for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
  echo [OK] Node.js !NODE_VERSION!
)

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo [X] npm not found
  exit /b 1
) else (
  for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
  echo [OK] npm !NPM_VERSION!
)

REM Check Redis
where redis-cli >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo [WARNING] Redis not found (can use Docker)
) else (
  echo [OK] Redis available
)

echo.
echo Installation Steps:
echo.

REM Install backend
echo [1] Installing backend dependencies...
cd backend
call npm install
echo [OK] Backend installed
cd ..
echo.

REM Install frontend
echo [2] Installing frontend dependencies...
cd frontend
call npm install
echo [OK] Frontend installed
cd ..
echo.

REM Setup .env files
echo [3] Setting up environment files...

if not exist "backend\.env" (
  copy backend\.env.example backend\.env
  echo [!] Created backend\.env - Please edit and add NEWS_API_KEY
) else (
  echo [OK] backend\.env exists
)

if not exist "frontend\.env.local" (
  copy frontend\.env.example frontend\.env.local
  echo [OK] Created frontend\.env.local
) else (
  echo [OK] frontend\.env.local exists
)

echo.
echo ==========================================
echo    Setup Complete!
echo ==========================================
echo.

echo Next Steps:
echo.
echo 1. Update backend\.env
echo    Add your NewsAPI key: NEWS_API_KEY=your_key_here
echo.
echo 2. Start Redis
echo    Option A (Docker): docker run -d -p 6379:6379 redis:latest
echo    Option B (WSL): Installed redis-server
echo.
echo 3. Start Backend (Command Prompt 1)
echo    cd backend ^&^& npm run dev
echo.
echo 4. Start Frontend (Command Prompt 2)
echo    cd frontend ^&^& npm run dev
echo.
echo 5. Open Browser
echo    Visit: http://localhost:5173
echo.
echo Happy coding! [*]
echo.
pause
