import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'; // Needed for Link component
import AgentCard from './AgentCard';

// Mock agent data
const mockAgent = {
  id: 'testAgent123',
  name: 'Test Agent',
  description: 'This is a test agent description.',
  tags: ['test', 'agent'],
};

describe('AgentCard Component', () => {
  test('renders agent name', () => {
    render(
      <Router>
        <AgentCard agent={mockAgent} />
      </Router>
    );
    expect(screen.getByText(mockAgent.name)).toBeInTheDocument();
  });

  test('renders agent description snippet', () => {
    render(
      <Router>
        <AgentCard agent={mockAgent} />
      </Router>
    );
    // Assuming the description is rendered directly or a snippet logic exists
    expect(screen.getByText(mockAgent.description)).toBeInTheDocument();
  });

  test('renders agent tags', () => {
    render(
      <Router>
        <AgentCard agent={mockAgent} />
      </Router>
    );
    mockAgent.tags.forEach(tag => {
      expect(screen.getByText(new RegExp(tag, 'i'))).toBeInTheDocument();
    });
  });

  test('card links to the correct agent detail page', () => {
    render(
      <Router>
        <AgentCard agent={mockAgent} />
      </Router>
    );
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('href', `/agents/${mockAgent.id}`);
  });
});
