const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// Import auth router
const authRoutes = require('./routes/auth');
// Import agent router
const agentRoutes = require('./routes/agents');
// Import admin router
const adminRoutes = require('./routes/admin');

// Middleware to parse JSON request bodies
app.use(express.json());

// Define a simple root route (optional, can be removed if not needed)
app.get('/', (req, res) => {
  res.send('Hello from the backend API!');
});

// Mount the auth router
app.use('/api/auth', authRoutes);
// Mount the agent router
app.use('/api/agents', agentRoutes);
// Mount the admin router
app.use('/api/admin', adminRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
