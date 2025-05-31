// backend/models/Agent.js

// This is a placeholder for the Agent schema.
// In a real application, you would use an ORM like Mongoose or Sequelize.

const Agent = {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  // developerId would be a reference to the User model's ID.
  // For example, if using Mongoose:
  // developerId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   required: true,
  //   ref: 'User', // This refers to the 'User' model
  // },
  developerId: {
    type: String, // Using String for simplicity in this placeholder
    required: true,
  },
  tags: {
    type: [String], // Array of strings
    default: [],
  },
  // Option 1: Link to a GitHub repository
  githubLink: {
    type: String,
    trim: true,
    // Validate if it's a valid GitHub URL (optional)
  },
  // Option 2: Direct file upload (details would depend on implementation)
  // agentFile: {
  //   type: Buffer, // Or String for file path if storing on filesystem
  //   // filename: String,
  //   // mimetype: String,
  //   // size: Number,
  //   // This field would require specific handling for file uploads (e.g., using multer)
  //   // and storage (e.g., GridFS for MongoDB, S3, or local filesystem).
  // },
  version: {
    type: String,
    default: '1.0.0',
  },
  status: {
    type: String,
    enum: ['development', 'published', 'archived'],
    default: 'development',
  },
  // Metrics and usage statistics (examples)
  downloads: {
    type: Number,
    default: 0,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
};

// Placeholder for saving a new agent to the database
// async function saveAgent(agentData) {
//   // Create a new agent instance with agentData
//   // Save the agent to the database
//   // Return the saved agent object
// }

// Placeholder for finding agents by developerId
// async function findAgentsByDeveloper(devId) {
//   // Find agents in the database where developerId matches devId
//   // Return an array of agent objects
// }

// Placeholder for finding a specific agent by ID
// async function findAgentById(id) {
//   // Find an agent in the database by its ID
//   // Return the agent object if found, null otherwise
// }

// Placeholder for updating an agent
// async function updateAgent(id, updateData) {
//   // Find the agent by ID and update its fields
//   // Return the updated agent object
// }

// Placeholder for deleting an agent
// async function deleteAgent(id) {
//   // Find the agent by ID and delete it
//   // Return some confirmation
// }

module.exports = Agent; // In a real app, you'd export the Mongoose/Sequelize model
