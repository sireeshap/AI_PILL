import { useState, useCallback } from 'react';
import { AgentFormData, FileUpload } from './types';
import { validateFile, mockValidatePackage } from './utils';
import { fetchClient } from '../../../services/api';

export const useUploadAgent = (onAgentCreated: () => void, onClose: () => void) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<AgentFormData>({
    name: '',
    description: '',
    visibility: 'private',
    agent_type: '',
    category: '',
    tags: [],
    is_active: true,
    github_link: '',
  });
  
  const [currentTag, setCurrentTag] = useState('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [copyrightConfirmed, setCopyrightConfirmed] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [validationProgress, setValidationProgress] = useState(0);

  const resetForm = useCallback(() => {
    setActiveStep(0);
    setFormData({
      name: '',
      description: '',
      visibility: 'private',
      agent_type: '',
      category: '',
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
  }, []);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectChange = useCallback((event: any) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleAddTag = useCallback(() => {
    const newTag = currentTag.trim().toLowerCase();
    if (newTag && !formData.tags.includes(newTag)) {
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

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const newFiles: FileUpload[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validationError = validateFile(file, formData.category);
      
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

    setUploadedFiles(prev => {
      const updated = [...prev, ...newFiles];
      // Start upload for new files
      newFiles.forEach((_, index) => {
        const fileIndex = prev.length + index;
        setTimeout(() => startFileUpload(fileIndex), 100);
      });
      return updated;
    });
    setError(null);
  }, [formData.category]);

  const startFileUpload = useCallback((fileIndex: number) => {
    setUploadedFiles(prev => prev.map((file, index) => {
      if (index === fileIndex) {
        return { ...file, status: 'uploading' };
      }
      return file;
    }));

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadedFiles(prev => prev.map((file, index) => {
        if (index === fileIndex && file.status === 'uploading') {
          const newProgress = Math.min(file.progress + Math.random() * 15, 100);
          if (newProgress >= 100) {
            return { ...file, progress: 100, status: 'uploaded' };
          }
          return { ...file, progress: newProgress };
        }
        return file;
      }));
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setUploadedFiles(prev => prev.map((file, index) => {
        if (index === fileIndex) {
          return { ...file, status: 'uploaded', progress: 100 };
        }
        return file;
      }));
    }, 2000 + Math.random() * 1000);
  }, []);

  const startValidation = useCallback(async () => {
    console.log('Starting validation for files:', uploadedFiles);
    setActiveStep(1);
    setValidationProgress(0);
    
    for (let i = 0; i < uploadedFiles.length; i++) {
      console.log(`Validating file ${i + 1}/${uploadedFiles.length}:`, uploadedFiles[i].file.name);
      
      setUploadedFiles(prev => prev.map((file, index) => {
        if (index === i) {
          return { ...file, status: 'validating' };
        }
        return file;
      }));

      // Simulate validation progress
      const progressInterval = setInterval(() => {
        setValidationProgress(prev => Math.min(prev + 2, 95));
      }, 100);

      try {
        const validationResults = await mockValidatePackage(uploadedFiles[i].file);
        
        clearInterval(progressInterval);
        setValidationProgress(100);

        setUploadedFiles(prev => prev.map((file, index) => {
          if (index === i) {
            const hasErrors = validationResults.errors.length > 0;
            const newStatus = hasErrors ? 'error' : 'validated';
            console.log(`File ${file.file.name} validation result:`, newStatus, validationResults);
            return { 
              ...file, 
              status: newStatus,
              validationResults,
              error: hasErrors ? validationResults.errors.join(', ') : undefined
            };
          }
          return file;
        }));

        // Brief pause between files
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Validation error for file:', uploadedFiles[i].file.name, error);
        clearInterval(progressInterval);
        setUploadedFiles(prev => prev.map((file, index) => {
          if (index === i) {
            return { ...file, status: 'error', error: 'Validation failed' };
          }
          return file;
        }));
      }
    }

    // After all validations, automatically move to step 2
    console.log('All files validated, moving to step 2');
    setTimeout(() => {
      setActiveStep(2);
    }, 1000);
  }, [uploadedFiles]);

  const removeFile = useCallback((index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    if (uploadedFiles.length === 1) {
      setActiveStep(0);
    }
  }, [uploadedFiles.length]);

  const handleNext = useCallback(() => {
    console.log('handleNext called, activeStep:', activeStep);
    if (activeStep === 0) {
      console.log('Starting validation...');
      startValidation();
    } else if (activeStep === 1) {
      console.log('Moving to step 2 (Review & Submit)');
      setActiveStep(2);
    }
  }, [activeStep, startValidation]);

  const handleBack = useCallback(() => {
    setActiveStep(prev => Math.max(0, prev - 1));
  }, []);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert("1")
    console.log('handleSubmit called!');
    console.log('Form data:', formData);
    console.log('Uploaded files:', uploadedFiles);
    console.log('Copyright confirmed:', copyrightConfirmed);
    
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Step 1: Upload files first if there are any
      let fileIds: string[] = [];
      
      if (uploadedFiles.length > 0) {
        console.log('Uploading files...');
        
        for (const fileUpload of uploadedFiles) {
          const fileFormData = new FormData();
          fileFormData.append('files', fileUpload.file);
          fileFormData.append('agent_category', formData.category);
          
          console.log('Uploading file:', fileUpload.file.name, 'Category:', formData.category);
          
          // Upload file using the files/agents endpoint
          const response = await fetchClient<any>('/files/agents', {
            method: 'POST',
            body: fileFormData,
            headers: {}, // Let browser set Content-Type for FormData
          });
          
          console.log('File upload response:', response);
          
          // Extract file IDs from response
          if (response && Array.isArray(response)) {
            fileIds.push(...response.map((file: any) => file.id));
          }
        }
        console.log('Files uploaded successfully, IDs:', fileIds);
      }

      // Step 2: Create agent with file IDs
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        visibility: formData.visibility,
        agent_type: formData.agent_type.trim(),
        category: formData.category,
        tags: formData.tags,
        github_link: formData.github_link?.trim() || undefined,
        file_refs: fileIds, // Use actual file IDs from upload
        is_active: formData.is_active,
        copyright_confirmed: copyrightConfirmed
      };

      console.log('Creating agent with payload:', payload);

      await fetchClient('/agents/', {
        method: 'POST',
        body: payload
      });

      console.log('Agent created successfully!');
      setSuccess('Agent created successfully!');
      
      setTimeout(() => {
        onAgentCreated();
        onClose();
      }, 1500);

    } catch (err: any) {
      console.error('Failed to create agent:', err);
      let errorMessage = err.message || 'Failed to create agent.';
      
      if (err.message && err.message.includes('401')) {
        errorMessage = 'Session expired. Please log in again.';
      } else if (err.message && err.message.includes('validation error')) {
        errorMessage = `Validation Error: ${err.message}`;
      } else if (err.message && err.message.includes('category')) {
        errorMessage = 'Please select a valid category for your agent.';
      } else if (err.message && err.message.includes('name')) {
        errorMessage = 'Please provide a valid name for your agent.';
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }, [formData, uploadedFiles, copyrightConfirmed, onAgentCreated, onClose]);

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
