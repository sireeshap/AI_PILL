import React, { useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Stack,
  Alert,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import VerifiedIcon from '@mui/icons-material/Verified';
import PublishIcon from '@mui/icons-material/Publish';

import { UploadAgentDrawerProps } from '../../features/agent-upload/types';
import { UPLOAD_STEPS } from '../../features/agent-upload/constants';
import { canProceedToValidation, canProceedToCreate } from '../../features/agent-upload/validators';
import { useUploadAgent } from '../../features/agent-upload/hooks/useUploadAgent';
import { StepOneContainer } from '../../features/agent-upload/components/steps/StepOneContainer';
import { StepTwoContainer } from '../../features/agent-upload/components/steps/StepTwoContainer';
import { StepThreeContainer } from '../../features/agent-upload/components/steps/StepThreeContainer';
import { StepFourContainer } from '../../features/agent-upload/components/steps/StepFourContainer';

const UploadAgentDrawer: React.FC<UploadAgentDrawerProps> = ({ 
  open, 
  onClose, 
  onAgentCreated 
}) => {
  const {
    // State
    activeStep,
    formData,
    currentTag,
    submitting,
    error,
    success,
    uploadedFiles,
    copyrightConfirmed,
    dragActive,
    validationProgress,
    
    // Actions
    resetForm,
    handleChange,
    handleSelectChange,
    handleAddTag,
    handleDeleteTag,
    handleFileSelect,
    removeFile,
    handleNext,
    handleBack,
    handleSubmit,
    
    // Setters
    setCurrentTag,
    setCopyrightConfirmed,
    setDragActive,
    setError
  } = useUploadAgent(onAgentCreated, onClose);

  // Reset form when drawer closes
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <StepOneContainer
            formData={formData}
            uploadedFiles={uploadedFiles}
            copyrightConfirmed={copyrightConfirmed}
            dragActive={dragActive}
            submitting={submitting}
            onFormChange={handleChange}
            onSelectChange={handleSelectChange}
            onFileSelect={handleFileSelect}
            onFileDrop={handleFileDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onRemoveFile={removeFile}
            onCopyrightChange={setCopyrightConfirmed}
          />
        );

      case 1:
        return (
          <StepTwoContainer
            uploadedFiles={uploadedFiles}
            validationProgress={validationProgress}
          />
        );

      case 2:
        return (
          <StepThreeContainer
            formData={formData}
            submitting={submitting}
            onFormChange={handleChange}
            onSelectChange={handleSelectChange}
          />
        );

      case 3:
        return (
          <StepFourContainer
            formData={formData}
            uploadedFiles={uploadedFiles}
            currentTag={currentTag}
            submitting={submitting}
            onTagChange={setCurrentTag}
            onAddTag={handleAddTag}
            onDeleteTag={handleDeleteTag}
          />
        );

      default:
        return null;
    }
  };

  const drawerContent = (
    <Box sx={{ width: 500, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper 
        elevation={1} 
        sx={{ 
          p: 3, 
          borderRadius: 0, 
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'primary.main',
          color: 'primary.contrastText'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CloudUploadIcon sx={{ mr: 1.5, fontSize: 28 }} />
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
              Create New Agent
            </Typography>
          </Box>
          <IconButton 
            onClick={onClose} 
            sx={{ 
              color: 'inherit',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
          {UPLOAD_STEPS[activeStep].description}
        </Typography>
      </Paper>

      {/* Stepper */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stepper activeStep={activeStep} orientation="horizontal" alternativeLabel>
          {UPLOAD_STEPS.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    '&.Mui-completed': { color: 'success.main' },
                    '&.Mui-active': { color: 'primary.main' }
                  }
                }}
              >
                <Typography variant="caption">{step.label}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Content */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3 }}>
        {/* Status Messages */}
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {renderStepContent(activeStep)}
      </Box>

      {/* Footer Actions */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 0,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <form onSubmit={handleSubmit}>
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Button
              onClick={handleBack}
              disabled={activeStep === 0 || submitting}
            >
              Back
            </Button>
            
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </Button>
                 {activeStep < 3 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={
                  submitting || 
                  (activeStep === 0 && !canProceedToValidation(uploadedFiles, formData.category, copyrightConfirmed)) ||
                  (activeStep === 1 && !canProceedToCreate(uploadedFiles, formData.name, formData.category)) ||
                  (activeStep === 2 && !canProceedToCreate(uploadedFiles, formData.name, formData.category))
                }
                startIcon={activeStep === 0 ? <UploadFileIcon /> : <VerifiedIcon />}
              >
                {activeStep === 0 ? 'Upload & Validate' : 'Continue'}
              </Button>
            ) : (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting || !canProceedToCreate(uploadedFiles, formData.name, formData.category) || !!success}
                  startIcon={submitting ? <CircularProgress size={20} /> : <PublishIcon />}
                >
                  {submitting ? 'Creating Agent...' : 'Create Agent 111'}
                </Button>
              )}
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Box>
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 500,
          maxWidth: '90vw',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default UploadAgentDrawer;
