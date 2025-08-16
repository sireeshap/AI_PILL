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
  description?: string;
  visibility: string; // 'public' or 'private' - updated to match new API schema
  tags?: string[];
  agent_type: string; // Type of the AI agent
  file_refs?: string[];
  is_active?: boolean;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  // Legacy fields for backward compatibility
  version?: string;
  developer_username?: string; // From FastAPI AgentPublic
  upload_date?: string;      // From FastAPI AgentPublic (ISO string)
  github_link?: string;      // From FastAPI AgentPublic
  status?: string; // Legacy field - map to visibility for compatibility
}

interface AgentListItemProps {
  agent: Agent;
  onEdit: (id: string | number) => void;
  onDelete: (id: string | number) => void;
}

const AgentListItem: React.FC<AgentListItemProps> = ({ agent, onEdit, onDelete }) => {

  const getStatusChipColor = (visibility: string) => {
    switch (visibility) {
      case 'public': return 'success';
      case 'private': return 'default';
      default: return 'info';
    }
  };

  const getStatusLabel = (agent: Agent) => {
    // Handle both new visibility field and legacy status field
    const displayValue = agent.visibility || agent.status || 'private';
    return displayValue.replace('_', ' ');
  };

  return (
    <Paper elevation={2} sx={{ mb: 2, p: 1.5, position: 'relative' }}>
      {/* Action buttons positioned in top right corner */}
      <Box sx={{ 
        position: 'absolute', 
        top: 8, 
        right: 8, 
        display: 'flex', 
        gap: 0.5,
        zIndex: 1,
        margin: '5px' 
      }}>
        <IconButton 
          aria-label="edit" 
          onClick={() => onEdit(agent.id)} 
          title="Edit Agent"
          size="small"
          sx={{ 
            color: '#1976d2', // Blue color for edit
            backgroundColor: 'rgba(25, 118, 210, 0.1)',
            '&:hover': { 
              backgroundColor: 'rgba(25, 118, 210, 0.2)',
              color: '#1565c0' 
            },
            padding: '4px',
            margin: '5px'
          }}
        >
          <EditIcon fontSize="small"/>
        </IconButton>
        <IconButton 
          aria-label="delete" 
          onClick={() => onDelete(agent.id)} 
          title="Delete Agent"
          size="small"
          sx={{ 
            color: '#d32f2f', // Red color for delete
            backgroundColor: 'rgba(211, 47, 47, 0.1)',
            '&:hover': { 
              backgroundColor: 'rgba(211, 47, 47, 0.2)',
              color: '#c62828' 
            },
            padding: '4px',
            margin: '5px'
          }}
        >
          <DeleteIcon fontSize="small"/>
        </IconButton>
      </Box>
      
      <ListItem
        disableGutters
      >
        <ListItemText
          sx={{ pr: 6 }} // Add right padding to avoid overlap with action buttons
          primary={
            <Link href={`/agents/${agent.id}`} passHref> {/* Public agent detail page */}
              <Typography component="span" variant="h6" color="primary" sx={{ cursor: 'pointer', textDecoration: 'none', '&:hover': { textDecoration: 'underline'} }}>
                {agent.name}
              </Typography>
            </Link>
          }
          secondary={
            <Box component="div">
              <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                Developer: {agent.developer_username || 'Unknown'} 
                {agent.version && ` | Version: ${agent.version}`}
                {agent.agent_type && ` | Type: ${agent.agent_type}`}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5}}>
                <Typography component="span" variant="body2" color="text.secondary" sx={{mr: 0.5}}>Status:</Typography>
                <Chip
                    label={getStatusLabel(agent)}
                    color={getStatusChipColor(agent.visibility || agent.status || 'private')}
                    size="small"
                />
              </Box>
              {agent.upload_date && (
                <Typography component="span" variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Uploaded: {new Date(agent.upload_date).toLocaleDateString()}
                </Typography>
              )}
              {agent.description && (
                <Typography component="span" variant="body2" color="text.secondary" sx={{
                    display: '-webkit-box',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
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
            </Box>
          }
        />
      </ListItem>
    </Paper>
  );
};

export default AgentListItem;
