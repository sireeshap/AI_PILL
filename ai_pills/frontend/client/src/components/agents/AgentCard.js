import React from 'react';
import { Link } from 'react-router-dom';

function AgentCard({ agent }) {
  if (!agent) {
    return null;
  }

  // Function to create a short snippet from the description
  const getDescriptionSnippet = (text, maxLength = 100) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div
      style={{
        border: '1px solid #ddd',
        margin: '10px',
        padding: '15px',
        width: '300px',
        borderRadius: '8px',
      }}
    >
      <Link
        to={`/agents/${agent.id}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <h3>{agent.name}</h3>
        <p>{getDescriptionSnippet(agent.description)}</p>
        <div>
          <strong>Tags:</strong>
          {agent.tags && agent.tags.length > 0 ? (
            <ul
              style={{
                listStyleType: 'none',
                paddingLeft: 0,
                display: 'flex',
                flexWrap: 'wrap',
                gap: '5px',
              }}
            >
              {agent.tags.map((tag, index) => (
                <li
                  key={index}
                  style={{
                    backgroundColor: '#f0f0f0',
                    padding: '3px 8px',
                    borderRadius: '4px',
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
      </Link>
    </div>
  );
}

export default AgentCard;
