/**
 * @fileoverview Custom hook for Agent Upload Feature
 * @author Enterprise Architecture Team
 * @version 1.0.0
 * 
 * This custom hook encapsulates all agent upload logic following React best practices
 * and enterprise patterns for state management, side effects, and error handling.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  AgentFormData, 
  FileUpload, 
  UseUploadAgentReturn,
  UploadStep,
  UploadError,
  AgentCreationPayload
} from '../types';
import { 
  canProceedToValidation, 
  canProceedToCreate,
  validateBusinessRules 
} from '../validators';
import { 
  fileValidationService,
  agentCreationService,
  fileUploadService,
  analyticsService
} from '../services';
import { SUCCESS_MESSAGES } from '../constants';
import { fetchClient } from '../../../services/api';

/**
 * Custom hook for managing agent upload workflow
 * Provides comprehensive state management and business logic for the upload process
 * 
 * @param onAgentCreated - Callback fired when agent is successfully created
 * @param onClose - Callback fired when upload process should close
 * @returns Object containing state and actions for upload workflow
 */
export const useUploadAgent = (
  onAgentCreated: () => void, 
  onClose: () => void
): UseUploadAgentReturn => {
  
  // ===== STATE MANAGEMENT =====
  
  const [activeStep, setActiveStep] = useState<UploadStep>(0);
  const [formData, setFormData] = useState<AgentFormData>({
    name: '',
    description: '',
    visibility: 'private',
    agent_type: '',
    category: 'web-based', // Set default category
    tags: [],
    is_active: true,
    github_link: '',
  });
  
  const [currentTag, setCurrentTag] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [copyrightConfirmed, setCopyrightConfirmed] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [validationProgress, setValidationProgress] = useState(0);

  // ===== REFS FOR CLEANUP =====
  
  const uploadStartTime = useRef<number>(0);
  const validationStartTime = useRef<number>(0);
  const isMounted = useRef(true);

  // ===== CLEANUP ON UNMOUNT =====
  
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // ===== FORM RESET =====
  
  const resetForm = useCallback(() => {
    setActiveStep(0);
    setFormData({
      name: '',
      description: '',
      visibility: 'private',
      agent_type: '',
      category: 'web-based', // Set default category
      tags: [],
      is_active: true,
      github_link: '',
    });
    setCurrentTag('');
    setError(null);
    setSuccess(null);
    setSubmitting(false);
    setUploadedFiles([]);
    setCopyrightConfirmed(false);
    setDragActive(false);
    setValidationProgress(0);
    uploadStartTime.current = 0;
    validationStartTime.current = 0;
  }, []);

  // ===== FORM HANDLERS =====
  
  const handleChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (error) {
      setError(null);
    }
  }, [error]);

  const handleSelectChange = useCallback((event: any) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user makes selection
    if (error) {
      setError(null);
    }
  }, [error]);

  // ===== TAG MANAGEMENT =====
  
  const handleAddTag = useCallback(() => {
    const newTag = currentTag.trim().toLowerCase();
    if (newTag && !formData.tags.includes(newTag) && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setCurrentTag('');
    }
  }, [currentTag, formData.tags]);

  const handleDeleteTag = useCallback((tagToDelete: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToDelete)
    }));
  }, []);

  // ===== FILE MANAGEMENT =====
  
  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || !isMounted.current) return;

    const newFiles: FileUpload[] = [];
    
    // Validate each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validationError = fileValidationService.validateFile(file, formData.category);
      
      if (validationError) {
        setError(validationError);
        return;
      }

      newFiles.push({
        file,
        progress: 0,
        status: 'pending'
      });
    }

    // Update files first, then start uploads
    setUploadedFiles(prev => {
      const updatedFiles = [...prev, ...newFiles];
      
      // Start upload analytics tracking
      uploadStartTime.current = Date.now();
      analyticsService.trackUploadStart(formData.category, newFiles.length);

      // Start upload for new files with proper file references
      newFiles.forEach((newFile, index) => {
        const fileIndex = prev.length + index;
        setTimeout(() => startFileUpload(fileIndex, newFile.file), 100);
      });

      return updatedFiles;
    });
    
    setError(null);
  }, [formData.category]);

  const startFileUpload = useCallback(async (fileIndex: number, file: File) => {
    if (!isMounted.current) return;

    setUploadedFiles(prev => prev.map((fileUpload, index) => {
      if (index === fileIndex) {
        return { ...fileUpload, status: 'uploading' };
      }
      return fileUpload;
    }));

    try {
      await fileUploadService.uploadFile(file, (progress) => {
        if (!isMounted.current) return;
        
        setUploadedFiles(prev => prev.map((fileUpload, index) => {
          if (index === fileIndex) {
            return { ...fileUpload, progress };
          }
          return fileUpload;
        }));
      });

      // Mark as uploaded
      if (isMounted.current) {
        setUploadedFiles(prev => prev.map((fileUpload, index) => {
          if (index === fileIndex) {
            return { ...fileUpload, status: 'uploaded', progress: 100 };
          }
          return fileUpload;
        }));
      }

    } catch (error) {
      if (!isMounted.current) return;
      
      const uploadError = error as UploadError;
      analyticsService.trackError(uploadError, { fileIndex });
      
      setUploadedFiles(prev => prev.map((fileUpload, index) => {
        if (index === fileIndex) {
          return { 
            ...fileUpload, 
            status: 'error', 
            error: uploadError.message 
          };
        }
        return fileUpload;
      }));
    }
  }, []);

  const removeFile = useCallback((index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    
    // Reset to first step if no files remain
    if (uploadedFiles.length === 1) {
      setActiveStep(0);
    }
  }, [uploadedFiles.length]);

  // ===== VALIDATION WORKFLOW =====
  
  const startValidation = useCallback(async () => {
    if (!isMounted.current) return;

    setActiveStep(1);
    setValidationProgress(0);
    validationStartTime.current = Date.now();
    
    for (let i = 0; i < uploadedFiles.length; i++) {
      if (!isMounted.current) break;

      setUploadedFiles(prev => prev.map((file, index) => {
        if (index === i) {
          return { ...file, status: 'validating' };
        }
        return file;
      }));

      // Simulate validation progress
      const progressInterval = setInterval(() => {
        if (!isMounted.current) {
          clearInterval(progressInterval);
          return;
        }
        setValidationProgress(prev => Math.min(prev + 2, 95));
      }, 100);

      try {
        const validationResults = await fileValidationService.validatePackage(
          uploadedFiles[i].file
        );
        
        clearInterval(progressInterval);
        
        if (!isMounted.current) return;
        
        setValidationProgress(100);

        // Track validation metrics
        const duration = Date.now() - validationStartTime.current;
        analyticsService.trackValidation(validationResults, duration);

        setUploadedFiles(prev => prev.map((file, index) => {
          if (index === i) {
            const hasErrors = validationResults.errors.length > 0;
            return { 
              ...file, 
              status: hasErrors ? 'error' : 'validated',
              validationResults,
              error: hasErrors ? validationResults.errors.join(', ') : undefined
            };
          }
          return file;
        }));

        // Brief pause between files
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        clearInterval(progressInterval);
        
        if (!isMounted.current) return;
        
        const validationError = error as UploadError;
        analyticsService.trackError(validationError, { fileIndex: i });
        
        setUploadedFiles(prev => prev.map((file, index) => {
          if (index === i) {
            return { ...file, status: 'error', error: validationError.message };
          }
          return file;
        }));
      }
    }

    // Check if all files are validated successfully and proceed to next step
    if (isMounted.current) {
      const allValid = uploadedFiles.every(file => 
        file.status === 'validated' || 
        (file.validationResults && file.validationResults.errors.length === 0)
      );

      if (allValid) {
        setActiveStep(2); // Move to agent details step after validation
      }
    }
  }, [uploadedFiles]);

  // ===== NAVIGATION =====
  
  const handleNext = useCallback(() => {
    if (activeStep === 0) {
      // Validate business rules before proceeding
      const businessRuleError = validateBusinessRules(
        formData,
        copyrightConfirmed,
        uploadedFiles.length > 0
      );
      
      if (businessRuleError) {
        setError(businessRuleError);
        return;
      }
      
      startValidation();
    } else if (activeStep === 1) {
      setActiveStep(2);
    } else if (activeStep === 2) {
      // Validate agent details before proceeding to review
      if (!formData.name.trim()) {
        setError('Agent name is required');
        return;
      }
      setActiveStep(3);
    }
  }, [activeStep, formData, copyrightConfirmed, uploadedFiles.length, startValidation]);

  const handleBack = useCallback(() => {
    setActiveStep(prev => Math.max(0, prev - 1) as UploadStep);
    setError(null);
  }, []);

  // ===== AGENT CREATION =====
  
  const handleSubmit = useCallback(async () => {
    if (!isMounted.current) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Step 1: Upload files first if there are any
      let fileIds: string[] = [];
      
      if (uploadedFiles.length > 0) {
        console.log('Uploading files...');
        
        for (const fileUpload of uploadedFiles) {
          try {
            const fileFormData = new FormData();
            fileFormData.append('files', fileUpload.file);
            fileFormData.append('agent_category', formData.category);
            
            // Upload file using the files/agents endpoint
            const response = await fetchClient<any>('/files/agents', {
              method: 'POST',
              body: fileFormData,
              headers: {}, // Let browser set Content-Type for FormData
            });
            
            // Extract file IDs from response
            if (response && Array.isArray(response)) {
              fileIds.push(...response.map((file: any) => file.id));
            }
          } catch (fileUploadError: any) {
            // Handle file upload errors specifically
            const errorMessage = fileUploadError?.message || 
                               fileUploadError?.detail || 
                               `Failed to upload file: ${fileUpload.file.name}`;
            throw new Error(`File Upload Error: ${errorMessage}`);
          }
        }
        console.log('Files uploaded successfully, IDs:', fileIds);
      }

      // Step 2: Create agent with file IDs
      const payload: AgentCreationPayload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        visibility: formData.visibility,
        agent_type: formData.agent_type.trim(),
        category: formData.category,
        tags: formData.tags,
        github_link: formData.github_link?.trim() || undefined,
        file_refs: fileIds, // Use actual file IDs
        is_active: formData.is_active,
        copyright_confirmed: copyrightConfirmed,
        validation_results: uploadedFiles.map(file => file.validationResults)
      };

      await agentCreationService.createAgent(payload);

      if (!isMounted.current) return;

      // Track successful completion
      const totalDuration = Date.now() - uploadStartTime.current;
      analyticsService.trackUploadComplete(formData.category, totalDuration, true);

      setSuccess(SUCCESS_MESSAGES.AGENT_CREATED);
      
      // Navigate away after success
      setTimeout(() => {
        if (isMounted.current) {
          onAgentCreated();
          onClose();
        }
      }, 1500);

    } catch (error) {
      if (!isMounted.current) return;
      
      console.error('Agent creation failed:', error);
      
      const creationError = error as UploadError;
      analyticsService.trackError(creationError, { step: 'creation' });
      
      // Track failed completion
      const totalDuration = Date.now() - uploadStartTime.current;
      analyticsService.trackUploadComplete(formData.category, totalDuration, false);
      
      // Extract meaningful error message
      let errorMessage = creationError.message;
      if (creationError.message?.includes('File format')) {
        errorMessage = `❌ ${creationError.message}\n\nPlease upload your agent as a complete package in one of the supported archive formats.`;
      } else if (creationError.message?.includes('not supported')) {
        errorMessage = `❌ File format not supported for ${formData.category} agents.\n\nPlease package your agent files into a ZIP archive and try again.`;
      } else if (!errorMessage || errorMessage === 'Failed to fetch') {
        errorMessage = '❌ Failed to create agent. Please check your connection and try again.';
      }
      
      setError(errorMessage);
    } finally {
      if (isMounted.current) {
        setSubmitting(false);
      }
    }
  }, [
    formData, 
    uploadedFiles, 
    copyrightConfirmed, 
    onAgentCreated, 
    onClose
  ]);

  // ===== RETURN HOOK INTERFACE =====
  
  return {
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
  };
};
