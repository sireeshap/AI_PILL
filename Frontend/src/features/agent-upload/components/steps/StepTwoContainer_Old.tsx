/**
 * @fileoverview Step Two Container - Package Validation
 * @author Enterprise Architecture Team
 * @version 1.0.0
 * 
 * Container component for the second step of the agent upload process.
 * Handles package validation display and progress tracking.
 */

import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Collapse,
  IconButton,
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import ErrorIcon from '@mui/icons-material/Error';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningIcon from '@mui/icons-material/Warning';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { StepTwoProps } from '../../types';

/**
 * Step Two Container Component
 * 
 * Renders the validation step including:
 * - Overall validation progress
 * - Individual file validation status
 * - Package structure analysis
 * - Validation warnings and errors
 */
export const StepTwoContainer: React.FC<StepTwoProps> = ({
  uploadedFiles,
  validationProgress,
}) => {
  
  return (
    <Box>
      
      {/* ===== VALIDATION HEADER ===== */}
      
      <Typography variant="h6" gutterBottom>
        Package Validation
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Validating your agent package structure and content...
      </Typography>

      {/* ===== OVERALL PROGRESS ===== */}
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom>
          Overall Progress
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={validationProgress} 
          sx={{ height: 8, borderRadius: 4 }}
          data-testid="overall-progress"
        />
        <Typography variant="caption" color="text.secondary">
          {validationProgress.toFixed(0)}% complete
        </Typography>
      </Box>

      {/* ===== FILE VALIDATION RESULTS ===== */}
      
      {uploadedFiles.map((fileUpload, index) => (
        <Card 
          key={index} 
          sx={{ mb: 2 }}
          data-testid={`validation-card-${index}`}
        >
          <CardContent>
            
            {/* File Header with Status */}
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

            {/* Validation Results */}
            {fileUpload.validationResults && (
              <Box>
                
                {/* Package Structure */}
                <Typography variant="body2" gutterBottom>
                  Package Structure:
                </Typography>
                <Box 
                  component="ul" 
                  sx={{ 
                    pl: 2, 
                    mt: 1, 
                    backgroundColor: 'grey.50', 
                    borderRadius: 1, 
                    p: 1,
                    maxHeight: 200,
                    overflow: 'auto'
                  }}
                >
                  {fileUpload.validationResults.packageStructure.map((item, i) => (
                    <Typography 
                      key={i} 
                      component="li" 
                      variant="caption" 
                      sx={{ 
                        fontFamily: 'monospace',
                        mb: 0.5,
                        color: item.endsWith('/') ? 'primary.main' : 'text.primary'
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Box>

                {/* Validation Summary */}
                <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {fileUpload.validationResults.hasMainFile && (
                    <Typography variant="caption" color="success.main">
                      ✓ Main file detected
                    </Typography>
                  )}
                  {fileUpload.validationResults.hasDependencies && (
                    <Typography variant="caption" color="success.main">
                      ✓ Dependencies found
                    </Typography>
                  )}
                  {fileUpload.validationResults.hasReadme && (
                    <Typography variant="caption" color="success.main">
                      ✓ Documentation found
                    </Typography>
                  )}
                  {fileUpload.validationResults.hasConfig && (
                    <Typography variant="caption" color="success.main">
                      ✓ Configuration files found
                    </Typography>
                  )}
                </Box>

                {/* Warnings */}
                {fileUpload.validationResults.warnings.length > 0 && (
                  <Alert 
                    severity="warning" 
                    sx={{ mt: 2 }} 
                    data-testid={`warnings-${index}`}
                  >
                    <Typography variant="caption">
                      <strong>Warnings:</strong>{' '}
                      {fileUpload.validationResults.warnings.join(', ')}
                    </Typography>
                  </Alert>
                )}

                {/* Errors */}
                {fileUpload.validationResults.errors.length > 0 && (
                  <Alert 
                    severity="error" 
                    sx={{ mt: 2 }}
                    data-testid={`errors-${index}`}
                  >
                    <Typography variant="caption">
                      <strong>Errors:</strong>{' '}
                      {fileUpload.validationResults.errors.join(', ')}
                    </Typography>
                  </Alert>
                )}
              </Box>
            )}

            {/* File-level Error Display */}
            {fileUpload.error && !fileUpload.validationResults && (
              <Alert severity="error" sx={{ mt: 2 }}>
                <Typography variant="caption">
                  {fileUpload.error}
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>
      ))}

      {/* ===== VALIDATION GUIDANCE ===== */}
      
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Validation in Progress</strong>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          We're analyzing your package structure to ensure it contains all necessary 
          components for a functional AI agent. This includes checking for entry points, 
          dependencies, documentation, and configuration files.
        </Typography>
      </Alert>
    </Box>
  );
};
