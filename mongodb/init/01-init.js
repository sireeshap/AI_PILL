// MongoDB initialization script
// This script sets up the initial database structure and indexes

// Switch to the AI Pills database
db = db.getSiblingDB('ai_pills_production');

// Create collections with validation
db.createCollection('users', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['email', 'password_hash', 'name', 'phone', 'role', 'created_at'],
            properties: {
                email: {
                    bsonType: 'string',
                    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
                },
                password_hash: { bsonType: 'string' },
                name: { bsonType: 'string' },
                phone: { bsonType: 'string' },
                role: {
                    bsonType: 'string',
                    enum: ['developer', 'admin']
                },
                is_active: { bsonType: 'bool' },
                created_at: { bsonType: 'date' },
                updated_at: { bsonType: 'date' }
            }
        }
    }
});

db.createCollection('ai_agents', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['name', 'description', 'visibility', 'agent_type', 'created_by', 'created_at'],
            properties: {
                name: { bsonType: 'string' },
                description: { bsonType: 'string' },
                visibility: {
                    bsonType: 'string',
                    enum: ['public', 'private']
                },
                agent_type: { bsonType: 'string' },
                tags: {
                    bsonType: 'array',
                    items: { bsonType: 'string' }
                },
                file_refs: {
                    bsonType: 'array',
                    items: { bsonType: 'objectId' }
                },
                is_active: { bsonType: 'bool' },
                created_by: { bsonType: 'objectId' },
                created_at: { bsonType: 'date' },
                updated_at: { bsonType: 'date' }
            }
        }
    }
});

// Create indexes for better performance
print('Creating indexes...');

// User indexes
db.users.createIndex({ 'email': 1 }, { unique: true });
db.users.createIndex({ 'role': 1 });
db.users.createIndex({ 'is_active': 1 });
db.users.createIndex({ 'created_at': -1 });

// Agent indexes
db.ai_agents.createIndex({ 'created_by': 1 });
db.ai_agents.createIndex({ 'visibility': 1 });
db.ai_agents.createIndex({ 'agent_type': 1 });
db.ai_agents.createIndex({ 'tags': 1 });
db.ai_agents.createIndex({ 'is_active': 1 });
db.ai_agents.createIndex({ 'created_at': -1 });

// Compound indexes for common queries
db.ai_agents.createIndex({ 'visibility': 1, 'is_active': 1 });
db.ai_agents.createIndex({ 'created_by': 1, 'created_at': -1 });

// Text index for search functionality
db.ai_agents.createIndex({
    'name': 'text',
    'description': 'text',
    'tags': 'text'
}, {
    name: 'agent_search_index',
    weights: {
        'name': 10,
        'description': 5,
        'tags': 1
    }
});

print('Database initialization completed successfully!');
print('Collections created: users, ai_agents');
print('Indexes created for optimal performance');
