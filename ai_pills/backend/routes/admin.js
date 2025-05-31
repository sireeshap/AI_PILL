// backend/routes/admin.js
const express = require('express');
const router = express.Router();

// --- Placeholder Admin Authentication Middleware ---
const isAdmin = (req, res, next) => {
  // In a real app, you'd check req.user.role or similar after a general
  // authentication middleware (like 'protect' used in agentRoutes) has run.
  // For this placeholder, we assume if a user object exists and has role 'admin',
  // or we can just simulate it for now if no preceding auth middleware is assumed for admin routes.
  console.log(
    'isAdmin middleware: Checking admin status (currently mocked as true for all).'
  );

  // Example of how it might look if a general 'protect' middleware ran first:
  // if (req.user && req.user.role === 'admin') {
  //   next();
  // } else {
  //   return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
  // }

  // For this standalone placeholder, we'll just call next()
  // You might want to add a mock user for context if needed by subsequent handlers.
  // req.user = { id: 'mockAdminUserId', username: 'admin_user', role: 'admin' };
  next();
};

// Apply isAdmin middleware to all routes in this router
router.use(isAdmin);

// --- User Management Routes ---
const userRouter = express.Router(); // Using a sub-router for /users prefix

// GET /api/admin/users
userRouter.get('/', (req, res) => {
  console.log('Admin: Get all users requested.');
  // Placeholder: Simulate fetching all users
  const mockUsers = [
    {
      id: 'user001',
      username: 'dev1',
      email: 'dev1@example.com',
      status: 'active',
    },
    {
      id: 'user002',
      username: 'userX',
      email: 'userX@example.com',
      status: 'pending',
    },
    {
      id: 'user003',
      username: 'anotherdev',
      email: 'anotherdev@example.com',
      status: 'suspended',
    },
  ];
  res.json({
    msg: 'Admin: Successfully fetched all users (mocked)',
    users: mockUsers,
  });
});

// GET /api/admin/users/:userId
userRouter.get('/:userId', (req, res) => {
  const { userId } = req.params;
  console.log(`Admin: Get user by ID requested. UserID: ${userId}`);
  // Placeholder: Simulate fetching a user by ID
  const mockUser = {
    id: userId,
    username: `user_${userId}`,
    email: `${userId}@example.com`,
    status: 'active',
    role: 'developer', // or 'user'
    createdAt: new Date().toISOString(),
  };
  res.json({
    msg: `Admin: Successfully fetched user ${userId} (mocked)`,
    user: mockUser,
  });
});

// PUT /api/admin/users/:userId/status
userRouter.put('/:userId/status', (req, res) => {
  const { userId } = req.params;
  const { status } = req.body; // e.g., { status: 'active' } or { status: 'suspended' }
  console.log(
    `Admin: Update user status requested. UserID: ${userId}, New Status: ${status}`
  );
  console.log('Request body:', req.body);
  if (!status) {
    return res
      .status(400)
      .json({ msg: 'Status is required in the request body.' });
  }
  // Placeholder: Simulate updating user status in DB
  res.json({
    msg: `Admin: User ${userId} status updated to ${status} (mocked)`,
  });
});

// DELETE /api/admin/users/:userId
userRouter.delete('/:userId', (req, res) => {
  const { userId } = req.params;
  console.log(`Admin: Delete user requested. UserID: ${userId}`);
  // Placeholder: Simulate deleting a user from DB
  res.json({ msg: `Admin: User ${userId} deleted successfully (mocked)` });
});

router.use('/users', userRouter); // Mount user management routes under /api/admin/users

// --- Agent Management Routes ---
const agentRouter = express.Router(); // Using a sub-router for /agents prefix

// GET /api/admin/agents
agentRouter.get('/', (req, res) => {
  console.log('Admin: Get all agents requested.');
  // Placeholder: Simulate fetching all agents
  const mockAgents = [
    {
      id: 'agent001',
      name: 'Public Agent Alpha',
      developerId: 'user001',
      status: 'approved',
    },
    {
      id: 'agent002',
      name: 'Pending Agent Beta',
      developerId: 'user002',
      status: 'pending_approval',
    },
    {
      id: 'agent003',
      name: 'Rejected Agent Gamma',
      developerId: 'user003',
      status: 'rejected',
    },
  ];
  res.json({
    msg: 'Admin: Successfully fetched all agents (mocked)',
    agents: mockAgents,
  });
});

// GET /api/admin/agents/:agentId
agentRouter.get('/:agentId', (req, res) => {
  const { agentId } = req.params;
  console.log(`Admin: Get agent by ID requested. AgentID: ${agentId}`);
  // Placeholder: Simulate fetching an agent by ID
  const mockAgent = {
    id: agentId,
    name: `Agent ${agentId}`,
    developerId: `dev_${agentId}`,
    status: 'approved',
    description: 'Detailed agent description from admin view.',
    uploadDate: new Date().toISOString(),
  };
  res.json({
    msg: `Admin: Successfully fetched agent ${agentId} (mocked)`,
    agent: mockAgent,
  });
});

// PUT /api/admin/agents/:agentId/status
agentRouter.put('/:agentId/status', (req, res) => {
  const { agentId } = req.params;
  const { status } = req.body; // e.g., { status: 'approved' }, { status: 'rejected' }
  console.log(
    `Admin: Update agent status requested. AgentID: ${agentId}, New Status: ${status}`
  );
  console.log('Request body:', req.body);
  if (!status) {
    return res
      .status(400)
      .json({ msg: 'Status is required in the request body.' });
  }
  // Placeholder: Simulate updating agent status in DB
  res.json({
    msg: `Admin: Agent ${agentId} status updated to ${status} (mocked)`,
  });
});

// DELETE /api/admin/agents/:agentId
agentRouter.delete('/:agentId', (req, res) => {
  const { agentId } = req.params;
  console.log(`Admin: Delete agent requested. AgentID: ${agentId}`);
  // Placeholder: Simulate deleting an agent from DB
  res.json({ msg: `Admin: Agent ${agentId} deleted successfully (mocked)` });
});

router.use('/agents', agentRouter); // Mount agent management routes under /api/admin/agents

module.exports = router;
