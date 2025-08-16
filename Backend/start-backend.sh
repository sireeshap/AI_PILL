#!/bin/bash

# AI Pills Backend Development Server
# Runs the FastAPI backend on port 8000

echo "🚀 Starting AI Pills Backend..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Navigate to backend directory
cd "$(dirname "$0")/Backend"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating Python virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment
echo -e "${BLUE}Activating virtual environment...${NC}"
source venv/bin/activate

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
pip install -r requirements.txt

# Set environment variables
export MONGODB_URL="mongodb://admin:admin123@localhost:27017/ai_pills?authSource=admin"
export SECRET_KEY="your-secret-key-here-change-in-production"
export ALGORITHM="HS256"
export ACCESS_TOKEN_EXPIRE_MINUTES="30"

# Check if port 8000 is available
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${RED}Port 8000 is already in use. Stopping existing process...${NC}"
    lsof -ti:8000 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

# Start MongoDB if not running
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
    sleep 5
fi

# Start the backend server
echo -e "${GREEN}🔥 Starting Backend on http://localhost:8000${NC}"
echo -e "${GREEN}📚 API Documentation: http://localhost:8000/docs${NC}"
echo -e "${GREEN}❤️  Health Check: http://localhost:8000/health${NC}"
echo ""
echo -e "${BLUE}Press Ctrl+C to stop the backend server${NC}"

uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
