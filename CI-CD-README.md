# AI Pills CI/CD Pipeline

This directory contains the complete CI/CD pipeline configuration for the AI Pills application, including GitHub Actions workflows, Docker configurations, and deployment scripts.

## 🚀 Features

- **Automated Testing**: Backend and frontend tests run on every push/PR
- **Security Scanning**: Vulnerability scanning with Trivy
- **Docker Build & Push**: Automatic Docker image builds and pushes to Docker Hub
- **Production Deployment**: Automated deployment to production servers
- **Health Checks**: Comprehensive health monitoring
- **Rollback Support**: Quick rollback to previous versions
- **Notifications**: Slack notifications for deployment status

## 📁 File Structure

```
.github/workflows/
  └── ci-cd.yml              # Main CI/CD pipeline
Backend/
  └── Dockerfile             # Backend Docker configuration
Frontend/
  └── Dockerfile             # Frontend Docker configuration
nginx/
  └── nginx.conf             # Nginx reverse proxy configuration
mongodb/init/
  └── 01-init.js             # MongoDB initialization script
docker-compose.yml           # Production deployment configuration
.env.example                 # Environment variables template
deploy.sh                    # Deployment script
```

## 🔧 Setup Instructions

### 1. GitHub Secrets Configuration

Add the following secrets to your GitHub repository (Settings → Secrets and variables → Actions):

#### Docker Hub Configuration
- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Your Docker Hub password or access token

#### Production Server Configuration
- `PRODUCTION_HOST`: IP address or hostname of your production server
- `PRODUCTION_USER`: SSH username for the production server
- `PRODUCTION_SSH_KEY`: Private SSH key for server access
- `PRODUCTION_PORT`: SSH port (default: 22)

#### Application Configuration
- `SECRET_KEY`: JWT secret key (minimum 32 characters)
- `PRODUCTION_API_URL`: Your production API URL (e.g., https://api.yourdomain.com/api/v1)

#### Optional: Slack Notifications
- `SLACK_WEBHOOK`: Slack webhook URL for deployment notifications

### 2. Production Server Setup

#### Prerequisites
- Ubuntu 20.04+ or similar Linux distribution
- Docker and Docker Compose installed
- Nginx installed (if not using containerized Nginx)
- SSL certificates configured

#### Installation Steps

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 3. Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 4. Create deployment directory
sudo mkdir -p /opt/ai-pills
sudo chown $USER:$USER /opt/ai-pills

# 5. Clone repository (or copy files)
cd /opt/ai-pills
# Copy docker-compose.yml, .env, nginx/, mongodb/ directories

# 6. Configure environment
cp .env.example .env
# Edit .env file with your production values
```

### 3. Environment Configuration

Copy `.env.example` to `.env` and configure the following variables:

```bash
# Database Configuration
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your_secure_mongodb_password
MONGO_DATABASE=ai_pills_production

# Security
SECRET_KEY=your_super_secret_jwt_key_here_minimum_32_characters

# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api/v1
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Docker Images (automatically set by CI/CD)
BACKEND_IMAGE=your_dockerhub_username/ai-pills-backend:latest
FRONTEND_IMAGE=your_dockerhub_username/ai-pills-frontend:latest
```

### 4. SSL Certificate Setup

Place your SSL certificates in the `nginx/ssl/` directory:

```bash
nginx/ssl/
  ├── cert.pem    # SSL certificate
  └── key.pem     # Private key
```

Or use Let's Encrypt:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 🔄 CI/CD Pipeline Workflow

### Trigger Events
- Push to `master` or `main` branch
- Pull requests to `master` or `main` branch

### Pipeline Stages

1. **Backend Testing**
   - Set up Python environment
   - Install dependencies
   - Run pytest tests
   - Health check testing

2. **Frontend Testing**
   - Set up Node.js environment
   - Install dependencies
   - Run linting
   - Build application
   - Run tests

3. **Security Scanning**
   - Trivy vulnerability scanning
   - Upload results to GitHub Security

4. **Build & Push** (master/main only)
   - Build Docker images
   - Push to Docker Hub
   - Tag with git SHA and latest

5. **Deploy** (master/main only)
   - SSH to production server
   - Pull latest images
   - Update docker-compose
   - Deploy with zero downtime
   - Run health checks

6. **Notification**
   - Send Slack notification with status

## 🚀 Manual Deployment

You can also deploy manually using the deployment script:

```bash
# Deploy latest version
./deploy.sh

# Rollback to previous version
./deploy.sh rollback
```

## 📊 Monitoring and Health Checks

### Health Check Endpoints
- Backend: `https://yourdomain.com/health`
- Frontend: `https://yourdomain.com`
- API Docs: `https://yourdomain.com/docs`

### Log Files
- Deployment logs: `/var/log/ai-pills-deploy.log`
- Nginx logs: `./nginx_logs/`
- Application logs: `docker-compose logs -f`

### Container Status
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Monitor resources
docker stats
```

## 🔒 Security Features

- **Rate Limiting**: API and auth endpoints have rate limiting
- **CORS Protection**: Properly configured CORS headers
- **Security Headers**: X-Frame-Options, XSS Protection, etc.
- **HTTPS Only**: Automatic HTTP to HTTPS redirect
- **Container Security**: Non-root users in containers
- **Vulnerability Scanning**: Automated security scanning

## 🛠 Troubleshooting

### Common Issues

1. **Docker build fails**
   - Check Dockerfile syntax
   - Ensure all dependencies are available
   - Verify base image versions

2. **Deployment fails**
   - Check SSH connectivity
   - Verify server has enough resources
   - Check environment variable configuration

3. **Health checks fail**
   - Verify services are running: `docker-compose ps`
   - Check logs: `docker-compose logs`
   - Test endpoints manually: `curl http://localhost:8000/health`

4. **Database connection issues**
   - Check MongoDB container status
   - Verify environment variables
   - Check network connectivity between containers

### Debug Commands

```bash
# Check deployment status
./deploy.sh

# View all logs
docker-compose logs

# Restart specific service
docker-compose restart backend

# Check container health
docker inspect ai-pills-backend --format='{{.State.Health.Status}}'

# Test database connection
docker-compose exec backend python -c "from app.core.database import connect_to_mongo; connect_to_mongo()"
```

## 📈 Performance Optimization

- **Nginx caching** for static assets
- **Gzip compression** enabled
- **Docker multi-stage builds** for smaller images
- **Database indexing** for optimal queries
- **Health checks** with proper timeouts

## 🔄 Maintenance

### Regular Tasks
- Monitor disk space: `df -h`
- Update Docker images: `docker-compose pull && docker-compose up -d`
- Backup database: `docker-compose exec mongodb mongodump`
- Clean up old images: `docker system prune -f`
- Review logs: `tail -f /var/log/ai-pills-deploy.log`

### Backup Strategy
- Automated daily backups created during deployments
- Keep last 5 deployment backups
- Database backups should be configured separately

## 📞 Support

For issues with the CI/CD pipeline:
1. Check GitHub Actions logs
2. Review deployment script logs
3. Verify server configuration
4. Check Docker container status

---

**Last Updated**: August 3, 2025
**Pipeline Version**: 1.0
