import React, { useState } from 'react';
import AdminUserList from './AdminUserList';
import AdminAgentList from './AdminAgentList';

const adminPageStyle = {
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
};

const navStyle = {
  marginBottom: '20px',
  paddingBottom: '10px',
  borderBottom: '1px solid #ccc',
};

const buttonStyle = {
  padding: '10px 15px',
  marginRight: '10px',
  cursor: 'pointer',
  border: '1px solid transparent',
  borderRadius: '4px',
  backgroundColor: '#f0f0f0',
};

const activeButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#007bff',
  color: 'white',
  border: '1px solid #007bff',
};

function AdminPage() {
  const [currentView, setCurrentView] = useState('users'); // 'users' or 'agents'

  return (
    <div style={adminPageStyle}>
      <h2>Admin Panel</h2>
      <p>
        This area is restricted and should only be accessible by authorized
        administrators.
      </p>

      <nav style={navStyle}>
        <button
          onClick={() => setCurrentView('users')}
          style={currentView === 'users' ? activeButtonStyle : buttonStyle}
        >
          Manage Users
        </button>
        <button
          onClick={() => setCurrentView('agents')}
          style={currentView === 'agents' ? activeButtonStyle : buttonStyle}
        >
          Manage Agents
        </button>
      </nav>

      {currentView === 'users' && <AdminUserList />}
      {currentView === 'agents' && <AdminAgentList />}
    </div>
  );
}

export default AdminPage;
