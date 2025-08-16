import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel as MuiInputLabel,
  Select,
  MenuItem,
  Stack,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  IconButton,
  Paper,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { AgentFormData, FileUpload } from './types';
import { AGENT_CATEGORIES, SUPPORTED_FORMATS } from './constants';

interface StepOneProps {
  formData: AgentFormData;
  uploadedFiles: FileUpload[];
  copyrightConfirmed: boolean;
  dragActive: boolean;
  submitting: boolean;
  onFormChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (event: any) => void;
  onFileSelect: (files: FileList | null) => void;
  onFileDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onRemoveFile: (index: number) => void;
  onCopyrightChange: (checked: boolean) => void;
}

const StepOne: React.FC<StepOneProps> = ({
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
  onCopyrightChange
}) => {
  return (
    <Box>
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
        />

        <TextField
          name="description"
          label="Description"
          value={formData.description}
          onChange={onFormChange}
          fullWidth
          multiline
          rows={3}
          disabled={submitting}
          placeholder="Describe what your agent does..."
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            name="agent_type"
            label="Agent Type"
            value={formData.agent_type}
            onChange={onFormChange}
            disabled={submitting}
            placeholder="e.g., Chat Bot, Code Assistant"
            sx={{ flex: 1 }}
          />
          <FormControl sx={{ flex: 1 }}>
            <MuiInputLabel>Visibility</MuiInputLabel>
            <Select
              name="visibility"
              value={formData.visibility}
              label="Visibility"
              onChange={onSelectChange}
              disabled={submitting}
            >
              <MenuItem value="private">🔒 Private</MenuItem>
              <MenuItem value="public">🌍 Public</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <FormControl fullWidth>
          <MuiInputLabel>Agent Category *</MuiInputLabel>
          <Select
            name="category"
            value={formData.category}
            label="Agent Category *"
            onChange={onSelectChange}
            disabled={submitting}
            required
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

        <TextField
          name="github_link"
          label="GitHub Repository (Optional)"
          value={formData.github_link}
          onChange={onFormChange}
          fullWidth
          disabled={submitting}
          placeholder="https://github.com/username/repository"
          type="url"
        />

        {/* File Upload */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Upload Agent Package
          </Typography>
          
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
          >
            <input
              type="file"
              multiple
              onChange={(e) => onFileSelect(e.target.files)}
              style={{ display: 'none' }}
              id="file-upload-input"
              accept={formData.category ? SUPPORTED_FORMATS[formData.category]?.join(',') : '*'}
            />
            <label htmlFor="file-upload-input" style={{ cursor: 'pointer', width: '100%', display: 'block' }}>
              <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Drag & drop files here or click to browse
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upload your complete agent package as a ZIP or TAR archive
              </Typography>
              {formData.category && (
                <Typography variant="caption" color="primary.main" sx={{ mt: 1, display: 'block' }}>
                  Accepted formats: {SUPPORTED_FORMATS[formData.category]?.join(', ')}
                </Typography>
              )}
            </label>
          </Paper>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <List dense sx={{ mt: 2 }}>
              {uploadedFiles.map((fileUpload, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      onClick={() => onRemoveFile(index)}
                      disabled={submitting}
                      size="small"
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
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {(fileUpload.file.size / 1024 / 1024).toFixed(2)} MB
                        </Typography>
                        {fileUpload.status === 'uploading' && (
                          <LinearProgress 
                            variant="determinate" 
                            value={fileUpload.progress} 
                            sx={{ mt: 0.5 }}
                          />
                        )}
                        {fileUpload.error && (
                          <Typography variant="caption" color="error">
                            {fileUpload.error}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        {/* Copyright Confirmation */}
        <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'warning.50' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={copyrightConfirmed}
                onChange={(e) => onCopyrightChange(e.target.checked)}
                disabled={submitting}
                color="primary"
              />
            }
            label={
              <Typography variant="body2">
                I confirm that this agent is either <strong>open-source</strong> or <strong>self-developed</strong> and does not contain any copyrighted material that I do not have permission to distribute.
              </Typography>
            }
          />
        </Paper>
      </Stack>
    </Box>
  );
};

export default StepOne;
