// In ai_pills/frontend/client_nextjs/src/components/dashboard/AgentListItem.tsx
import React from 'react';
import { ListItem, ListItemText, IconButton, Typography, Paper, Box, Chip } from '@mui/material'; // Added Chip
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Link from 'next/link';

// This interface should match the structure of agents fetched in DashboardPage
// which comes from FastAPI's AgentPublic model.
export interface Agent {
  id: string | number; // FastAPI might return int, ensure consistency. Using string for broader compatibility.
  name: string;
  version: string;
  status: string; // e.g., 'pending_review', 'approved', 'rejected'
  description?: string;
  developer_username?: string; // From FastAPI AgentPublic
  upload_date?: string;      // From FastAPI AgentPublic (ISO string)
  tags?: string[];             // From FastAPI AgentPublic
  github_link?: string;      // From FastAPI AgentPublic
}

interface AgentListItemProps {
  agent: Agent;
  onEdit: (id: string | number) => void;
  onDelete: (id: string | number) => void;
}

const AgentListItem: React.FC<AgentListItemProps> = ({ agent, onEdit, onDelete }) => {

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending_review': return 'warning';
      case 'suspended': return 'default';
      default: return 'info';
    }
  };

  return (
    <Paper elevation={2} sx={{ mb: 2, p: 1.5 }}>
      <ListItem
        disableGutters
        secondaryAction={
          <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', height: '100%'}}>
            <IconButton edge="end" aria-label="edit" onClick={() => onEdit(agent.id)} sx={{ mb: 0.5 }} title="Edit Agent">
              <EditIcon fontSize="small"/>
            </IconButton>
            <IconButton edge="end" aria-label="delete" onClick={() => onDelete(agent.id)} title="Delete Agent">
              <DeleteIcon fontSize="small"/>
            </IconButton>
          </Box>
        }
      >
        <ListItemText
          primary={
            <Link href={`/agents/${agent.id}`} passHref> {/* Public agent detail page */}
              <Typography component="span" variant="h6" color="primary" sx={{ cursor: 'pointer', textDecoration: 'none', '&:hover': { textDecoration: 'underline'} }}>
                {agent.name}
              </Typography>
            </Link>
          }
          secondary={
            <>
              <Typography component="div" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Developer: {agent.developer_username || 'N/A'} | Version: {agent.version}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5}}>
                <Typography component="span" variant="body2" color="text.secondary" sx={{mr: 0.5}}>Status:</Typography>
                <Chip
                    label={agent.status.replace('_', ' ')}
                    color={getStatusChipColor(agent.status)}
                    size="small"
                />
              </Box>
              {agent.upload_date && (
                <Typography component="div" variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                  Uploaded: {new Date(agent.upload_date).toLocaleDateString()}
                </Typography>
              )}
              {agent.description && (
                <Typography component="div" variant="body2" color="text.secondary" sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2, // Show approx 2 lines
                    WebkitBoxOrient: 'vertical',
                    mb: 1
                }}>
                  {agent.description}
                </Typography>
              )}
              {agent.tags && agent.tags.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {agent.tags.slice(0, 3).map(tag => <Chip key={tag} label={tag} size="small" variant="outlined" />)}
                  {agent.tags.length > 3 && <Chip label={`+${agent.tags.length - 3}`} size="small" />}
                </Box>
              )}
            </>
          }
        />
      </ListItem>
    </Paper>
  );
};

export default AgentListItem;
