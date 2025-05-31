import React from 'react';

function AgentListItem({ agent }) {
  const handleEdit = () => {
    console.log(`Edit agent clicked: ${agent.id}`);
    // In a real app, this might navigate to an edit page or open a modal
  };

  const handleDelete = () => {
    console.log(`Delete agent clicked: ${agent.id}`);
    // In a real app, this would trigger a confirmation and then an API call
  };

  if (!agent) {
    return null; // Or some placeholder if agent data is missing
  }

  return (
    <div style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
      <h4>{agent.name}</h4>
      <p>Version: {agent.version}</p>
      <p>ID: {agent.id}</p>
      {/* Add other details as needed, e.g., agent.description, agent.status */}
      <button onClick={handleEdit} style={{ marginRight: '5px' }}>
        Edit
      </button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default AgentListItem;
