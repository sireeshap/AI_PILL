// In ai_pills/frontend/client_nextjs/src/pages/dashboard/upload.tsx
import React, { useState, useEffect } from 'react'; // Added useEffect
import { NextPage } from 'next';
import {
    Container, TextField, Button, Typography, Box, Paper, Grid, Chip,
    InputLabel, CircularProgress, Alert // Added CircularProgress, Alert
} from '@mui/material';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { fetchClient } from '../../services/api'; // Adjust path
import Head from 'next/head'; // For page title

interface AgentFormData {
  name: string;
  description: string;
  version: string;
  tags: string[];
  githubLink: string; // Changed to string, will be validated by Pydantic HttpUrl on backend
  // agentFile: File | null;
}

const UploadAgentPage: NextPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<AgentFormData>({
    name: '',
    description: '',
    version: '1.0.0',
    tags: [],
    githubLink: '',
    // agentFile: null,
  });
  const [currentTag, setCurrentTag] = useState('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Check for auth token on mount
  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
        setError("Authentication required. Redirecting to login...");
        setTimeout(() => router.push('/auth/login'), 2000);
    }
  }, [router]);


  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleAddTag = () => {
    const newTag = currentTag.trim().toLowerCase(); // Standardize tags to lowercase
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
      setCurrentTag('');
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToDelete) }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    alert("6")
    setError(null);
    setMessage(null);

    if (!formData.name.trim() || !formData.description.trim() || !formData.version.trim()) {
        setError("Name, Description, and Version are required fields.");
        return;
    }
    // Optional: Basic GitHub link validation (simple check)
    if (formData.githubLink && !formData.githubLink.startsWith('http://') && !formData.githubLink.startsWith('https://')) {
        setError("GitHub Link must be a valid URL (e.g., start with http:// or https://).");
        return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        version: formData.version,
        tags: formData.tags,
        // Ensure github_link is omitted if empty, or sent as null if backend expects HttpUrl | None
        github_link: formData.githubLink.trim() || undefined,
      };

      // Using 'any' for response type if we don't have a specific type for created agent yet from backend
      const createdAgent = await fetchClient<any>('/agents/', {
        method: 'POST',
        body: payload,
      });

      console.log('Agent uploaded successfully:', createdAgent);
      setMessage('Agent uploaded successfully! Redirecting to dashboard...');
      setTimeout(() => router.push('/dashboard'), 2000);

    } catch (err: any) {
      console.error('Failed to upload agent:', err);
      let errorMessage = err.message || 'Failed to upload agent.';
       if (err.message && (err.message.includes('401') || err.message.includes('Not authenticated') || err.message.includes('Could not validate credentials'))) {
           errorMessage = 'Session expired or invalid. Please log in again.';
           // router.push('/auth/login'); // Or let user click a login button
       } else if (err.message && err.message.includes("validation error")) { // From FastAPI Pydantic validation
           errorMessage = `Validation Error: ${err.message}`;
       }
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // If redirecting due to no auth, show minimal UI
  if (error && error.includes("Redirecting to login")) {
      return (
        <Container component="main" maxWidth="md" sx={{mb: 4, mt: 8}}>
            <Alert severity="error">{error}</Alert>
        </Container>
      );
  }


  return (
    <>
    <Head>
        <title>Upload New Agent - AI Pills</title>
    </Head>
    <Container component="main" maxWidth="md" sx={{mb: 4}}>
      <Paper elevation={3} sx={{ padding: { xs: 2, sm: 3, md: 4 }, marginTop: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography component="h1" variant="h5" sx={{fontWeight: 'bold'}}>
            Upload New AI Agent
            </Typography>
            <Link href="/dashboard" passHref>
                <Button variant="outlined" disabled={submitting}>Back to Dashboard</Button>
            </Link>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField name="name" required fullWidth id="name" label="Agent Name" autoFocus value={formData.name} onChange={handleChange} disabled={submitting}/>
            </Grid>
            <Grid item xs={12}>
              <TextField name="description" required fullWidth id="description" label="Description" multiline rows={4} value={formData.description} onChange={handleChange} disabled={submitting}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="version" required fullWidth id="version" label="Version (e.g., 1.0.0)" value={formData.version} onChange={handleChange} disabled={submitting}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="githubLink" fullWidth id="githubLink" label="GitHub Link (Optional)" value={formData.githubLink} onChange={handleChange} type="url" disabled={submitting}/>
            </Grid>
            <Grid item xs={12}>
              <InputLabel htmlFor="tags-input" shrink sx={{mb:0.5, fontWeight:'bold'}}>Tags</InputLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TextField id="tags-input" size="small" placeholder="Type a tag and press Enter or Add" value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag();}}} sx={{ mr: 1, flexGrow: 1 }} disabled={submitting}/>
                <Button variant="outlined" onClick={handleAddTag} disabled={submitting || !currentTag.trim()}>Add Tag</Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, p: formData.tags.length ? 1 : 0, border: formData.tags.length ? '1px solid #ccc' : 'none', borderRadius: formData.tags.length ? 1: 0, minHeight: formData.tags.length ? 'auto' : 0 }}>
                {formData.tags.map((tag) => (
                  <Chip key={tag} label={tag} onDelete={submitting ? undefined : () => handleDeleteTag(tag)} disabled={submitting} />
                ))}
                {formData.tags.length === 0 && <Typography variant="caption" color="textSecondary">No tags added yet.</Typography>}
              </Box>
            </Grid>
            {/* File input placeholder
            <Grid item xs={12}>
              <InputLabel htmlFor="agent-file-input" sx={{mb:0.5, fontWeight:'bold'}}>Agent File (Optional)</InputLabel>
              <TextField type="file" fullWidth id="agent-file-input" onChange={handleFileChange} disabled={submitting} />
            </Grid>
            */}
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.5 }} disabled={submitting || !!message}>
            {submitting ? <CircularProgress size={24} color="inherit" /> : 'Upload Agent'}
          </Button>
        </Box>
      </Paper>
    </Container>
    </>
  );
};
export default UploadAgentPage;
