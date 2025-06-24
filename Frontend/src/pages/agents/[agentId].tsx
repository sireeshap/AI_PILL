// In ai_pills/frontend/client_nextjs/src/pages/agents/[agentId].tsx
import React from 'react';
import { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import {
    Container, Typography, Box, Paper, Chip, Button as MuiButton,
    Divider, Grid, CircularProgress, Alert, Breadcrumbs
} from '@mui/material';
import Link from 'next/link';
import { PublicAgent } from '../../components/agents/AgentCard'; // Uses updated interface
import { API_BASE_URL } from '../../services/api';
import HomeIcon from '@mui/icons-material/Home';
import AppsIcon from '@mui/icons-material/Apps';
import Head from 'next/head';


interface AgentDetailPageProps {
  agent?: PublicAgent; // agent is optional if error or notFound
  error?: string;
}

const AgentDetailPage: NextPage<AgentDetailPageProps> = ({ agent, error }) => {
  const router = useRouter();

  if (router.isFallback) {
    return (
        <Container sx={{ py: 8, textAlign: 'center' }}>
            <Head><title>Loading Agent...</title></Head>
            <CircularProgress size={60} />
            <Typography sx={{mt:2}}>Loading agent details...</Typography>
        </Container>
    );
  }
  if (error) {
    return (
        <Container sx={{ py: 8 }}>
             <Head><title>Error - AI Pills</title></Head>
            <Alert severity="error" sx={{justifyContent: 'center'}}>Error: {error}</Alert>
        </Container>
    );
  }
  // This case should be handled by `notFound: true` in getStaticProps, but as a safeguard:
  if (!agent) {
    return (
        <Container sx={{ py: 8 }}>
            <Head><title>Agent Not Found - AI Pills</title></Head>
            <Alert severity="warning" sx={{justifyContent: 'center'}}>
                Agent not found. It might have been removed or the ID is incorrect.
                <Link href="/" passHref><MuiButton sx={{ml:2}} variant='outlined' size='small'>Go Home</MuiButton></Link>
            </Alert>
        </Container>
    );
  }

  return (
    <>
    <Head>
        <title>{agent.name} - AI Agent Details</title>
        <meta name="description" content={agent.description.substring(0,160)} />
    </Head>
    <Container maxWidth="lg" sx={{ py: 4 }}> {/* Changed to lg for more space */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link href="/" passHref>
          <MuiButton component="span" sx={{ display: 'flex', alignItems: 'center', textTransform: 'none', color: 'inherit' }}><HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" /> Home</MuiButton>
        </Link>
        <Typography color="text.primary">{agent.name}</Typography>
      </Breadcrumbs>

      <Paper elevation={3} sx={{ p: {xs: 2, sm: 3, md: 4} }}>
        <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
                <Typography variant="h3" component="h1" gutterBottom sx={{fontWeight: 'bold'}}>
                {agent.name}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  By: {agent.developer_username} | Version: {agent.version}
                </Typography>
                 {agent.status && agent.status !== 'approved' && ( // Show status if not standard 'approved'
                    <Chip label={`Status: ${agent.status.replace('_', ' ')}`} color="warning" size="small" sx={{mb:1}}/>
                 )}

                <Box sx={{ my: 2 }}>
                {agent.tags && agent.tags.map((tag) => (
                    <Chip key={tag} label={tag} sx={{ mr: 0.5, mb: 0.5 }} variant="outlined" />
                ))}
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h5" gutterBottom>Description</Typography>
                <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line', lineHeight: 1.7 }}>
                  {agent.description}
                </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
                <Paper variant="outlined" sx={{p:2, position: 'sticky', top: '20px' /* For sticky effect if page scrolls */}}>
                    <Typography variant="h6" gutterBottom>Agent Details</Typography>
                    <Typography variant="body2" sx={{mb:0.5}}><strong>ID:</strong> {String(agent.id)}</Typography>
                    <Typography variant="body2" sx={{mb:0.5}}><strong>Version:</strong> {agent.version}</Typography>
                    <Typography variant="body2" sx={{mb:0.5}}><strong>Developer:</strong> {agent.developer_username}</Typography>
                    {agent.upload_date && <Typography variant="body2" sx={{mb:0.5}}><strong>Uploaded:</strong> {new Date(agent.upload_date).toLocaleDateString()}</Typography>}
                    {agent.github_link && (
                        <Typography variant="body2" sx={{mb:0.5}}>
                            <strong>GitHub:</strong> <Link href={agent.github_link} passHref><a target="_blank" rel="noopener noreferrer">View Repository</a></Link>
                        </Typography>
                    )}
                    <Box sx={{ my: 3, textAlign: 'center' }}>
                        <MuiButton
                            variant="contained"
                            size="large"
                            color="primary"
                            onClick={() => alert(`(Placeholder) Downloading agent: ${agent.name}`)}
                        >
                            Download Agent
                        </MuiButton>
                        <Typography variant="caption" display="block" sx={{ mt: 1, mb: 1 }}>
                            (Conceptual - actual download would be implemented here)
                        </Typography>
                    </Box>
                </Paper>
            </Grid>
        </Grid>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Link href="/" passHref>
            <MuiButton variant="text">Back to All Agents</MuiButton>
          </Link>
        </Box>
      </Paper>
    </Container>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/public/agents/ids/all`);
    if (!res.ok) {
        let errorDetail = `Failed to fetch agent IDs. Status: ${res.status}`;
        try { const errorData = await res.json(); errorDetail = errorData.detail || errorDetail; } catch(e){}
        console.error("Failed to fetch agent IDs for getStaticPaths:", errorDetail);
        return { paths: [], fallback: 'blocking' };
    }
    const agentIds: number[] = await res.json(); // FastAPI returns List[int]

    const paths = agentIds.map((id) => ({
      params: { agentId: String(id) },
    }));

    return { paths, fallback: 'blocking' };
  } catch (error) {
    console.error("Error in getStaticPaths for AgentDetailPage:", error);
    return { paths: [], fallback: 'blocking' };
  }
};

export const getStaticProps: GetStaticProps<AgentDetailPageProps, { agentId: string }> = async (context) => {
  const { params } = context;
  const agentId = params?.agentId;

  if (!agentId) {
    return { notFound: true };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/public/agents/${agentId}`);

    if (!res.ok) {
      if (res.status === 404 || res.status === 403) {
        return { notFound: true };
      }
      let errorDetail = `Failed to fetch agent ${agentId}. Status: ${res.status}`;
      try { const errorData = await res.json(); errorDetail = errorData.detail || errorDetail; } catch(e){}
      throw new Error(errorDetail);
    }
    const agentData: PublicAgent = await res.json();

    return {
      props: {
        agent: agentData,
      },
      revalidate: 300,
    };
  } catch (error: any) {
     console.error(`Error in getStaticProps for agent ${agentId}:`, error);
     return {
        props: {
            agent: undefined,
            error: error.message || `Failed to load agent data for ID ${agentId}.`
        }
    };
  }
};

export default AgentDetailPage;
