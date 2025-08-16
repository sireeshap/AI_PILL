// In /Users/purushotham_sireesha@optum.com/Documents/AI_PILL/Frontend/src/pages/dashboard/edit/[agentId].tsx
import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Divider
} from '@mui/material';
import Head from 'next/head';
import Link from 'next/link';
import { fetchClient } from '../../../services/api';
import { Agent } from '../../../components/dashboard/AgentListItem';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EditIcon from '@mui/icons-material/Edit';

const EditAgentPage: NextPage = () => {
  const router = useRouter();
  const { agentId } = router.query;
  
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: 'private',
    agent_type: '',
    tags: [] as string[],
    newTag: ''
  });

  // Fetch agent data
  useEffect(() => {
    if (!agentId) return;
    
    const fetchAgent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const agentData = await fetchClient<Agent>(`/agents/${agentId}`);
        setAgent(agentData);
        
        // Populate form data
        setFormData({
          name: agentData.name || '',
          description: agentData.description || '',
          visibility: agentData.visibility || 'private',
          agent_type: agentData.agent_type || '',
          tags: agentData.tags || [],
          newTag: ''
        });
        
      } catch (err: any) {
        console.error('Failed to fetch agent:', err);
        setError(err.message || 'Failed to load agent data');
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [agentId]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: ''
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ✅ CRITICAL: Prevent default form submission
    
    if (!agentId) return;
    
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);
      
      const updateData = {
        name: formData.name,
        description: formData.description,
        visibility: formData.visibility,
        agent_type: formData.agent_type,
        tags: formData.tags
      };
      
      console.log('Updating agent with data:', updateData);
      
      await fetchClient(`/agents/${agentId}`, {
        method: 'PUT',
        body: updateData
      });
      
      setSuccessMessage('Agent updated successfully!');
      
      // Redirect back to dashboard after a delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } catch (err: any) {
      console.error('Failed to update agent:', err);
      
      // Extract meaningful error message
      let errorMessage = err.message || 'Failed to update agent';
      if (err.message?.includes('401')) {
        errorMessage = 'Session expired. Please log in again.';
      } else if (err.message?.includes('403')) {
        errorMessage = 'You do not have permission to update this agent.';
      } else if (err.message?.includes('404')) {
        errorMessage = 'Agent not found. It may have been deleted.';
      } else if (err.message?.includes('500')) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading Agent... - AI Pills</title>
        </Head>
        <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography sx={{ mt: 2 }}>Loading agent details...</Typography>
        </Container>
      </>
    );
  }

  if (error && !agent) {
    return (
      <>
        <Head>
          <title>Error - AI Pills</title>
        </Head>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="outlined" onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Edit {agent?.name || 'Agent'} - AI Pills</title>
      </Head>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link href="/" passHref>
            <Box component="span" sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', textDecoration: 'none', cursor: 'pointer' }}>
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Home
            </Box>
          </Link>
          <Link href="/dashboard" passHref>
            <Box component="span" sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', textDecoration: 'none', cursor: 'pointer' }}>
              <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Dashboard
            </Box>
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <EditIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Edit {agent?.name}
          </Typography>
        </Breadcrumbs>

        {/* Page Header */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'transparent' }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Edit Agent
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Update your agent's information and settings
          </Typography>
        </Paper>

        {/* Status Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}

        {/* Edit Form */}
        <Paper elevation={2} sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              {/* Agent Name */}
              <TextField
                label="Agent Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                fullWidth
                variant="outlined"
              />

              {/* Description */}
              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                placeholder="Describe what your agent does..."
              />

              {/* Visibility */}
              <FormControl fullWidth>
                <InputLabel>Visibility</InputLabel>
                <Select
                  value={formData.visibility}
                  label="Visibility"
                  onChange={(e) => handleInputChange('visibility', e.target.value)}
                >
                  <MenuItem value="private">Private</MenuItem>
                  <MenuItem value="public">Public</MenuItem>
                </Select>
              </FormControl>

              {/* Agent Type */}
              <TextField
                label="Agent Type"
                value={formData.agent_type}
                onChange={(e) => handleInputChange('agent_type', e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="e.g., Chat Bot, Code Assistant, Data Analyzer"
              />

              {/* Tags Section */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>Tags</Typography>
                
                {/* Add Tag Input */}
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    label="Add Tag"
                    value={formData.newTag}
                    onChange={(e) => handleInputChange('newTag', e.target.value)}
                    size="small"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button 
                    variant="outlined" 
                    onClick={handleAddTag}
                    disabled={!formData.newTag.trim()}
                  >
                    Add
                  </Button>
                </Box>

                {/* Display Tags */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                  {formData.tags.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No tags added yet
                    </Typography>
                  )}
                </Box>
              </Box>

              <Divider />

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => router.push('/dashboard')}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving || !formData.name.trim()}
                  startIcon={saving ? <CircularProgress size={20} /> : <EditIcon />}
                >
                  {saving ? 'Updating...' : 'Update Agent'}
                </Button>
              </Box>

            </Box>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default EditAgentPage;
