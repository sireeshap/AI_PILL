# AI Pills - Technical Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Authentication & Authorization](#authentication--authorization)
6. [Database Connections](#database-connections)
7. [Development Setup](#development-setup)

---

## Project Overview

AI Pills is a platform that allows developers to register, manage AI agents, and enables users to browse and interact with them. The platform includes administrative functionalities for oversight and management.

### Tech Stack
- **Backend**: FastAPI (Python)
- **Frontend**: Next.js (TypeScript/React)
- **Database**: MongoDB with Beanie ODM
- **Authentication**: JWT-based
- **File Storage**: MongoDB GridFS / Cloud Storage (S3/GCS)

---

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (Next.js)     │◄──►│   (FastAPI)     │◄──►│   (MongoDB)     │
│   Port: 3000    │    │   Port: 8000    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Components
- **Frontend**: React-based UI with Material-UI components
- **Backend**: FastAPI with async/await support
- **Database**: MongoDB with automatic fallback to local instance
- **ODM**: Beanie for MongoDB object-document mapping
- **Security**: JWT tokens with role-based access control

---

## Database Schema

### 1. users Collection
Stores authentication and profile data for developers and administrators.

```json
{
  "_id": "ObjectId",
  "email": "String (unique)",
  "hashed_password": "String",
  "role": "developer | admin",
  "name": "String",
  "created_at": "Date",
  "updated_at": "Date",
  "last_login": "Date"
}
```

**Indexes:**
- ✅ `email` (unique)
- ✅ `role`

**Validation Rules:**
- Email must be valid email format
- Role must be either "developer" or "admin"
- Password must be hashed using bcrypt

---

### 2. ai_agents Collection
Stores agent metadata uploaded by developers.

```json
{
  "_id": "ObjectId",
  "name": "String",
  "description": "String",
  "created_by": "ObjectId (ref: users._id)",
  "visibility": "public | private",
  "tags": ["String"],
  "agent_type": "chatbot | retriever | classifier | custom",
  "file_refs": ["ObjectId (ref: files._id)"],
  "is_active": "Boolean",
  "created_at": "Date",
  "updated_at": "Date"
}
```

**Indexes:**
- ✅ `created_by`
- ✅ `visibility`
- ✅ `tags`
- ✅ `agent_type`

**Business Rules:**
- Only the creator or admin can modify an agent
- Public agents are visible to all users
- Private agents are only visible to the creator

---

### 3. files Collection
Stores metadata for large uploads (models, prompts, PDFs, configs). Actual files are stored in MongoDB GridFS or cloud storage.

```json
{
  "_id": "ObjectId",
  "filename": "String",
  "content_type": "String",
  "size_bytes": "Number",
  "storage_type": "gridfs | s3 | gcs",
  "storage_path": "String",
  "uploaded_by": "ObjectId (ref: users._id)",
  "agent_id": "ObjectId (ref: ai_agents._id, optional)",
  "created_at": "Date"
}
```

**Indexes:**
- ✅ `uploaded_by`
- ✅ `agent_id`
- ✅ `storage_type`

**Storage Options:**
- **GridFS**: For development and smaller deployments
- **S3**: For production AWS deployments
- **GCS**: For production Google Cloud deployments

---

### 4. admin_logs Collection (Optional)
Tracks admin-level actions for auditability.

```json
{
  "_id": "ObjectId",
  "admin_id": "ObjectId (ref: users._id)",
  "action": "String",
  "target_type": "user | agent | system",
  "target_id": "ObjectId",
  "description": "String",
  "created_at": "Date"
}
```

**Common Actions:**
- `user_suspended`
- `user_banned`
- `agent_disabled`
- `agent_featured`
- `system_maintenance`

---

### 5. agent_stats Collection (Optional)
Track public usage and analytics for high-volume scenarios.

```json
{
  "_id": "ObjectId",
  "agent_id": "ObjectId (ref: ai_agents._id)",
  "date": "Date",
  "views": "Number",
  "downloads": "Number",
  "api_calls": "Number"
}
```

**Indexes:**
- ✅ `agent_id + date` (compound index)

---

## API Endpoints

### Authentication Endpoints (`/api/v1/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /refresh` - Refresh JWT token
- `POST /logout` - User logout

### Agent Management (`/api/v1/agents`)
- `GET /` - List user's agents
- `POST /` - Create new agent
- `GET /{agent_id}` - Get specific agent
- `PUT /{agent_id}` - Update agent
- `DELETE /{agent_id}` - Delete agent

### Public Agents (`/api/v1/public/agents`)
- `GET /` - List all public agents
- `GET /{agent_id}` - Get public agent details
- `GET /featured` - Get featured agents

### Admin Panel (`/api/v1/admin`)
- `GET /users` - List all users
- `GET /agents` - List all agents
- `PUT /users/{user_id}/status` - Update user status
- `PUT /agents/{agent_id}/status` - Update agent status
- `GET /logs` - View admin logs

### System Endpoints
- `GET /` - Welcome message
- `GET /health` - Health check and database status
- `GET /docs` - API documentation (Swagger UI)

---

## Authentication & Authorization

### JWT Token Structure
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "developer|admin",
  "exp": "expiration_timestamp",
  "iat": "issued_at_timestamp"
}
```

### Role-Based Access Control

**Developer Role:**
- Create, read, update, delete own agents
- Upload files for own agents
- View public agents
- Manage own profile

**Admin Role:**
- All developer permissions
- View all users and agents
- Suspend/activate users
- Disable/enable agents
- Access admin logs
- System management

### Security Features
- Password hashing with bcrypt
- JWT token-based authentication
- Role-based authorization
- CORS protection
- Request rate limiting (recommended for production)

---

## Database Connections

### Connection Strategy
The application implements a smart fallback mechanism for database connectivity:

1. **Primary**: Cloud MongoDB (MongoDB Atlas)
   - Connection: `mongodb+srv://...@cluster0.jkbkuqi.mongodb.net/`
   - Database: `ai_pills_db`

2. **Fallback**: Local MongoDB
   - Connection: `mongodb://localhost:27017/`
   - Database: `ai_pills_db` (same name)

### Connection Configuration
```python
# Cloud MongoDB settings
MONGODB_CONNECTION_STRING = "mongodb+srv://..."
MONGODB_LOCAL_CONNECTION_STRING = "mongodb://localhost:27017/"
DATABASE_NAME = "ai_pills_db"

# Connection pool settings
MONGODB_MIN_CONNECTIONS = 10
MONGODB_MAX_CONNECTIONS = 10
```

### Connection Flow
```
1. Attempt cloud MongoDB connection (10s timeout)
   ├─ Success → Initialize Beanie ODM → Ready
   └─ Failure → Attempt local MongoDB (5s timeout)
      ├─ Success → Initialize Beanie ODM → Ready
      └─ Failure → Start in fallback mode (no database)
```

### Health Check Response
```json
{
  "status": "healthy",
  "message": "AI Pills FastAPI Backend is running",
  "database": {
    "status": "connected",
    "connection_type": "cloud|local",
    "connection_details": "MongoDB Atlas|localhost:27017",
    "message": "Connected to ai_pills_db"
  }
}
```

---

## Development Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- MongoDB (local installation or Atlas account)

### Backend Setup
```bash
cd Backend
python -m venv .venv
source .venv/bin/activate  # On macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

### Environment Variables
Create `.env` file in Backend directory:
```env
SECRET_KEY=your-secret-key-here
MONGODB_CONNECTION_STRING=mongodb+srv://...
MONGODB_LOCAL_CONNECTION_STRING=mongodb://localhost:27017/
DATABASE_NAME=ai_pills_db
```

### Testing Database Connections
1. **Test Cloud Connection**: Start the backend - it will attempt cloud first
2. **Test Local Fallback**: Disconnect from internet or use invalid cloud credentials
3. **Health Check**: Visit `http://localhost:8000/health` to see connection status

### Local MongoDB Setup (if needed)
```bash
# Install MongoDB (macOS with Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify connection
mongosh mongodb://localhost:27017/ai_pills_db
```

---

## API Testing

### Using the Interactive Docs
Visit `http://localhost:8000/docs` for Swagger UI with interactive API testing.

### Sample API Calls

**Register User:**
```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "developer@example.com",
    "password": "securepassword",
    "name": "John Developer"
  }'
```

**Create Agent:**
```bash
curl -X POST "http://localhost:8000/api/v1/agents" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My AI Assistant",
    "description": "A helpful AI assistant",
    "agent_type": "chatbot",
    "visibility": "public",
    "tags": ["assistant", "helpful"]
  }'
```

**Health Check:**
```bash
curl http://localhost:8000/health
```

---

## Production Considerations

### Security
- Use strong JWT secret keys
- Implement rate limiting
- Add request validation
- Use HTTPS in production
- Regular security audits

### Performance
- Database connection pooling
- Caching for frequently accessed data
- File storage optimization
- API response compression
- Database query optimization

### Monitoring
- Application logs
- Database performance metrics
- API response times
- Error tracking
- User activity analytics

### Backup & Recovery
- Regular database backups
- File storage backups
- Disaster recovery procedures
- Data retention policies

---

**Last Updated:** August 2, 2025  
**Version:** 1.0.0
