import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom'; // If needed for navigation within dashboard

import AgentListItem from './AgentListItem';
import AgentUploadForm from './AgentUploadForm';

// Mock data for agents - in a real app, this would come from an API call
const mockAgentsData = [
  {
    id: 'agent001',
    name: 'My First Agent',
    version: '1.0.0',
    description: 'This is a test agent.',
  },
  {
    id: 'agent002',
    name: 'Cool AI Tool',
    version: '0.9.1',
    description: 'A very cool tool indeed.',
  },
  {
    id: 'agent003',
    name: 'Data Analyzer Bot',
    version: '1.2.0',
    description: 'Analyzes data efficiently.',
  },
];

function DashboardPage() {
  const [agents, setAgents] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Simulate fetching agents on component mount
  useEffect(() => {
    console.log('Fetching agents for dashboard (simulated)...');
    // Replace with actual API call:
    // agentService.getMyAgents().then(data => setAgents(data)).catch(err => console.error(err));
    setAgents(mockAgentsData);
  }, []);

  return (
    <div>
      <h2>Developer Dashboard</h2>
      <p>Welcome to your agent management console.</p>
      {/*
        In a real app, this page should be protected and only accessible
        to logged-in developers.
      */}

      <button
        onClick={() => setShowUploadForm(!showUploadForm)}
        style={{ marginBlock: '10px' }}
      >
        {showUploadForm ? 'Hide Upload Form' : 'Upload New Agent'}
      </button>

      {showUploadForm && <AgentUploadForm />}

      <hr style={{ marginBlock: '20px' }} />

      <h3>My Agents</h3>
      {agents.length > 0 ? (
        <div>
          {agents.map((agent) => (
            <AgentListItem key={agent.id} agent={agent} />
          ))}
        </div>
      ) : (
        <p>You haven't uploaded any agents yet.</p>
      )}

      {/* Example of a link to another part of the dashboard if needed
      <p style={{marginTop: "20px"}}>
        <Link to="/dashboard/settings">Dashboard Settings</Link>
      </p>
      */}
    </div>
  );
}

export default DashboardPage;
