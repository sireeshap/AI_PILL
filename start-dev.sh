#!/bin/bash

# AI Pills Development Setup Script
# This script starts both backend and frontend in development mode

echo "🚀 Starting AI Pills Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Start MongoDB if not running (using Podman)
echo -e "${BLUE}Starting MongoDB...${NC}"
if ! podman ps | grep -q "ai-pills-mongodb"; then
    echo -e "${YELLOW}Starting MongoDB container...${NC}"
    podman run -d \
        --name ai-pills-mongodb \
        -p 27017:27017 \
        -e MONGO_INITDB_ROOT_USERNAME=admin \
        -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
        -e MONGO_INITDB_DATABASE=ai_pills \
        mongo:7.0
    sleep 5
else
    echo -e "${GREEN}MongoDB is already running${NC}"
fi

# Function to start backend
start_backend() {
    echo -e "${BLUE}Starting Backend on port 8000...${NC}"
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
    pip install -r requirements.txt
    
    # Set environment variables
    export MONGODB_URL="mongodb://admin:admin123@localhost:27017/ai_pills?authSource=admin"
    export SECRET_KEY="your-secret-key-here-change-in-production"
    export ALGORITHM="HS256"
    export ACCESS_TOKEN_EXPIRE_MINUTES="30"
    
    # Start the backend
    echo -e "${GREEN}🔥 Backend starting on http://localhost:8000${NC}"
    uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
    BACKEND_PID=$!
    cd ..
}

# Function to start frontend
start_frontend() {
    echo -e "${BLUE}Starting Frontend on port 3000...${NC}"
    cd Frontend
    
    # Install dependencies
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    npm install
    
    # Set environment variables
    export NEXT_PUBLIC_API_BASE_URL="http://localhost:8000/api/v1"
    
    # Start the frontend
    echo -e "${GREEN}🎨 Frontend starting on http://localhost:3000${NC}"
    npm run dev &
    FRONTEND_PID=$!
    cd ..
}

# Start backend in background
start_backend

# Wait a moment for backend to start
sleep 3

# Start frontend in background
start_frontend

# Wait for services to start
echo -e "${YELLOW}Waiting for services to start...${NC}"
sleep 10

# Check if services are running
echo -e "${BLUE}Checking service status...${NC}"

# Check backend
if curl -s http://localhost:8000/health > /dev/null; then
    echo -e "${GREEN}✅ Backend is running on http://localhost:8000${NC}"
    echo -e "${GREEN}   - API Documentation: http://localhost:8000/docs${NC}"
    echo -e "${GREEN}   - Health Check: http://localhost:8000/health${NC}"
else
    echo -e "${RED}❌ Backend failed to start${NC}"
fi

# Check frontend
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Frontend is running on http://localhost:3000${NC}"
    echo -e "${GREEN}   - Dashboard: http://localhost:3000/dashboard${NC}"
    echo -e "${GREEN}   - Login: http://localhost:3000/auth/login${NC}"
else
    echo -e "${RED}❌ Frontend failed to start${NC}"
fi

# MongoDB check
if podman ps | grep -q "ai-pills-mongodb"; then
    echo -e "${GREEN}✅ MongoDB is running on port 27017${NC}"
else
    echo -e "${RED}❌ MongoDB failed to start${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Development environment is ready!${NC}"
echo -e "${BLUE}Press Ctrl+C to stop all services${NC}"
echo ""

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Stopping development environment...${NC}"
    
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
    
    echo -e "${GREEN}Development environment stopped.${NC}"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Keep script running
echo -e "${BLUE}Monitoring services... Press Ctrl+C to stop${NC}"
while true; do
    sleep 5
    
    # Check if processes are still running
    if ! ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo -e "${RED}Backend process died, restarting...${NC}"
        start_backend
    fi
    
    if ! ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo -e "${RED}Frontend process died, restarting...${NC}"
        start_frontend
    fi
done
