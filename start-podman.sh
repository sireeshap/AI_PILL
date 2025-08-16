#!/bin/bash

# AI Pills Quick Start with Podman
# This script starts both backend and frontend using Podman

echo "🚀 Starting AI Pills with Podman..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Podman is installed
if ! command -v podman &> /dev/null; then
    echo -e "${RED}❌ Podman is not installed. Please install Podman first.${NC}"
    echo -e "${YELLOW}Visit: https://podman.io/getting-started/installation${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Podman is available${NC}"

# Function to check if a port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 1  # Port is in use
    else
        return 0  # Port is available
    fi
}

# Function to kill process on port
kill_port() {
    local port=$1
    echo -e "${YELLOW}Killing any existing process on port $port...${NC}"
    lsof -ti:$port | xargs kill -9 2>/dev/null || true
    sleep 2
}

# Check and clear ports
echo -e "${BLUE}Checking ports...${NC}"

# Backend port 8000
if ! check_port 8000; then
    echo -e "${YELLOW}Port 8000 is already in use${NC}"
    kill_port 8000
fi

# Frontend port 3000
if ! check_port 3000; then
    echo -e "${YELLOW}Port 3000 is already in use${NC}"
    kill_port 3000
fi

# Start MongoDB with Podman
echo -e "${BLUE}Starting MongoDB with Podman...${NC}"
if ! podman ps | grep -q "ai-pills-mongodb"; then
    echo -e "${YELLOW}Starting MongoDB container...${NC}"
    podman run -d \
        --name ai-pills-mongodb \
        -p 27017:27017 \
        -e MONGO_INITDB_ROOT_USERNAME=admin \
        -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
        -e MONGO_INITDB_DATABASE=ai_pills \
        mongo:7.0
    
    echo -e "${BLUE}Waiting for MongoDB to start...${NC}"
    sleep 10
    
    # Check if MongoDB is running
    if podman ps | grep -q "ai-pills-mongodb"; then
        echo -e "${GREEN}✅ MongoDB started successfully${NC}"
    else
        echo -e "${RED}❌ Failed to start MongoDB${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ MongoDB is already running${NC}"
fi

# Start Backend
echo -e "${BLUE}Starting Backend...${NC}"
cd Backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating Python virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo -e "${YELLOW}Installing backend dependencies...${NC}"
pip install -r requirements.txt > /dev/null 2>&1

# Set environment variables
export MONGODB_URL="mongodb://admin:admin123@localhost:27017/ai_pills?authSource=admin"
export SECRET_KEY="your-secret-key-here-change-in-production"
export ALGORITHM="HS256"
export ACCESS_TOKEN_EXPIRE_MINUTES="30"

# Start the backend in background
echo -e "${GREEN}🔥 Starting Backend on http://localhost:8000${NC}"
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

cd ..

# Wait for backend to start
echo -e "${BLUE}Waiting for backend to start...${NC}"
sleep 10

# Check backend health
if curl -s http://localhost:8000/health > /dev/null; then
    echo -e "${GREEN}✅ Backend is running on http://localhost:8000${NC}"
    echo -e "${GREEN}   - API Documentation: http://localhost:8000/docs${NC}"
    echo -e "${GREEN}   - Health Check: http://localhost:8000/health${NC}"
else
    echo -e "${RED}❌ Backend failed to start${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# Start Frontend
echo -e "${BLUE}Starting Frontend...${NC}"
cd Frontend

# Install dependencies
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
npm install > /dev/null 2>&1

# Set environment variables
export NEXT_PUBLIC_API_BASE_URL="http://localhost:8000/api/v1"

# Start the frontend in background
echo -e "${GREEN}🎨 Starting Frontend on http://localhost:3000${NC}"
npm run dev &
FRONTEND_PID=$!

cd ..

# Wait for frontend to start
echo -e "${BLUE}Waiting for frontend to start...${NC}"
sleep 15

# Check frontend
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Frontend is running on http://localhost:3000${NC}"
    echo -e "${GREEN}   - Dashboard: http://localhost:3000/dashboard${NC}"
    echo -e "${GREEN}   - Login: http://localhost:3000/auth/login${NC}"
else
    echo -e "${RED}❌ Frontend failed to start${NC}"
fi

echo ""
echo -e "${GREEN}🎉 AI Pills is now running with Podman!${NC}"
echo ""
echo -e "${BLUE}Services:${NC}"
echo -e "${GREEN}  🔥 Backend:  http://localhost:8000${NC}"
echo -e "${GREEN}  🎨 Frontend: http://localhost:3000${NC}"
echo -e "${GREEN}  🗄️  MongoDB: localhost:27017${NC}"
echo ""
echo -e "${BLUE}Press Ctrl+C to stop all services${NC}"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Stopping AI Pills services...${NC}"
    
    # Kill backend
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    
    # Kill frontend
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    
    # Kill any remaining processes on the ports
    kill_port 8000
    kill_port 3000
    
    # Stop MongoDB container
    echo -e "${YELLOW}Stopping MongoDB container...${NC}"
    podman stop ai-pills-mongodb 2>/dev/null || true
    
    echo -e "${GREEN}All services stopped.${NC}"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Keep script running and monitor services
echo -e "${BLUE}Monitoring services... Press Ctrl+C to stop${NC}"
while true; do
    sleep 5
    
    # Check if processes are still running
    if ! ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo -e "${RED}Backend process died${NC}"
        break
    fi
    
    if ! ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo -e "${RED}Frontend process died${NC}"
        break
    fi
done
