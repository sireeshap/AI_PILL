// backend/routes/agents.js
const express = require('express');
const router = express.Router();

// Placeholder for Agent model
// const Agent = require('../models/Agent');

// --- Authentication Placeholder Middleware ---
// In a real app, this would involve token verification (e.g., JWT)
// and fetching the user from the database.
const protect = (req, res, next) => {
  console.log(
    'Protect middleware called - user authentication would happen here'
  );
  // Simulate an authenticated user by attaching a user object to the request
  req.user = { id: 'mockDeveloperId123' }; // Example user ID
  next();
};

// @route   POST api/agents/upload
// @desc    Upload/Create a new AI agent
// @access  Protected
router.post('/upload', protect, async (req, res) => {
  const { name, description, tags, githubLink } = req.body;
  const developerId = req.user.id; // Get developerId from the authenticated user

  console.log('Received agent upload request:');
  console.log('Developer ID:', developerId);
  console.log('Name:', name);
  console.log('Description:', description);
  console.log('Tags:', tags);
  console.log('GitHub Link:', githubLink);

  // Basic validation
  if (!name || !description) {
    return res.status(400).json({ msg: 'Name and description are required' });
  }

  // --- Database Logic Placeholder for Saving Agent ---
  // 1. Handle file upload if `agentFile` was part of the request
  //    (e.g., using multer for multipart/form-data).
  //    - If storing files directly in DB (like GridFS): save file buffer.
  //    - If storing on a file system/S3: save file path/URL.
  //    const agentFilePath = req.file ? req.file.path : null;

  // 2. Create a new agent object with the data
  //    const newAgent = new Agent({
  //      name,
  //      description,
  //      developerId, // from req.user.id
  //      tags: tags ? tags.split(',').map(tag => tag.trim()) : [], // Example tag processing
  //      githubLink,
  //      // agentFile: agentFilePath, // if applicable
  //      // ... other fields
  //    });

  // 3. Save the agent to the database
  //    await newAgent.save();
  // --- End Database Logic Placeholder ---

  // For now, returning a success message with a mock agentId
  const mockAgentId = `agent_${Date.now()}`;
  res.status(201).json({
    msg: 'Agent uploaded/created successfully (placeholder)',
    agentId: mockAgentId,
    developerId,
    agentData: req.body,
  });
});

// @route   GET api/agents
// @desc    Get all agents for the authenticated developer
// @access  Protected
router.get('/', protect, async (req, res) => {
  const developerId = req.user.id;
  console.log(`Fetching agents for developer ID: ${developerId}`);

  // --- Database Logic Placeholder for Fetching Agents ---
  // const agents = await Agent.find({ developerId: developerId });
  // --- End Database Logic Placeholder ---

  // Mock response
  const mockAgents = [
    {
      id: 'agent1',
      name: 'My First Agent',
      developerId: developerId,
      description: 'Does cool stuff.',
    },
    {
      id: 'agent2',
      name: 'ChatBot X',
      developerId: developerId,
      description: 'A friendly chatbot.',
    },
  ];
  res.json(mockAgents);
});

// @route   GET api/agents/:agentId
// @desc    Get a specific agent by ID
// @access  Protected
router.get('/:agentId', protect, async (req, res) => {
  const { agentId } = req.params;
  const developerId = req.user.id;
  console.log(`Fetching agent ID: ${agentId} for developer ID: ${developerId}`);

  // --- Database Logic Placeholder ---
  // 1. Find the agent by its ID
  //    const agent = await Agent.findById(agentId);
  // 2. Check if agent exists
  //    if (!agent) {
  //      return res.status(404).json({ msg: 'Agent not found' });
  //    }
  // 3. Verify ownership: Check if agent.developerId matches req.user.id
  //    if (agent.developerId.toString() !== developerId) { // Ensure types match for comparison
  //      return res.status(403).json({ msg: 'User not authorized to access this agent' });
  //    }
  // --- End Database Logic Placeholder ---

  // Mock response
  const mockAgent = {
    id: agentId,
    name: `Sample Agent ${agentId}`,
    description: 'This is a detailed description of the sample agent.',
    developerId: developerId,
    tags: ['ai', 'sample', 'test'],
    githubLink: `https://github.com/developer/${agentId}`,
    version: '1.0.1',
    status: 'published',
  };
  res.json(mockAgent);
});

// @route   PUT api/agents/:agentId
// @desc    Update an existing agent
// @access  Protected
router.put('/:agentId', protect, async (req, res) => {
  const { agentId } = req.params;
  const developerId = req.user.id;
  const updateData = req.body;

  console.log(
    `Attempting to update agent ID: ${agentId} by developer ID: ${developerId}`
  );
  console.log('Update data:', updateData);

  // --- Database Logic Placeholder ---
  // 1. Find the agent by ID
  //    let agent = await Agent.findById(agentId);
  // 2. Check if agent exists
  //    if (!agent) {
  //      return res.status(404).json({ msg: 'Agent not found' });
  //    }
  // 3. Verify ownership
  //    if (agent.developerId.toString() !== developerId) {
  //      return res.status(403).json({ msg: 'User not authorized to update this agent' });
  //    }
  // 4. Update the agent's fields
  //    agent = await Agent.findByIdAndUpdate(agentId, { $set: updateData }, { new: true });
  // --- End Database Logic Placeholder ---

  // Mock response
  const mockUpdatedAgent = {
    id: agentId,
    ...updateData, // Include the updates
    developerId: developerId,
    updatedAt: new Date().toISOString(),
  };
  res.json({
    msg: 'Agent updated successfully (placeholder)',
    agent: mockUpdatedAgent,
  });
});

// @route   DELETE api/agents/:agentId
// @desc    Delete an agent
// @access  Protected
router.delete('/:agentId', protect, async (req, res) => {
  const { agentId } = req.params;
  const developerId = req.user.id;

  console.log(
    `Attempting to delete agent ID: ${agentId} by developer ID: ${developerId}`
  );

  // --- Database Logic Placeholder ---
  // 1. Find the agent by ID
  //    const agent = await Agent.findById(agentId);
  // 2. Check if agent exists
  //    if (!agent) {
  //      return res.status(404).json({ msg: 'Agent not found' });
  //    }
  // 3. Verify ownership
  //    if (agent.developerId.toString() !== developerId) {
  //      return res.status(403).json({ msg: 'User not authorized to delete this agent' });
  //    }
  // 4. Delete the agent
  //    await Agent.findByIdAndDelete(agentId);
  // --- End Database Logic Placeholder ---

  res.json({ msg: `Agent ${agentId} deleted successfully (placeholder)` });
});

module.exports = router;
