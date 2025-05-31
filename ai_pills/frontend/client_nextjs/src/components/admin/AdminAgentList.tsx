// In ai_pills/frontend/client_nextjs/src/components/admin/AdminAgentList.tsx
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, IconButton, Chip, Box } from '@mui/material'; // Added Box
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Approve
import CancelIcon from '@mui/icons-material/Cancel'; // Reject
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Link from 'next/link';

export interface AdminAgent {
  id: string;
  name: string;
  developerUsername: string;
  version: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'suspended'; // Added suspended
  uploadDate: string; // ISO date string
  tags: string[];
}

interface AdminAgentListProps {
  agents: AdminAgent[];
  onUpdateStatus: (agentId: string, newStatus: AdminAgent['status']) => void;
  onDeleteAgent: (agentId: string) => void;
}

const AdminAgentList: React.FC<AdminAgentListProps> = ({ agents, onUpdateStatus, onDeleteAgent }) => {
  if (!agents || agents.length === 0) {
    return <Typography sx={{p:2, textAlign: 'center'}}>No agents found.</Typography>;
  }

  const getStatusChipColor = (status: AdminAgent['status']) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'suspended': return 'default'; // Or another color like grey
      case 'pending_review': return 'warning';
      default: return 'info';
    }
  };


  return (
    <TableContainer component={Paper} elevation={2}>
      <Table sx={{ minWidth: 650 }} aria-label="admin agent table">
        <TableHead sx={{backgroundColor: (theme) => theme.palette.grey[100]}}>
          <TableRow>
            <TableCell sx={{fontWeight: 'bold'}}>ID</TableCell>
            <TableCell sx={{fontWeight: 'bold'}}>Name</TableCell>
            <TableCell sx={{fontWeight: 'bold'}}>Developer</TableCell>
            <TableCell sx={{fontWeight: 'bold'}}>Version</TableCell>
            <TableCell sx={{fontWeight: 'bold'}}>Status</TableCell>
            <TableCell sx={{fontWeight: 'bold'}}>Uploaded</TableCell>
            <TableCell sx={{fontWeight: 'bold'}}>Tags</TableCell>
            <TableCell sx={{fontWeight: 'bold'}} align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {agents.map((agent) => (
            <TableRow key={agent.id} hover>
              <TableCell>{agent.id}</TableCell>
              <TableCell>
                <Link href={`/agents/${agent.id}`} passHref> {/* Assuming public agent detail page */}
                    <Typography component="span" color="primary" sx={{textDecoration: 'none', '&:hover': {textDecoration: 'underline'}, cursor: 'pointer'}}> {/* Changed to span */}
                        {agent.name}
                    </Typography>
                </Link>
              </TableCell>
              <TableCell>{agent.developerUsername}</TableCell>
              <TableCell>{agent.version}</TableCell>
              <TableCell>
                <Chip
                    label={agent.status.replace('_', ' ')}
                    color={getStatusChipColor(agent.status)}
                    size="small"
                />
              </TableCell>
              <TableCell>{new Date(agent.uploadDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {agent.tags.slice(0,2).map(tag => <Chip key={tag} label={tag} size="small" variant="outlined"/>)}
                    {agent.tags.length > 2 && <Chip label={`+${agent.tags.length-2}`} size="small" variant="outlined" />}
                </Box>
              </TableCell>
              <TableCell align="center">
                {agent.status === 'pending_review' && (
                  <>
                    <IconButton size="small" onClick={() => onUpdateStatus(agent.id, 'approved')} title="Approve Agent" color="success">
                      <CheckCircleIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => onUpdateStatus(agent.id, 'rejected')} title="Reject Agent" color="error">
                      <CancelIcon />
                    </IconButton>
                  </>
                )}
                 <Link href={`/agents/${agent.id}`} passHref>
                    <IconButton component="span" size="small" title="View Agent Details"> {/* Changed to span */}
                        <VisibilityIcon />
                    </IconButton>
                </Link>
                <IconButton size="small" onClick={() => onDeleteAgent(agent.id)} title="Delete Agent" sx={{color: 'warning.dark'}}>
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
export default AdminAgentList;
