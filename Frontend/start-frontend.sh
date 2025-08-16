#!/bin/bash

# AI Pills Frontend Development Server
# Runs the Next.js frontend on port 3000

echo "🎨 Starting AI Pills Frontend..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Navigate to frontend directory
cd "$(dirname "$0")/Frontend"

# Check if port 3000 is available
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${RED}Port 3000 is already in use. Stopping existing process...${NC}"
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

# Set environment variables
export NEXT_PUBLIC_API_BASE_URL="http://localhost:8000/api/v1"

# Start the frontend server
echo -e "${GREEN}🎨 Starting Frontend on http://localhost:3000${NC}"
echo -e "${GREEN}🏠 Dashboard: http://localhost:3000/dashboard${NC}"
echo -e "${GREEN}🔑 Login: http://localhost:3000/auth/login${NC}"
echo ""
echo -e "${BLUE}Press Ctrl+C to stop the frontend server${NC}"

npm run dev
