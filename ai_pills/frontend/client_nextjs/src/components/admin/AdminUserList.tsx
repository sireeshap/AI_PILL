// In ai_pills/frontend/client_nextjs/src/components/admin/AdminUserList.tsx
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, IconButton, Box, Chip } from '@mui/material'; // Added Chip
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block'; // For Ban
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // For Unban/Activate

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string; // e.g., 'user', 'developer', 'admin'
  status: 'active' | 'banned' | 'pending_review' | 'suspended'; // Added suspended
  joinDate: string; // ISO date string
}

interface AdminUserListProps {
  users: AdminUser[];
  onUpdateStatus: (userId: string, newStatus: AdminUser['status']) => void;
  onDeleteUser: (userId: string) => void;
  // onEditUser: (userId: string) => void; // For viewing/editing details
}

const AdminUserList: React.FC<AdminUserListProps> = ({ users, onUpdateStatus, onDeleteUser }) => {
  if (!users || users.length === 0) {
    return <Typography sx={{p:2, textAlign: 'center'}}>No users found.</Typography>;
  }

  const getStatusChipColor = (status: AdminUser['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'banned': return 'error';
      case 'suspended': return 'warning';
      case 'pending_review': return 'info';
      default: return 'default';
    }
  };

  return (
    <TableContainer component={Paper} elevation={2}>
      <Table sx={{ minWidth: 650 }} aria-label="admin user table">
        <TableHead sx={{backgroundColor: (theme) => theme.palette.grey[100]}}>
          <TableRow>
            <TableCell sx={{fontWeight: 'bold'}}>ID</TableCell>
            <TableCell sx={{fontWeight: 'bold'}}>Username</TableCell>
            <TableCell sx={{fontWeight: 'bold'}}>Email</TableCell>
            <TableCell sx={{fontWeight: 'bold'}}>Role</TableCell>
            <TableCell sx={{fontWeight: 'bold'}}>Status</TableCell>
            <TableCell sx={{fontWeight: 'bold'}}>Joined</TableCell>
            <TableCell sx={{fontWeight: 'bold'}} align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} hover>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Chip
                    label={user.status.replace('_', ' ')}
                    color={getStatusChipColor(user.status)}
                    size="small"
                />
              </TableCell>
              <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
              <TableCell align="center">
                <IconButton
                    size="small"
                    onClick={() => onUpdateStatus(user.id, user.status === 'active' ? 'banned' : 'active')}
                    title={user.status === 'active' ? 'Ban User' : 'Activate User'}
                    color={user.status === 'active' ? 'error' : 'success'}
                >
                  {user.status === 'active' ? <BlockIcon /> : <CheckCircleOutlineIcon />}
                </IconButton>
                {/* <IconButton size="small" onClick={() => console.log('Edit user', user.id)} title="Edit User Details (Placeholder)">
                  <EditIcon />
                </IconButton> */}
                <IconButton size="small" onClick={() => onDeleteUser(user.id)} title="Delete User" sx={{color: 'warning.dark'}}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default AdminUserList;
