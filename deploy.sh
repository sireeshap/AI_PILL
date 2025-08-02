#!/bin/bash

# AI Pills Deployment Script
# This script handles the deployment of the AI Pills application

set -e  # Exit on any error

# Configuration
DEPLOY_DIR="/opt/ai-pills"
BACKUP_DIR="/opt/ai-pills-backups"
LOG_FILE="/var/log/ai-pills-deploy.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1" | tee -a "$LOG_FILE"
}

# Pre-deployment checks
pre_deployment_checks() {
    log "Running pre-deployment checks..."
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        error "Docker is not running. Please start Docker and try again."
    fi
    
    # Check if docker-compose is available
    if ! command -v docker-compose &> /dev/null; then
        error "docker-compose is not installed. Please install it and try again."
    fi
    
    # Check if deployment directory exists
    if [ ! -d "$DEPLOY_DIR" ]; then
        error "Deployment directory $DEPLOY_DIR does not exist."
    fi
    
    # Check if .env file exists
    if [ ! -f "$DEPLOY_DIR/.env" ]; then
        error "Environment file $DEPLOY_DIR/.env does not exist."
    fi
    
    log "Pre-deployment checks passed ✓"
}

# Create backup
create_backup() {
    log "Creating backup..."
    
    # Create backup directory if it doesn't exist
    mkdir -p "$BACKUP_DIR"
    
    # Create timestamped backup
    BACKUP_NAME="ai-pills-backup-$(date +'%Y%m%d-%H%M%S')"
    BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"
    
    # Backup current deployment
    if [ -d "$DEPLOY_DIR" ]; then
        cp -r "$DEPLOY_DIR" "$BACKUP_PATH"
        log "Backup created at $BACKUP_PATH ✓"
    else
        warning "No existing deployment to backup"
    fi
    
    # Keep only last 5 backups
    cd "$BACKUP_DIR"
    ls -t | tail -n +6 | xargs -I {} rm -rf {}
}

# Pull latest images
pull_images() {
    log "Pulling latest Docker images..."
    
    cd "$DEPLOY_DIR"
    
    # Load environment variables
    source .env
    
    # Pull images
    docker pull "$BACKEND_IMAGE" || error "Failed to pull backend image"
    docker pull "$FRONTEND_IMAGE" || error "Failed to pull frontend image"
    
    log "Docker images pulled successfully ✓"
}

# Deploy application
deploy_application() {
    log "Deploying application..."
    
    cd "$DEPLOY_DIR"
    
    # Stop existing containers
    log "Stopping existing containers..."
    docker-compose down --remove-orphans
    
    # Start new containers
    log "Starting new containers..."
    docker-compose up -d
    
    log "Application deployed ✓"
}

# Health checks
health_checks() {
    log "Running health checks..."
    
    # Wait for services to start
    sleep 30
    
    # Check backend health
    for i in {1..10}; do
        if curl -f http://localhost:8000/health > /dev/null 2>&1; then
            log "Backend health check passed ✓"
            break
        else
            if [ $i -eq 10 ]; then
                error "Backend health check failed after 10 attempts"
            fi
            log "Backend not ready, waiting... (attempt $i/10)"
            sleep 10
        fi
    done
    
    # Check frontend health
    for i in {1..10}; do
        if curl -f http://localhost:3000 > /dev/null 2>&1; then
            log "Frontend health check passed ✓"
            break
        else
            if [ $i -eq 10 ]; then
                error "Frontend health check failed after 10 attempts"
            fi
            log "Frontend not ready, waiting... (attempt $i/10)"
            sleep 10
        fi
    done
    
    log "All health checks passed ✓"
}

# Cleanup old images
cleanup() {
    log "Cleaning up old Docker images..."
    
    # Remove dangling images
    docker image prune -f
    
    # Remove unused containers
    docker container prune -f
    
    log "Cleanup completed ✓"
}

# Rollback function
rollback() {
    log "Rolling back to previous version..."
    
    # Stop current containers
    cd "$DEPLOY_DIR"
    docker-compose down
    
    # Find latest backup
    LATEST_BACKUP=$(ls -t "$BACKUP_DIR" | head -n 1)
    
    if [ -n "$LATEST_BACKUP" ]; then
        # Restore from backup
        rm -rf "$DEPLOY_DIR"
        cp -r "$BACKUP_DIR/$LATEST_BACKUP" "$DEPLOY_DIR"
        
        # Start containers
        cd "$DEPLOY_DIR"
        docker-compose up -d
        
        log "Rollback completed ✓"
    else
        error "No backup found for rollback"
    fi
}

# Main deployment function
main() {
    log "Starting AI Pills deployment..."
    
    # Check if rollback is requested
    if [ "$1" == "rollback" ]; then
        rollback
        exit 0
    fi
    
    # Run deployment steps
    pre_deployment_checks
    create_backup
    pull_images
    deploy_application
    health_checks
    cleanup
    
    log "Deployment completed successfully! 🚀"
    log "Application is now running at:"
    log "  - Frontend: http://localhost:3000"
    log "  - Backend API: http://localhost:8000"
    log "  - API Docs: http://localhost:8000/docs"
}

# Error handling
trap 'error "Deployment failed. Check logs at $LOG_FILE"' ERR

# Run main function
main "$@"
