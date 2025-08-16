import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import ErrorIcon from '@mui/icons-material/Error';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { FileUpload } from './types';

interface StepTwoProps {
  uploadedFiles: FileUpload[];
  validationProgress: number;
}

const StepTwo: React.FC<StepTwoProps> = ({
  uploadedFiles,
  validationProgress
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Package Validation
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Validating your agent package structure and content...
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom>
          Overall Progress
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={validationProgress} 
          sx={{ height: 8, borderRadius: 4 }}
        />
        <Typography variant="caption" color="text.secondary">
          {validationProgress.toFixed(0)}% complete
        </Typography>
      </Box>

      {uploadedFiles.map((fileUpload, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {fileUpload.status === 'validated' ? (
                <VerifiedIcon color="success" sx={{ mr: 1 }} />
              ) : fileUpload.status === 'validating' ? (
                <CircularProgress size={20} sx={{ mr: 1 }} />
              ) : fileUpload.status === 'error' ? (
                <ErrorIcon color="error" sx={{ mr: 1 }} />
              ) : (
                <UploadFileIcon sx={{ mr: 1 }} />
              )}
              <Typography variant="subtitle2">
                {fileUpload.file.name}
              </Typography>
            </Box>

            {fileUpload.validationResults && (
              <Box>
                <Typography variant="body2" gutterBottom>
                  Package Structure:
                </Typography>
                <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                  {fileUpload.validationResults.packageStructure.map((item, i) => (
                    <Typography key={i} component="li" variant="caption" sx={{ fontFamily: 'monospace' }}>
                      {item}
                    </Typography>
                  ))}
                </Box>

                {fileUpload.validationResults.warnings.length > 0 && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    <Typography variant="caption">
                      <strong>Warnings:</strong> {fileUpload.validationResults.warnings.join(', ')}
                    </Typography>
                  </Alert>
                )}

                {fileUpload.validationResults.errors.length > 0 && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    <Typography variant="caption">
                      <strong>Errors:</strong> {fileUpload.validationResults.errors.join(', ')}
                    </Typography>
                  </Alert>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default StepTwo;
