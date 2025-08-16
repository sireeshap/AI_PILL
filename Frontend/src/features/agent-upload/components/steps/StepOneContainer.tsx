/**
 * @fileoverview Step One Container - File Upload and Basic Information
 * @author Enterprise Architecture Team
 * @version 1.0.0
 * 
 * Container component for the first step of the agent upload process.
 * Handles form data collection and file upload functionality.
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
  Alert,
  Paper,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

import { StepOneProps } from '../../types';
import { AGENT_CATEGORIES, SUPPORTED_FORMATS_BY_CATEGORY } from '../../constants';

/**
 * Step One Container Component
 * 
 * Renders the first step of the upload process including:
 * - Basic agent information form
 * - File upload with drag & drop
 * - Category selection and validation
 * - Copyright confirmation
 */
export const StepOneContainer: React.FC<StepOneProps> = ({
  formData,
  uploadedFiles,
  copyrightConfirmed,
  dragActive,
  submitting,
  onFormChange,
  onSelectChange,
  onFileSelect,
  onFileDrop,
  onDragOver,
  onDragLeave,
  onRemoveFile,
  onCopyrightChange,
}) => {
  
  return (
    <Box>
      <Stack spacing={3}>
        
        {/* ===== BASIC INFORMATION SECTION ===== */}
        
        {/* ===== CATEGORY SELECTION ===== */}
        
        <Box>
          <FormControl fullWidth>
            <MuiInputLabel>Agent Category *</MuiInputLabel>
            <Select
              name="category"
              value={formData.category}
              label="Agent Category *"
              onChange={onSelectChange}
              disabled={submitting}
              required
              data-testid="category-select"
            >
              {AGENT_CATEGORIES.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {category.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {category.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {formData.category && (
            <Alert severity="info" sx={{ mt: 1 }}>
              <Typography variant="caption">
                <strong>Supported formats:</strong>{' '}
                {SUPPORTED_FORMATS_BY_CATEGORY[formData.category]?.join(', ')}
              </Typography>
            </Alert>
          )}
        </Box>

        {/* ===== FILE UPLOAD SECTION ===== */}
        
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Upload Agent Package
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Max 100MB per file
            </Typography>
          </Box>
          
          {/* Drag & Drop Area */}
          <Paper
            variant="outlined"
            onDrop={onFileDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            sx={{
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              borderStyle: 'dashed',
              borderWidth: 2,
              borderColor: dragActive ? 'primary.main' : 'grey.300',
              backgroundColor: dragActive ? 'primary.50' : 'grey.50',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'primary.50'
              }
            }}
            data-testid="file-drop-zone"
          >
            <input
              type="file"
              multiple
              onChange={(e) => onFileSelect(e.target.files)}
              style={{ display: 'none' }}
              id="file-upload-input"
              accept={formData.category ? 
                SUPPORTED_FORMATS_BY_CATEGORY[formData.category]?.join(',') : 
                '*'
              }
              data-testid="file-input"
            />
            <label 
              htmlFor="file-upload-input" 
              style={{ cursor: 'pointer', width: '100%', display: 'block' }}
            >
              <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Drag & drop files here or click to browse
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upload your complete agent package as a ZIP or TAR archive
              </Typography>
              {formData.category && (
                <Typography variant="caption" color="primary.main" sx={{ mt: 1, display: 'block' }}>
                  Accepted formats: {SUPPORTED_FORMATS_BY_CATEGORY[formData.category]?.join(', ')}
                </Typography>
              )}
            </label>
          </Paper>

          {/* ===== UPLOADED FILES LIST ===== */}
          
          {uploadedFiles.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Uploaded Files ({uploadedFiles.length})
              </Typography>
              <List dense>
                {uploadedFiles.map((fileUpload, index) => (
                  <ListItem
                    key={index}
                    data-testid={`file-item-${index}`}
                    secondaryAction={
                      <IconButton 
                        edge="end" 
                        onClick={() => onRemoveFile(index)}
                        disabled={submitting}
                        size="small"
                        data-testid={`remove-file-${index}`}
                      >
                        <CloseIcon />
                      </IconButton>
                    }
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1
                    }}
                  >
                    <ListItemIcon>
                      {fileUpload.status === 'uploaded' ? (
                        <CheckCircleIcon color="success" />
                      ) : fileUpload.status === 'error' ? (
                        <ErrorIcon color="error" />
                      ) : fileUpload.status === 'uploading' ? (
                        <CircularProgress size={20} />
                      ) : (
                        <AttachFileIcon />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={fileUpload.file.name}
                      secondary={
                        <>
                          <Typography variant="caption" color="text.secondary" component="span">
                            {(fileUpload.file.size / 1024 / 1024).toFixed(2)} MB
                          </Typography>
                          {fileUpload.status === 'uploading' && (
                            <LinearProgress 
                              variant="determinate" 
                              value={fileUpload.progress} 
                              sx={{ mt: 0.5, display: 'block' }}
                              data-testid={`file-progress-${index}`}
                            />
                          )}
                          {fileUpload.error && (
                            <Typography variant="caption" color="error" component="div" sx={{ mt: 0.5 }}>
                              {fileUpload.error}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>

        {/* ===== COPYRIGHT CONFIRMATION ===== */}
        
        <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'warning.50' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={copyrightConfirmed}
                onChange={(e) => onCopyrightChange(e.target.checked)}
                disabled={submitting}
                color="primary"
                data-testid="copyright-checkbox"
              />
            }
            label={
              <Typography variant="body2">
                I confirm that this agent is either <strong>open-source</strong> or{' '}
                <strong>self-developed</strong> and does not contain any copyrighted 
                material that I do not have permission to distribute.
              </Typography>
            }
            sx={{ alignItems: 'flex-start' }}
          />
        </Paper>
      </Stack>
    </Box>
  );
};
