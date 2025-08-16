import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Paper,
  Stack,
} from '@mui/material';
import { AgentFormData, FileUpload } from './types';

interface StepThreeProps {
  formData: AgentFormData;
  uploadedFiles: FileUpload[];
  currentTag: string;
  submitting: boolean;
  onTagChange: (tag: string) => void;
  onAddTag: () => void;
  onDeleteTag: (tag: string) => void;
}

const StepThree: React.FC<StepThreeProps> = ({
  formData,
  uploadedFiles,
  currentTag,
  submitting,
  onTagChange,
  onAddTag,
  onDeleteTag
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Final Details & Tags
      </Typography>
      
      <Stack spacing={3}>
        {/* Tags Section */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Tags (Optional)
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              label="Add Tag"
              value={currentTag}
              onChange={(e) => onTagChange(e.target.value)}
              size="small"
              disabled={submitting || formData.tags.length >= 10}
              placeholder="Enter tag name"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onAddTag();
                }
              }}
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="outlined"
              onClick={onAddTag}
              disabled={submitting || !currentTag.trim() || formData.tags.length >= 10}
            >
              Add
            </Button>
          </Box>

          {formData.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={submitting ? undefined : () => onDeleteTag(tag)}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Summary */}
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Agent Summary
          </Typography>
          <Typography variant="body2"><strong>Name:</strong> {formData.name}</Typography>
          <Typography variant="body2"><strong>Category:</strong> {formData.category}</Typography>
          <Typography variant="body2"><strong>Files:</strong> {uploadedFiles.length} package(s)</Typography>
          <Typography variant="body2"><strong>Visibility:</strong> {formData.visibility}</Typography>
          {formData.tags.length > 0 && (
            <Typography variant="body2"><strong>Tags:</strong> {formData.tags.join(', ')}</Typography>
          )}
        </Paper>
      </Stack>
    </Box>
  );
};

export default StepThree;
