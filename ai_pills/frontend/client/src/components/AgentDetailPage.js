import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Extended mock data for agent details
const mockAgentDetailsData = [
  {
    id: 'agentA001',
    name: 'Demo Agent Alpha',
    fullDescription:
      'This is a fantastic demo agent designed to showcase the capabilities of our platform. It can perform a variety of tasks with high efficiency. Built with Python and leveraging advanced machine learning models, Alpha is perfect for automating complex workflows. It includes features like natural language understanding and image recognition. The agent is well-documented and comes with several examples to get you started.',
    version: '1.2.1',
    tags: ['demo', 'tool', 'alpha', 'python', 'machine learning'],
    developerName: 'AI Dev Co.',
    uploadDate: '2023-10-15',
    githubLink: 'https://github.com/example/demo-agent-alpha',
  },
  {
    id: 'agentB002',
    name: 'AI Helper Bot',
    fullDescription:
      'Your friendly neighborhood AI Helper Bot, ready to assist with all your AI-related queries and tasks. It learns and adapts using a state-of-the-art neural network. Ideal for customer support, information retrieval, and interactive Q&A sessions. It integrates with popular messaging platforms.',
    version: '2.0.0',
    tags: ['helper', 'ai', 'chatbot', 'support', 'neural network'],
    developerName: 'BotBuilders Inc.',
    uploadDate: '2023-11-01',
    // No GitHub link for this one
  },
  {
    id: 'agentC003',
    name: 'Data Visualizer',
    fullDescription:
      'Turns complex datasets into beautiful and understandable visualizations. Supports various chart types (bar, line, pie, scatter) and data sources (CSV, JSON, SQL databases). Features an interactive dashboard and customizable reporting options. Built with D3.js and React for a responsive user experience.',
    version: '1.5.0',
    tags: ['data', 'visualization', 'analytics', 'd3js', 'react'],
    developerName: 'DataViz Experts',
    uploadDate: '2023-09-20',
    githubLink: 'https://github.com/example/data-visualizer',
  },
  {
    id: 'agentD004',
    name: 'Code Generator X',
    fullDescription:
      'Generates boilerplate code for multiple programming languages including Python, JavaScript, Java, and C#. Speeds up development significantly. Now with improved AI suggestions based on project context and coding patterns. Includes a plugin for VS Code.',
    version: '3.1.0',
    tags: ['code', 'developer tool', 'automation', 'productivity', 'vscode'],
    developerName: 'DevTools LLC',
    uploadDate: '2024-01-10',
    // No GitHub link
  },
];

function AgentDetailPage() {
  const { agentId } = useParams();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(`Fetching details for agent ID: ${agentId} (simulated)...`);
    // Simulate API call delay
    setTimeout(() => {
      const foundAgent = mockAgentDetailsData.find((a) => a.id === agentId);
      setAgent(foundAgent);
      setLoading(false);
    }, 500);
  }, [agentId]);

  const handleDownload = () => {
    console.log(
      `Download button clicked for agent: ${agent.name} (ID: ${agent.id})`
    );
    alert(`Simulating download for ${agent.name}...`);
    // In a real app, this would initiate a file download or redirect to a download link.
  };

  if (loading) {
    return <p>Loading agent details...</p>;
  }

  if (!agent) {
    return (
      <div>
        <h2>Agent Not Found</h2>
        <p>Sorry, we couldn't find an agent with the ID: {agentId}</p>
        <Link to="/">Go back to Home Page</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <Link to="/" style={{ marginBottom: '20px', display: 'inline-block' }}>
        &larr; Back to All Agents
      </Link>
      <h1>{agent.name}</h1>
      <p>
        <strong>Version:</strong> {agent.version}
      </p>
      <p>
        <strong>Developer:</strong> {agent.developerName}
      </p>
      <p>
        <strong>Uploaded:</strong>{' '}
        {new Date(agent.uploadDate).toLocaleDateString()}
      </p>

      <div style={{ marginBlock: '20px' }}>
        <strong>Tags:</strong>
        {agent.tags && agent.tags.length > 0 ? (
          <ul
            style={{
              listStyleType: 'none',
              paddingLeft: 0,
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginTop: '5px',
            }}
          >
            {agent.tags.map((tag, index) => (
              <li
                key={index}
                style={{
                  backgroundColor: '#e0e0e0',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  fontSize: '0.9em',
                }}
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : (
          <p>No tags</p>
        )}
      </div>

      <h3>Description</h3>
      <p style={{ whiteSpace: 'pre-line' }}>{agent.fullDescription}</p>

      {agent.githubLink && (
        <div style={{ marginBlock: '20px' }}>
          <strong>GitHub Repository:</strong>{' '}
          <a href={agent.githubLink} target="_blank" rel="noopener noreferrer">
            {agent.githubLink}
          </a>
        </div>
      )}

      <button
        onClick={handleDownload}
        style={{
          padding: '10px 20px',
          fontSize: '1em',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px',
        }}
      >
        Download Agent
      </button>
    </div>
  );
}

export default AgentDetailPage;
