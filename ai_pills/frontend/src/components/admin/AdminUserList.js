import React, { useState, useEffect } from 'react';

const mockUsersData = [
  {
    id: 'u1',
    username: 'john_doe',
    email: 'john.doe@example.com',
    status: 'active',
    role: 'user',
    joinedDate: '2023-01-15',
  },
  {
    id: 'u2',
    username: 'jane_dev',
    email: 'jane.dev@example.com',
    status: 'active',
    role: 'developer',
    joinedDate: '2023-02-20',
  },
  {
    id: 'u3',
    username: 'pending_user',
    email: 'pending@example.com',
    status: 'pending_verification',
    role: 'user',
    joinedDate: '2024-03-01',
  },
  {
    id: 'u4',
    username: 'banned_user',
    email: 'banned@example.com',
    status: 'suspended',
    role: 'user',
    joinedDate: '2023-05-10',
  },
];

function AdminUserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Simulate API call
    console.log('Admin: Fetching users (simulated)...');
    setUsers(mockUsersData);
    // In a real app: fetch('/api/admin/users').then(res => res.json()).then(data => setUsers(data.users));
  }, []);

  const handleViewDetails = (userId) => {
    console.log(`Admin: View details for user ID: ${userId}`);
    // In a real app, this might open a modal or navigate to a user detail page
  };

  const handleChangeStatus = (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    console.log(
      `Admin: Change status for user ID: ${userId} from ${currentStatus} to ${newStatus} (simulated)`
    );
    // In a real app: fetch(`/api/admin/users/${userId}/status`, { method: 'PUT', body: JSON.stringify({ status: newStatus }), headers: {'Content-Type': 'application/json'} })
    // Then refresh list or update state
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };

  const handleDeleteUser = (userId) => {
    console.log(`Admin: Delete user ID: ${userId} (simulated)`);
    // In a real app: fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
    // Then refresh list or update state
    setUsers(users.filter((user) => user.id !== userId));
  };

  return (
    <div>
      <h3>Manage Users</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>ID</th>
            <th style={tableHeaderStyle}>Username</th>
            <th style={tableHeaderStyle}>Email</th>
            <th style={tableHeaderStyle}>Role</th>
            <th style={tableHeaderStyle}>Status</th>
            <th style={tableHeaderStyle}>Joined</th>
            <th style={tableHeaderStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={tableCellStyle}>{user.id}</td>
              <td style={tableCellStyle}>{user.username}</td>
              <td style={tableCellStyle}>{user.email}</td>
              <td style={tableCellStyle}>{user.role}</td>
              <td style={tableCellStyle}>{user.status}</td>
              <td style={tableCellStyle}>{user.joinedDate}</td>
              <td style={tableCellStyle}>
                <button
                  onClick={() => handleViewDetails(user.id)}
                  style={buttonStyle}
                >
                  View
                </button>
                <button
                  onClick={() => handleChangeStatus(user.id, user.status)}
                  style={buttonStyle}
                >
                  {user.status === 'active' ? 'Suspend' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
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

export default AdminUserList;
