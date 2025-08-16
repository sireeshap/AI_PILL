#!/bin/bash

# Simple AI Pills Start Script with Sudo
echo "🚀 Starting AI Pills with Sudo..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Kill any existing processes on ports
echo -e "${YELLOW}Clearing ports...${NC}"
sudo lsof -ti:8000 | xargs sudo kill -9 2>/dev/null || true
sudo lsof -ti:3000 | xargs sudo kill -9 2>/dev/null || true
sleep 2

# Start Backend
echo -e "${BLUE}Starting Backend...${NC}"
cd Backend
source venv/bin/activate 2>/dev/null || (python3 -m venv venv && source venv/bin/activate)
pip install -r requirements.txt > /dev/null 2>&1
export MONGODB_URL="mongodb://localhost:27017/ai_pills"
export SECRET_KEY="your-secret-key-here"
export ALGORITHM="HS256"
export ACCESS_TOKEN_EXPIRE_MINUTES="30"

sudo -E uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..

# Start Frontend
echo -e "${BLUE}Starting Frontend...${NC}"
cd Frontend
sudo chown -R $(whoami) . 2>/dev/null || true
npm install > /dev/null 2>&1
export NEXT_PUBLIC_API_BASE_URL="http://localhost:8000/api/v1"

sudo -E npm run dev &
FRONTEND_PID=$!
cd ..

# Wait and check
sleep 10
echo -e "${GREEN}✅ Backend: http://localhost:8000${NC}"
echo -e "${GREEN}✅ Frontend: http://localhost:3000${NC}"
echo -e "${BLUE}Press Ctrl+C to stop${NC}"

# Cleanup function
cleanup() {
    echo -e "\n${YELLOW}Stopping services...${NC}"
    sudo kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    sudo lsof -ti:8000 | xargs sudo kill -9 2>/dev/null || true
    sudo lsof -ti:3000 | xargs sudo kill -9 2>/dev/null || true
    exit 0
}

trap cleanup INT
wait
