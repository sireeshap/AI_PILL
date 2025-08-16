/**
 * @fileoverview Step Four Container - Review and Submit
 * @author Enterprise Architecture Team
 * @version 1.0.0
 * 
 * Container component for the fourth and final step of the agent upload process.
 * Handles final review, tag management, and upload summary display.
 */

import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Paper,
  Stack,
  Alert,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InfoIcon from '@mui/icons-material/Info';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { StepFourProps } from '../../types';
import { MAX_TAGS_PER_AGENT } from '../../constants';

/**
 * Step Four Container Component
 * 
 * Renders the final step of the upload process including:
 * - Tag management interface
 * - GitHub link input (optional)
 * - Upload summary and validation status
 * - Pre-submission checklist
 */
export const StepFourContainer: React.FC<StepFourProps> = ({
  formData,
  uploadedFiles,
  currentTag,
  submitting,
  onTagChange,
  onAddTag,
  onDeleteTag,
}) => {
  
  // ===== COMPUTED VALUES =====
  
  const canAddMoreTags = formData.tags.length < MAX_TAGS_PER_AGENT;
  const allFilesValidated = uploadedFiles.every((file: any) => file.status === 'validated');
  const totalFiles = uploadedFiles.length;
  const successfulValidations = uploadedFiles.filter((file: any) => file.status === 'validated').length;
  
  // ===== HANDLERS =====
  
  const handleTagKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onAddTag();
    }
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // This will be handled by parent component through onFormChange prop
    // For now, we'll keep the GitHub link as read-only in this step
  };

  return (
    <Box>
      
      {/* ===== SECTION HEADER ===== */}
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Final Details & Review
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add tags to help others discover your agent and review your upload details.
        </Typography>
      </Box>

      <Stack spacing={3}>
        
        {/* ===== TAGS MANAGEMENT SECTION ===== */}
        
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocalOfferIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Tags ({formData.tags.length}/{MAX_TAGS_PER_AGENT})
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Add relevant tags to help users find your agent. Tags should describe functionality, 
              use cases, or technologies.
            </Typography>

            {/* Tag Input */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                label="Add Tag"
                value={currentTag}
                onChange={(e) => onTagChange(e.target.value)}
                size="small"
                disabled={submitting || !canAddMoreTags}
                placeholder="e.g., chatbot, automation, pdf"
                onKeyPress={handleTagKeyPress}
                sx={{ flexGrow: 1 }}
                inputProps={{
                  maxLength: 50,
                  'data-testid': 'tag-input'
                }}
                helperText={canAddMoreTags ? 
                  `Press Enter or click Add to include tag` : 
                  `Maximum ${MAX_TAGS_PER_AGENT} tags allowed`
                }
              />
              <Button
                variant="outlined"
                onClick={onAddTag}
                disabled={submitting || !currentTag.trim() || !canAddMoreTags}
                data-testid="add-tag-button"
              >
                Add
              </Button>
            </Box>

            {/* Current Tags Display */}
            {formData.tags.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.tags.map((tag: string) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={submitting ? undefined : () => onDeleteTag(tag)}
                    color="primary"
                    variant="outlined"
                    size="small"
                    data-testid={`tag-chip-${tag}`}
                  />
                ))}
              </Box>
            ) : (
              <Alert severity="info" sx={{ mt: 1 }}>
                <Typography variant="body2">
                  No tags added yet. Tags are optional but help others discover your agent.
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* ===== GITHUB LINK SECTION ===== */}
        
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              GitHub Repository (Optional)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Link to your agent's source code repository for transparency and collaboration.
            </Typography>
            
            <TextField
              name="github_link"
              label="GitHub Repository URL"
              value={formData.github_link || ''}
              fullWidth
              disabled={submitting}
              placeholder="https://github.com/username/repo-name"
              type="url"
              inputProps={{
                'data-testid': 'github-link-input',
                readOnly: true
              }}
              helperText="GitHub link can be set in Step 1. This is a summary view."
            />
          </CardContent>
        </Card>

        {/* ===== UPLOAD SUMMARY SECTION ===== */}
        
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CloudUploadIcon sx={{ mr: 1, color: 'success.main' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Upload Summary
              </Typography>
            </Box>

            <List dense>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Agent Name"
                  secondary={formData.name}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Category"
                  secondary={formData.category}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Visibility"
                  secondary={formData.visibility === 'private' ? 'Private' : 'Public'}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Package Files"
                  secondary={`${successfulValidations}/${totalFiles} files validated successfully`}
                />
              </ListItem>
              
              {formData.agent_type && (
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Agent Type"
                    secondary={formData.agent_type}
                  />
                </ListItem>
              )}
              
              {formData.tags.length > 0 && (
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Tags"
                    secondary={formData.tags.join(', ')}
                  />
                </ListItem>
              )}
            </List>
          </CardContent>
        </Card>

        {/* ===== VALIDATION STATUS ===== */}
        
        {allFilesValidated ? (
          <Alert severity="success" icon={<CheckCircleIcon />}>
            <Typography variant="body2">
              <strong>Ready to Create Agent!</strong> All files have been validated successfully. 
              Click "Create Agent" to complete the upload process.
            </Typography>
          </Alert>
        ) : (
          <Alert severity="warning" icon={<InfoIcon />}>
            <Typography variant="body2">
              <strong>Validation In Progress:</strong> Please wait for all files to be validated 
              before proceeding with agent creation.
            </Typography>
          </Alert>
        )}

        {/* ===== TERMS AND CONDITIONS NOTICE ===== */}
        
        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
          <Typography variant="caption" color="text.secondary">
            <strong>Notice:</strong> By creating this agent, you confirm that you have the right to upload 
            and distribute the provided content, and that it complies with our terms of service and 
            community guidelines. Uploaded agents will be reviewed for quality and security.
          </Typography>
        </Paper>
      </Stack>
    </Box>
  );
};

export default StepFourContainer;
