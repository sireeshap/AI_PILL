#!/bin/bash

# AI Pills Development Stop Script
# This script stops all development services

echo "🛑 Stopping AI Pills Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to kill process on port
kill_port() {
    local port=$1
    echo -e "${YELLOW}Stopping processes on port $port...${NC}"
    lsof -ti:$port | xargs kill -9 2>/dev/null || true
}

# Stop backend (port 8000)
echo -e "${BLUE}Stopping Backend...${NC}"
kill_port 8000

# Stop frontend (port 3000)  
echo -e "${BLUE}Stopping Frontend...${NC}"
kill_port 3000

# Stop MongoDB container
echo -e "${BLUE}Stopping MongoDB...${NC}"
podman stop ai-pills-mongodb 2>/dev/null || true
podman rm ai-pills-mongodb 2>/dev/null || true

# Kill any remaining Python/Node processes related to the project
echo -e "${BLUE}Cleaning up remaining processes...${NC}"
pkill -f "uvicorn app.main:app" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true

echo -e "${GREEN}✅ All services stopped successfully!${NC}"
