/**
 * @fileoverview Step Two Container - Package Validation
 * @author Enterprise Architecture Team
 * @version 1.0.0
 * 
 * Container component for the second step of the agent upload process.
 * Handles package validation display and progress tracking with real file analysis.
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
 * - Requirements validation table showing what's found vs needed
 * - Actual package structure from ZIP analysis
 * - Validation warnings and errors
 */
export const StepTwoContainer: React.FC<StepTwoProps> = ({
  uploadedFiles,
  validationProgress,
}) => {
  
  const [expandedFiles, setExpandedFiles] = React.useState<{ [key: number]: boolean }>({});
  
  const toggleFileExpansion = (index: number) => {
    setExpandedFiles(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Define requirements for agent packages
  const getRequirements = () => [
    { name: 'Main Entry File', description: 'main.py, app.py, index.py, or similar', required: true },
    { name: 'Dependencies File', description: 'requirements.txt, package.json, pyproject.toml', required: true },
    { name: 'README Documentation', description: 'README.md or README.txt', required: false },
    { name: 'Configuration Files', description: 'config files, .env, settings.py', required: false },
  ];

  // Check if all required items are satisfied for a file
  const areRequirementsSatisfied = (validationResults: any) => {
    return validationResults?.hasMainFile && validationResults?.hasDependencies;
  };
  
  return (
    <Box>
      
      {/* ===== VALIDATION HEADER ===== */}
      
      <Typography variant="h6" gutterBottom>
        Package Validation
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Analyzing the actual contents of your ZIP package and validating requirements...
      </Typography>

      {/* ===== OVERALL PROGRESS ===== */}
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom>
          Validation Progress
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {fileUpload.status === 'validated' ? (
                  <VerifiedIcon color="success" sx={{ mr: 1 }} />
                ) : fileUpload.status === 'validating' ? (
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                ) : fileUpload.status === 'error' ? (
                  <ErrorIcon color="error" sx={{ mr: 1 }} />
                ) : (
                  <UploadFileIcon sx={{ mr: 1 }} />
                )}
                <Box>
                  <Typography variant="subtitle2">
                    {fileUpload.file.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Size: {(fileUpload.file.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                </Box>
              </Box>
              
              {fileUpload.validationResults && (
                <IconButton 
                  onClick={() => toggleFileExpansion(index)}
                  size="small"
                  aria-label="Toggle file details"
                >
                  {expandedFiles[index] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              )}
            </Box>

            {/* Validation Results */}
            {fileUpload.validationResults && (
              <Box>
                
                {/* Requirements Validation Table */}
                <Typography variant="body2" gutterBottom sx={{ fontWeight: 600 }}>
                  Requirements Analysis:
                </Typography>
                
                <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Requirement</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Description</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getRequirements().map((req, i) => {
                        let status: 'success' | 'error' | 'warning' = 'error';
                        let statusIcon = <CancelIcon color="error" fontSize="small" />;
                        
                        if (req.name.includes('Main Entry') && fileUpload.validationResults!.hasMainFile) {
                          status = 'success';
                          statusIcon = <CheckCircleIcon color="success" fontSize="small" />;
                        } else if (req.name.includes('Dependencies') && fileUpload.validationResults!.hasDependencies) {
                          status = 'success';
                          statusIcon = <CheckCircleIcon color="success" fontSize="small" />;
                        } else if (req.name.includes('README') && fileUpload.validationResults!.hasReadme) {
                          status = 'success';
                          statusIcon = <CheckCircleIcon color="success" fontSize="small" />;
                        } else if (req.name.includes('Configuration') && fileUpload.validationResults!.hasConfig) {
                          status = 'success';
                          statusIcon = <CheckCircleIcon color="success" fontSize="small" />;
                        } else if (!req.required) {
                          status = 'warning';
                          statusIcon = <WarningIcon color="warning" fontSize="small" />;
                        }
                        
                        return (
                          <TableRow key={i}>
                            <TableCell sx={{ fontWeight: req.required ? 600 : 400 }}>
                              {req.name}
                              {req.required && <Chip label="Required" size="small" color="primary" sx={{ ml: 1 }} />}
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {statusIcon}
                                <Typography variant="caption" color={`${status}.main`}>
                                  {status === 'success' ? 'Found' : 
                                   status === 'warning' ? 'Optional' : 'Missing'}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption" color="text.secondary">
                                {req.description}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Overall Status Alert */}
                {areRequirementsSatisfied(fileUpload.validationResults) ? (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      ✅ <strong>All required components found!</strong> This package meets the minimum requirements for agent creation.
                    </Typography>
                  </Alert>
                ) : (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      ❌ <strong>Missing required components.</strong> Please upload a proper agent package with:
                    </Typography>
                    <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
                      {!fileUpload.validationResults!.hasMainFile && (
                        <li><Typography variant="caption">Main entry file (main.py, app.py, index.py, etc.)</Typography></li>
                      )}
                      {!fileUpload.validationResults!.hasDependencies && (
                        <li><Typography variant="caption">Dependencies file (requirements.txt, package.json, etc.)</Typography></li>
                      )}
                    </ul>
                  </Alert>
                )}

                {/* Package Structure - Collapsible */}
                <Collapse in={expandedFiles[index]} timeout="auto" unmountOnExit>
                  <Typography variant="body2" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
                    Actual Package Contents:
                  </Typography>
                  <Box 
                    component="div" 
                    sx={{ 
                      backgroundColor: 'grey.50', 
                      borderRadius: 1, 
                      p: 2,
                      maxHeight: 300,
                      overflow: 'auto',
                      border: '1px solid',
                      borderColor: 'grey.300'
                    }}
                  >
                    {fileUpload.validationResults.packageStructure.length > 0 ? (
                      fileUpload.validationResults.packageStructure.map((item, i) => (
                        <Typography 
                          key={i} 
                          variant="caption" 
                          sx={{ 
                            fontFamily: 'monospace',
                            display: 'block',
                            mb: 0.5,
                            color: item.endsWith('/') ? 'primary.main' : 'text.primary',
                            fontWeight: item.endsWith('/') ? 600 : 400
                          }}
                        >
                          {item.endsWith('/') ? '📁 ' : '📄 '}{item}
                        </Typography>
                      ))
                    ) : (
                      <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        No files detected in package
                      </Typography>
                    )}
                  </Box>
                </Collapse>

                {/* Warnings */}
                {fileUpload.validationResults.warnings.length > 0 && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Recommendations:</Typography>
                    <ul style={{ margin: '4px 0 0 20px', padding: 0 }}>
                      {fileUpload.validationResults.warnings.map((warning, i) => (
                        <li key={i}>
                          <Typography variant="caption">{warning}</Typography>
                        </li>
                      ))}
                    </ul>
                  </Alert>
                )}

                {/* Critical Errors */}
                {fileUpload.validationResults.errors.length > 0 && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Critical Issues:</Typography>
                    <ul style={{ margin: '4px 0 0 20px', padding: 0 }}>
                      {fileUpload.validationResults.errors.map((error, i) => (
                        <li key={i}>
                          <Typography variant="caption">{error}</Typography>
                        </li>
                      ))}
                    </ul>
                  </Alert>
                )}
              </Box>
            )}

            {/* Upload/Validation Error State */}
            {fileUpload.status === 'error' && fileUpload.error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                <Typography variant="body2">{fileUpload.error}</Typography>
              </Alert>
            )}
          </CardContent>
        </Card>
      ))}

      {/* ===== VALIDATION GUIDANCE ===== */}
      
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>How Package Validation Works</strong>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          We extract and analyze the actual contents of your ZIP file to verify it contains the necessary components for a functional AI agent. 
          The "Requirements Analysis" table shows what we found versus what's needed. 
          Click the expand button (↓) to see the complete file structure.
        </Typography>
      </Alert>
    </Box>
  );
};

export default StepTwoContainer;