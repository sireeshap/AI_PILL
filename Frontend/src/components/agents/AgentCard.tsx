// In ai_pills/frontend/client_nextjs/src/components/agents/AgentCard.tsx
import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Chip, Box } from '@mui/material';
import Link from 'next/link';

export interface PublicAgent {
  id: string | number; // Allow number if FastAPI returns int ID
  name: string;
  description: string;
  version: string;
  tags: string[];
  developer_username: string; // Changed from developerUsername to match FastAPI
  // Optional fields that might come from AgentPublic
  upload_date?: string;
  status?: string;
  github_link?: string;
}

interface AgentCardProps {
  agent: PublicAgent;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2" color="primary.main">
          <Link href={`/agents/${agent.id}`} passHref>
            <Typography component="span" sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { textDecoration: 'underline' }, cursor:'pointer' }}>
              {agent.name}
            </Typography>
          </Link>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          By: {agent.developer_username} | Version: {agent.version}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph sx={{ minHeight: '60px' }}>
          {agent.description.substring(0, 120)}{agent.description.length > 120 ? '...' : ''}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1, minHeight: '32px' }}>
          {agent.tags && agent.tags.slice(0, 3).map((tag) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
          {agent.tags && agent.tags.length > 3 && <Chip label={`+${agent.tags.length - 3}`} size="small" variant="outlined" />}
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-start', pl:2, pb:2 }}>
        <Link href={`/agents/${agent.id}`} passHref>
          <Button component="span" size="small" variant="contained">View Details</Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default AgentCard;
