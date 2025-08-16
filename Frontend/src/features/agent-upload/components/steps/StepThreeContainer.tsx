/**
 * @fileoverview Step Three Container - Agent Details
 * @author Enterprise Architecture Team
 * @version 1.0.0
 * 
 * Container component for the third step of the agent upload process.
 * Handles agent details form including name, description, type, and visibility.
 */

import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel as MuiInputLabel,
  Select,
  MenuItem,
  Typography,
  Stack,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import CategoryIcon from '@mui/icons-material/Category';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { StepThreeProps } from '../../types';

/**
 * Step Three Container Component
 * 
 * Renders the agent details step including:
 * - Agent name input with validation
 * - Description text area
 * - Agent type specification
 * - Visibility settings
 * - GitHub repository link
 */
export const StepThreeContainer: React.FC<StepThreeProps> = ({
  formData,
  submitting,
  onFormChange,
  onSelectChange,
}) => {
  
  return (
    <Box>
      
      {/* ===== SECTION HEADER ===== */}
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Agent Details
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Provide detailed information about your agent including its name, description, and configuration.
        </Typography>
      </Box>

      <Stack spacing={3}>
        
        {/* ===== BASIC INFORMATION CARD ===== */}
        
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Basic Information
              </Typography>
            </Box>
            
            <Stack spacing={3}>
              <TextField
                name="name"
                label="Agent Name"
                value={formData.name}
                onChange={onFormChange}
                required
                fullWidth
                autoFocus
                disabled={submitting}
                placeholder="Enter a descriptive name for your agent"
                inputProps={{
                  maxLength: 100,
                  'data-testid': 'agent-name-input'
                }}
                helperText={`${formData.name.length}/100 characters`}
              />

              <TextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={onFormChange}
                fullWidth
                multiline
                rows={4}
                disabled={submitting}
                placeholder="Describe what your agent does and its capabilities..."
                inputProps={{
                  maxLength: 1000,
                  'data-testid': 'agent-description-input'
                }}
                helperText={`${formData.description.length}/1000 characters`}
              />
            </Stack>
          </CardContent>
        </Card>

        {/* ===== CONFIGURATION CARD ===== */}
        
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CategoryIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Configuration
              </Typography>
            </Box>
            
            <Stack spacing={3}>
              {/* Agent Type and Visibility Row */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  name="agent_type"
                  label="Agent Type"
                  value={formData.agent_type}
                  onChange={onFormChange}
                  disabled={submitting}
                  placeholder="e.g., Chat Bot, Code Assistant, Data Analyzer"
                  sx={{ flex: 1 }}
                  inputProps={{
                    'data-testid': 'agent-type-input'
                  }}
                  helperText="Specify the type or category of your agent"
                />
                
                <FormControl sx={{ flex: 1 }}>
                  <MuiInputLabel>Visibility</MuiInputLabel>
                  <Select
                    name="visibility"
                    value={formData.visibility}
                    label="Visibility"
                    onChange={onSelectChange}
                    disabled={submitting}
                    data-testid="visibility-select"
                  >
                    <MenuItem value="private">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        🔒 <Typography sx={{ ml: 1 }}>Private</Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="public">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        🌍 <Typography sx={{ ml: 1 }}>Public</Typography>
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* ===== REPOSITORY CARD ===== */}
        
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Source Code Repository
              </Typography>
            </Box>
            
            <TextField
              name="github_link"
              label="GitHub Repository (Optional)"
              value={formData.github_link || ''}
              onChange={onFormChange}
              fullWidth
              disabled={submitting}
              placeholder="https://github.com/username/repository"
              type="url"
              inputProps={{
                'data-testid': 'github-link-input'
              }}
              helperText="Link to your agent's source code for transparency and collaboration"
            />
          </CardContent>
        </Card>

        {/* ===== SUMMARY PREVIEW ===== */}
        
        <Card variant="outlined" sx={{ bgcolor: 'background.default' }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Preview
            </Typography>
            
            <Stack spacing={1}>
              <Typography variant="body2">
                <strong>Name:</strong> {formData.name || 'Not specified'}
              </Typography>
              <Typography variant="body2">
                <strong>Type:</strong> {formData.agent_type || 'Not specified'}
              </Typography>
              <Typography variant="body2">
                <strong>Visibility:</strong> {formData.visibility === 'private' ? 'Private' : 'Public'}
              </Typography>
              <Typography variant="body2">
                <strong>Category:</strong> {formData.category || 'Not specified'}
              </Typography>
              {formData.description && (
                <Typography variant="body2">
                  <strong>Description:</strong> {formData.description.substring(0, 100)}
                  {formData.description.length > 100 ? '...' : ''}
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* ===== VALIDATION HINTS ===== */}
        
        <Alert severity="info">
          <Typography variant="body2">
            <strong>Required fields:</strong> Agent name is required to proceed to the next step. 
            All other fields are optional but recommended for better discoverability.
          </Typography>
        </Alert>
      </Stack>
    </Box>
  );
};

export default StepThreeContainer;
