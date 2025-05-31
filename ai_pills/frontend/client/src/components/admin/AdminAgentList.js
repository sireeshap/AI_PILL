import React, { useState, useEffect } from 'react';

const mockAgentsData = [
  {
    id: 'a1',
    name: 'Agent Alpha',
    developerUsername: 'jane_dev',
    developerId: 'u2',
    status: 'pending_review',
    version: '1.0',
    uploadedAt: '2024-02-15',
  },
  {
    id: 'a2',
    name: 'Agent Beta',
    developerUsername: 'john_doe',
    developerId: 'u1',
    status: 'approved',
    version: '1.2',
    uploadedAt: '2024-01-20',
  },
  {
    id: 'a3',
    name: 'Agent Gamma',
    developerUsername: 'jane_dev',
    developerId: 'u2',
    status: 'rejected',
    version: '0.9',
    uploadedAt: '2024-02-01',
  },
  {
    id: 'a4',
    name: 'Agent Delta',
    developerUsername: 'new_dev',
    developerId: 'u5',
    status: 'pending_review',
    version: '1.0',
    uploadedAt: '2024-03-05',
  },
];

function AdminAgentList() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    // Simulate API call
    console.log('Admin: Fetching agents (simulated)...');
    setAgents(mockAgentsData);
    // In a real app: fetch('/api/admin/agents').then(res => res.json()).then(data => setAgents(data.agents));
  }, []);

  const handleViewDetails = (agentId) => {
    console.log(`Admin: View details for agent ID: ${agentId}`);
    // In a real app, this might navigate to an agent detail page or open a modal
  };

  const handleApprove = (agentId) => {
    console.log(`Admin: Approve agent ID: ${agentId} (simulated)`);
    // In a real app: fetch(`/api/admin/agents/${agentId}/status`, { method: 'PUT', body: JSON.stringify({ status: 'approved' }), headers: {'Content-Type': 'application/json'} })
    setAgents(
      agents.map((agent) =>
        agent.id === agentId ? { ...agent, status: 'approved' } : agent
      )
    );
  };

  const handleReject = (agentId) => {
    console.log(`Admin: Reject agent ID: ${agentId} (simulated)`);
    // In a real app: fetch(`/api/admin/agents/${agentId}/status`, { method: 'PUT', body: JSON.stringify({ status: 'rejected' }), headers: {'Content-Type': 'application/json'} })
    setAgents(
      agents.map((agent) =>
        agent.id === agentId ? { ...agent, status: 'rejected' } : agent
      )
    );
  };

  const handleDelete = (agentId) => {
    console.log(`Admin: Delete agent ID: ${agentId} (simulated)`);
    // In a real app: fetch(`/api/admin/agents/${agentId}`, { method: 'DELETE' })
    setAgents(agents.filter((agent) => agent.id !== agentId));
  };

  return (
    <div>
      <h3>Manage AI Agents</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>ID</th>
            <th style={tableHeaderStyle}>Name</th>
            <th style={tableHeaderStyle}>Developer</th>
            <th style={tableHeaderStyle}>Version</th>
            <th style={tableHeaderStyle}>Status</th>
            <th style={tableHeaderStyle}>Uploaded At</th>
            <th style={tableHeaderStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent.id}>
              <td style={tableCellStyle}>{agent.id}</td>
              <td style={tableCellStyle}>{agent.name}</td>
              <td style={tableCellStyle}>
                {agent.developerUsername} (ID: {agent.developerId})
              </td>
              <td style={tableCellStyle}>{agent.version}</td>
              <td style={tableCellStyle}>{agent.status}</td>
              <td style={tableCellStyle}>{agent.uploadedAt}</td>
              <td style={tableCellStyle}>
                <button
                  onClick={() => handleViewDetails(agent.id)}
                  style={buttonStyle}
                >
                  View
                </button>
                {agent.status === 'pending_review' && (
                  <>
                    <button
                      onClick={() => handleApprove(agent.id)}
                      style={{ ...buttonStyle, backgroundColor: '#28a745' }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(agent.id)}
                      style={{ ...buttonStyle, backgroundColor: '#ffc107' }}
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(agent.id)}
                  style={{ ...buttonStyle, backgroundColor: '#dc3545' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const tableHeaderStyle = {
  borderBottom: '2px solid #dee2e6',
  padding: '8px',
  textAlign: 'left',
  backgroundColor: '#f8f9fa',
};

const tableCellStyle = {
  borderBottom: '1px solid #e9ecef',
  padding: '8px',
};

const buttonStyle = {
  margin: '0 5px',
  padding: '5px 10px',
  fontSize: '0.9em',
  cursor: 'pointer',
  border: '1px solid #ccc',
  borderRadius: '4px',
};

export default AdminAgentList;
