import React, { useState, useEffect } from 'react';
import AgentCard from './agents/AgentCard'; // Adjust path as necessary

// Mock data for agents - in a real app, this would come from an API call
const mockAgentsList = [
  {
    id: 'agentA001',
    name: 'Demo Agent Alpha',
    description:
      'This is a fantastic demo agent designed to showcase the capabilities of our platform. It can perform a variety of tasks with high efficiency.',
    tags: ['demo', 'tool', 'alpha'],
  },
  {
    id: 'agentB002',
    name: 'AI Helper Bot',
    description:
      'Your friendly neighborhood AI Helper Bot, ready to assist with all your AI-related queries and tasks. It learns and adapts.',
    tags: ['helper', 'ai', 'chatbot'],
  },
  {
    id: 'agentC003',
    name: 'Data Visualizer',
    description:
      'Turns complex datasets into beautiful and understandable visualizations. Supports various chart types and data sources.',
    tags: ['data', 'visualization', 'analytics'],
  },
  {
    id: 'agentD004',
    name: 'Code Generator X',
    description:
      'Generates boilerplate code for multiple programming languages. Speeds up development significantly. Now with improved AI suggestions.',
    tags: ['code', 'developer tool', 'automation'],
  },
];

function HomePage() {
  const [agents, setAgents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Simulate fetching agents on component mount
  useEffect(() => {
    console.log('Fetching agents for Home Page (simulated)...');
    // In a real app: fetch('/api/agents/public').then(res => res.json()).then(data => setAgents(data));
    setAgents(mockAgentsList);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search initiated for:', searchTerm);
    // Basic filtering simulation (client-side for this mock)
    if (!searchTerm.trim()) {
      setAgents(mockAgentsList); // Reset if search is empty
      return;
    }
    const filteredAgents = mockAgentsList.filter(
      (agent) =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setAgents(filteredAgents);
  };

  return (
    <div>
      <header style={{ textAlign: 'center', marginBlock: '20px' }}>
        <h1>Welcome to AI Pills Marketplace</h1>
        <p>Discover, download, and share innovative AI agents.</p>
      </header>

      <section style={{ margin: '20px auto', maxWidth: '600px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for AI agents..."
            style={{
              flexGrow: 1,
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '10px 15px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#007bff',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Search
          </button>
        </form>
      </section>

      <section style={{ marginTop: '30px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
          Featured AI Agents
        </h2>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '15px',
          }}
        >
          {agents.length > 0 ? (
            agents.map((agent) => <AgentCard key={agent.id} agent={agent} />)
          ) : (
            <p style={{ textAlign: 'center' }}>
              {searchTerm
                ? 'No agents found matching your search criteria.'
                : 'No agents available at the moment.'}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
