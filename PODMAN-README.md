# 🐳 AI Pills - Podman Setup Guide

This guide shows you how to run AI Pills using **Podman** instead of Docker.

## 📋 **Prerequisites**

### **1. Install Podman**

**macOS:**
```bash
brew install podman
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y podman
```

**CentOS/RHEL/Fedora:**
```bash
sudo dnf install podman
```

### **2. Verify Installation**
```bash
podman --version
```

## 🚀 **Quick Start**

### **Option 1: One-Command Start (Recommended)**
```bash
./start-podman.sh
```

This script will:
- ✅ Start MongoDB with Podman
- ✅ Start Backend on port 8000
- ✅ Start Frontend on port 3000
- ✅ Monitor all services

### **Option 2: Manual Start**

**1. Start MongoDB:**
```bash
podman run -d \
    --name ai-pills-mongodb \
    -p 27017:27017 \
    -e MONGO_INITDB_ROOT_USERNAME=admin \
    -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
    -e MONGO_INITDB_DATABASE=ai_pills \
    mongo:7.0
```

**2. Start Backend:**
```bash
cd Backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

export MONGODB_URL="mongodb://admin:admin123@localhost:27017/ai_pills?authSource=admin"
export SECRET_KEY="your-secret-key-here"

uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**3. Start Frontend (in new terminal):**
```bash
cd Frontend
npm install
export NEXT_PUBLIC_API_BASE_URL="http://localhost:8000/api/v1"
npm run dev
```

## 🛑 **Stop Services**

```bash
./stop-podman.sh
```

Or manually:
```bash
# Stop containers
podman stop ai-pills-mongodb
podman rm ai-pills-mongodb

# Stop processes
pkill -f "uvicorn app.main:app"
pkill -f "next dev"
```

## 🌐 **Access URLs**

Once running, access:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 🏗️ **Production Deployment with Podman**

### **Using podman-compose:**

```bash
# Copy environment file
cp .env.example .env

# Edit environment variables
nano .env

# Start with podman-compose
podman-compose -f podman-compose.yml up -d
```

### **Build Images with Podman:**

```bash
# Build backend
podman build -t ai-pills-backend:latest ./Backend

# Build frontend  
podman build -t ai-pills-frontend:latest ./Frontend

# Run with custom images
podman run -d --name ai-pills-backend -p 8000:8000 ai-pills-backend:latest
podman run -d --name ai-pills-frontend -p 3000:3000 ai-pills-frontend:latest
```

## 🔧 **Troubleshooting**

### **Common Issues:**

**1. Podman not found:**
```bash
# Install podman first
brew install podman  # macOS
sudo apt install podman  # Ubuntu
```

**2. Port already in use:**
```bash
# Kill processes on ports
lsof -ti:8000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

**3. Container won't start:**
```bash
# Check logs
podman logs ai-pills-mongodb

# Remove and recreate
podman rm -f ai-pills-mongodb
```

**4. Permission issues:**
```bash
# Fix podman permissions
podman system reset
```

## 📊 **Monitoring**

### **Check Running Containers:**
```bash
podman ps
```

### **View Logs:**
```bash
# MongoDB logs
podman logs ai-pills-mongodb

# Follow logs in real-time
podman logs -f ai-pills-mongodb
```

### **Container Stats:**
```bash
podman stats
```

## 🔄 **Development Workflow**

### **1. Code Changes:**
- Backend changes: Auto-reload with `--reload` flag
- Frontend changes: Auto-reload with Next.js dev server

### **2. Database Access:**
```bash
# Connect to MongoDB
podman exec -it ai-pills-mongodb mongosh -u admin -p admin123
```

### **3. Reset Everything:**
```bash
./stop-podman.sh
podman system prune -a
./start-podman.sh
```

## 🚀 **CI/CD with Podman**

The project includes a Podman-compatible CI/CD pipeline:
- **File**: `.github/workflows/ci-cd-podman.yml`
- **Features**: Testing, building, pushing, and deploying with Podman

## 📝 **Environment Variables**

Create `.env` file:
```bash
# Database
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=admin123
MONGO_DATABASE=ai_pills

# Backend
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Frontend
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1

# Production
BACKEND_IMAGE=yourusername/ai-pills-backend:latest
FRONTEND_IMAGE=yourusername/ai-pills-frontend:latest
```

## 🆚 **Podman vs Docker**

**Advantages of Podman:**
- ✅ Rootless containers by default
- ✅ No daemon required
- ✅ Better security
- ✅ Docker CLI compatible
- ✅ Systemd integration

**Usage is nearly identical:**
```bash
# Docker → Podman
docker run → podman run
docker build → podman build
docker-compose → podman-compose
```

## 🎯 **Next Steps**

1. **Development**: Use `./start-podman.sh` for daily development
2. **Testing**: Run with different environments
3. **Production**: Use `podman-compose.yml` for deployment
4. **Scaling**: Consider Kubernetes with Podman

---

**Happy coding with Podman! 🎉**
