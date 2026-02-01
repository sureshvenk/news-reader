#!/bin/bash
# News Reader - Quick Start Commands

# COLOR CODES
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# HEADER
echo -e "${BLUE}===========================================${NC}"
echo -e "${BLUE}   News Reader - Quick Start${NC}"
echo -e "${BLUE}===========================================${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
  echo -e "${RED}✗ Node.js not found. Please install Node.js 16+${NC}"
  exit 1
else
  NODE_VERSION=$(node --version)
  echo -e "${GREEN}✓ Node.js ${NODE_VERSION}${NC}"
fi

# Check npm
if ! command -v npm &> /dev/null; then
  echo -e "${RED}✗ npm not found${NC}"
  exit 1
else
  NPM_VERSION=$(npm --version)
  echo -e "${GREEN}✓ npm ${NPM_VERSION}${NC}"
fi

# Check Redis
if ! command -v redis-cli &> /dev/null; then
  echo -e "${YELLOW}⚠ Redis not found (can use Docker)${NC}"
else
  echo -e "${GREEN}✓ Redis available${NC}"
fi

echo ""
echo -e "${YELLOW}Installation Steps:${NC}"
echo ""

# Install backend
echo -e "${BLUE}1. Installing backend dependencies...${NC}"
cd backend
npm install --legacy-peer-deps 2>/dev/null || npm install
echo -e "${GREEN}   ✓ Backend installed${NC}"
cd ..
echo ""

# Install frontend
echo -e "${BLUE}2. Installing frontend dependencies...${NC}"
cd frontend
npm install --legacy-peer-deps 2>/dev/null || npm install
echo -e "${GREEN}   ✓ Frontend installed${NC}"
cd ..
echo ""

# Setup .env files
echo -e "${BLUE}3. Setting up environment files...${NC}"

if [ ! -f "backend/.env" ]; then
  cp backend/.env.example backend/.env
  echo -e "${YELLOW}   Created backend/.env - Please edit and add NEWS_API_KEY${NC}"
else
  echo -e "${GREEN}   ✓ backend/.env exists${NC}"
fi

if [ ! -f "frontend/.env.local" ]; then
  cp frontend/.env.example frontend/.env.local
  echo -e "${GREEN}   ✓ Created frontend/.env.local${NC}"
else
  echo -e "${GREEN}   ✓ frontend/.env.local exists${NC}"
fi

echo ""
echo -e "${GREEN}==========================================${NC}"
echo -e "${GREEN}   Setup Complete!${NC}"
echo -e "${GREEN}==========================================${NC}"
echo ""

echo -e "${YELLOW}Next Steps:${NC}"
echo ""
echo "1. ${BLUE}Update backend/.env${NC}"
echo "   Add your NewsAPI key: NEWS_API_KEY=your_key_here"
echo ""
echo "2. ${BLUE}Start Redis${NC}"
echo "   Option A (Docker): docker run -d -p 6379:6379 redis:latest"
echo "   Option B (Installed): redis-server"
echo ""
echo "3. ${BLUE}Start Backend (Terminal 1)${NC}"
echo "   cd backend && npm run dev"
echo ""
echo "4. ${BLUE}Start Frontend (Terminal 2)${NC}"
echo "   cd frontend && npm run dev"
echo ""
echo "5. ${BLUE}Open Browser${NC}"
echo "   Visit: http://localhost:5173"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
