/**
 * @fileoverview Agent Upload Drawer Component
 * @author Enterprise Architecture Team
 * @version 1.0.0
 * 
 * Main drawer component for agent upload workflow.
 * Follows enterprise React patterns with proper separation of concerns.
 */

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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import VerifiedIcon from '@mui/icons-material/Verified';
import SettingsIcon from '@mui/icons-material/Settings';
import PublishIcon from '@mui/icons-material/Publish';

import { UploadAgentDrawerProps } from '../../types';
import { UPLOAD_STEPS, UI_CONSTANTS } from '../../constants';
import { canProceedToValidation, canProceedToAgentDetails, canProceedToCreate } from '../../validators';
import { useUploadAgent } from '../../hooks/useUploadAgent';
import { StepOneContainer } from '../steps/StepOneContainer';
import { StepTwoContainer } from '../steps/StepTwoContainer';
import { StepThreeContainer } from '../steps/StepThreeContainer';
import { StepFourContainer } from '../steps/StepFourContainer';

/**
 * Agent Upload Drawer Component
 * 
 * Provides a multi-step interface for uploading and validating agent packages.
 * Implements enterprise UX patterns with proper error handling and accessibility.
 */
export const AgentUploadDrawer: React.FC<UploadAgentDrawerProps> = ({ 
  open, 
  onClose, 
  onAgentCreated 
}) => {
  
  // ===== RESPONSIVE DESIGN SETUP =====
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  
  // Calculate responsive drawer width
  const getDrawerWidth = () => {
    if (isMobile) {
      return UI_CONSTANTS.DRAWER_RESPONSIVE_CONFIG.widthMobile;
    }
    if (isTablet) {
      return UI_CONSTANTS.DRAWER_RESPONSIVE_CONFIG.widthTablet;
    }
    // Desktop: Use maximum of 40% viewport width
    return UI_CONSTANTS.DRAWER_RESPONSIVE_CONFIG.maxWidthDesktop;
  };
  
  const drawerWidth = getDrawerWidth();
  
  // ===== HOOK INTEGRATION =====
  
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

  // ===== LIFECYCLE MANAGEMENT =====
  
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

  // ===== DRAG AND DROP HANDLERS =====
  
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

  // ===== STEP CONTENT RENDERING =====
  
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

  // ===== BUTTON STATE LOGIC =====
  
  const getNextButtonProps = () => {
    const baseProps = {
      variant: 'contained' as const,
      onClick: activeStep < 3 ? handleNext : handleSubmit, // ✅ FIXED: Step 3 gets handleSubmit
      type: 'button' as const, // ✅ FIXED: All buttons are type="button"
      disabled: submitting || !!success
    };

    switch (activeStep) {
      case 0:
        return {
          ...baseProps,
          disabled: baseProps.disabled || !canProceedToValidation(
            uploadedFiles, 
            formData.category, 
            copyrightConfirmed
          ),
          startIcon: <UploadFileIcon />,
          children: 'Upload & Validate'
        };
      
      case 1:
        return {
          ...baseProps,
          disabled: baseProps.disabled || !canProceedToAgentDetails(uploadedFiles),
          startIcon: <VerifiedIcon />,
          children: 'Continue to Details'
        };
      
      case 2:
        return {
          ...baseProps,
          disabled: baseProps.disabled || !formData.name.trim(),
          startIcon: <SettingsIcon />,
          children: 'Review & Submit'
        };
      
      case 3:
        return {
          ...baseProps,
          disabled: baseProps.disabled || !canProceedToCreate(
            uploadedFiles, 
            formData.name, 
            formData.category
          ),
          startIcon: submitting ? <CircularProgress size={20} /> : <PublishIcon />,
          children: submitting ? 'Creating Agent...' : 'Create Agent'
        };
      
      default:
        return baseProps;
    }
  };

  // ===== MAIN COMPONENT RENDER =====
  
  const drawerContent = (
    <Box sx={{ 
      width: drawerWidth, 
      minWidth: UI_CONSTANTS.DRAWER_RESPONSIVE_CONFIG.minWidth,
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      
      {/* ===== HEADER SECTION ===== */}
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
            aria-label="Close upload drawer"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
          {UPLOAD_STEPS[activeStep].description}
        </Typography>
      </Paper>

      {/* ===== PROGRESS STEPPER ===== */}
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

      {/* ===== MAIN CONTENT AREA ===== */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3 }}>
        
        {/* Status Messages */}
        {error && (
          <Alert 
            severity="error" 
            onClose={() => setError(null)} 
            sx={{ mb: 2 }}
            data-testid="error-alert"
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert 
            severity="success" 
            sx={{ mb: 2 }}
            data-testid="success-alert"
          >
            {success}
          </Alert>
        )}

        {/* Step Content - Remove form wrapper */}
        {renderStepContent(activeStep)}
      </Box>

      {/* ===== FOOTER ACTIONS ===== */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 0,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Stack direction="row" spacing={2} justifyContent="space-between">
          
          {/* Back Button */}
          <Button
            onClick={handleBack}
            disabled={activeStep === 0 || submitting}
            data-testid="back-button"
          >
            Back
          </Button>
          
          {/* Action Buttons */}
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={submitting}
              data-testid="cancel-button"
            >
              Cancel
            </Button>
            
            <Button
              {...getNextButtonProps()}
              data-testid="next-button"
            />
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );

  // ===== DRAWER COMPONENT =====
  
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: drawerWidth,
          minWidth: UI_CONSTANTS.DRAWER_RESPONSIVE_CONFIG.minWidth,
          // Ensure proper responsive behavior
          maxWidth: isMobile || isTablet ? '100vw' : drawerWidth,
        },
      }}
      data-testid="upload-agent-drawer"
    >
      {drawerContent}
    </Drawer>
  );
};
