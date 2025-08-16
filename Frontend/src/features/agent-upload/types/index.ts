/**
 * @fileoverview Type definitions for Agent Upload Feature
 * @author Enterprise Architecture Team
 * @version 1.0.0
 * 
 * This module contains all TypeScript type definitions used across the agent upload feature.
 * Following enterprise standards for type safety and maintainability.
 */

// ===== CORE DOMAIN TYPES =====

/**
 * Represents the form data structure for creating a new agent
 * @interface AgentFormData
 */
export interface AgentFormData {
  /** The unique name identifier for the agent */
  name: string;
  /** Detailed description of agent capabilities */
  description: string;
  /** Agent visibility level - determines access permissions */
  visibility: AgentVisibility;
  /** Classification of agent type for categorization */
  agent_type: string;
  /** Primary category that defines agent's domain */
  category: AgentCategory;
  /** Searchable tags for agent discovery */
  tags: string[];
  /** Whether the agent is currently active and available */
  is_active: boolean;
  /** Optional GitHub repository URL for source code */
  github_link?: string;
}

/**
 * Represents a file being uploaded with its current state
 * @interface FileUpload
 */
export interface FileUpload {
  /** The actual file object being uploaded */
  file: File;
  /** Upload progress as percentage (0-100) */
  progress: number;
  /** Current status of the file in the upload pipeline */
  status: FileUploadStatus;
  /** Error message if upload/validation fails */
  error?: string;
  /** Results from package validation process */
  validationResults?: PackageValidationResults;
}

/**
 * Results from automated package validation
 * @interface PackageValidationResults
 */
export interface PackageValidationResults {
  /** Whether a main entry point file was detected */
  hasMainFile: boolean;
  /** Whether dependency files were found */
  hasDependencies: boolean;
  /** Whether documentation (README) was found */
  hasReadme: boolean;
  /** Whether configuration files were detected */
  hasConfig: boolean;
  /** Discovered package file structure */
  packageStructure: string[];
  /** Non-blocking warnings for missing recommended files */
  warnings: string[];
  /** Critical errors that prevent agent creation */
  errors: string[];
}

// ===== ENUMS AND UNION TYPES =====

/**
 * Possible visibility levels for agents
 */
export type AgentVisibility = 'private' | 'public';

/**
 * Available agent categories with their characteristics
 */
export type AgentCategory = 
  | 'web-based'
  | 'local-opensource' 
  | 'customgpt'
  | 'conversational'
  | 'document-processor'
  | 'code-assistant'
  | 'content-creator'
  | 'data-analyst'
  | 'automation'
  | 'other';

/**
 * File upload pipeline status
 */
export type FileUploadStatus = 
  | 'pending'     // File selected but not yet uploading
  | 'uploading'   // File is being uploaded
  | 'uploaded'    // Upload completed successfully
  | 'validating'  // Package is being validated
  | 'validated'   // Validation completed successfully
  | 'error';      // Error occurred during upload or validation

/**
 * Upload process step identifiers
 */
export type UploadStep = 0 | 1 | 2 | 3;

// ===== COMPONENT PROP INTERFACES =====

/**
 * Props for the main upload drawer component
 * @interface UploadAgentDrawerProps
 */
export interface UploadAgentDrawerProps {
  /** Whether the drawer is currently open */
  open: boolean;
  /** Callback fired when drawer should be closed */
  onClose: () => void;
  /** Callback fired when agent is successfully created */
  onAgentCreated: () => void;
}

/**
 * Props for step one (file upload and basic info) component
 * @interface StepOneProps
 */
export interface StepOneProps {
  /** Current form data state */
  formData: AgentFormData;
  /** List of uploaded files with their states */
  uploadedFiles: FileUpload[];
  /** Whether copyright confirmation is checked */
  copyrightConfirmed: boolean;
  /** Whether drag area is currently active */
  dragActive: boolean;
  /** Whether form is currently submitting */
  submitting: boolean;
  /** Handler for form field changes */
  onFormChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  /** Handler for select field changes */
  onSelectChange: (event: any) => void;
  /** Handler for file selection */
  onFileSelect: (files: FileList | null) => void;
  /** Handler for file drop events */
  onFileDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  /** Handler for drag over events */
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  /** Handler for drag leave events */
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  /** Handler for removing a file */
  onRemoveFile: (index: number) => void;
  /** Handler for copyright confirmation change */
  onCopyrightChange: (confirmed: boolean) => void;
}

/**
 * Props for step two (validation) component
 * @interface StepTwoProps
 */
export interface StepTwoProps {
  /** List of files being validated */
  uploadedFiles: FileUpload[];
  /** Overall validation progress percentage */
  validationProgress: number;
}

/**
 * Props for step three (agent details) component
 * @interface StepThreeProps
 */
export interface StepThreeProps {
  /** Current form data state */
  formData: AgentFormData;
  /** Whether form is currently submitting */
  submitting: boolean;
  /** Handler for form field changes */
  onFormChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  /** Handler for select field changes */
  onSelectChange: (event: any) => void;
}

/**
 * Props for step four (review and submit) component
 * @interface StepFourProps
 */
export interface StepFourProps {
  /** Current form data state */
  formData: AgentFormData;
  /** List of validated files */
  uploadedFiles: FileUpload[];
  /** Current tag being typed */
  currentTag: string;
  /** Whether form is currently submitting */
  submitting: boolean;
  /** Handler for tag input changes */
  onTagChange: (tag: string) => void;
  /** Handler for adding a new tag */
  onAddTag: () => void;
  /** Handler for deleting a tag */
  onDeleteTag: (tag: string) => void;
}

// ===== SERVICE INTERFACES =====

/**
 * Interface for file validation service
 * @interface FileValidationService
 */
export interface FileValidationService {
  /** Validates a file based on category requirements */
  validateFile(file: File, category: AgentCategory): string | null;
  /** Performs package content validation */
  validatePackage(file: File): Promise<PackageValidationResults>;
}

/**
 * Interface for agent creation service
 * @interface AgentCreationService
 */
export interface AgentCreationService {
  /** Creates a new agent with provided data */
  createAgent(data: AgentCreationPayload): Promise<void>;
}

/**
 * Payload structure for agent creation API
 * @interface AgentCreationPayload
 */
export interface AgentCreationPayload {
  name: string;
  description: string;
  visibility: AgentVisibility;
  agent_type: string;
  category: AgentCategory;
  tags: string[];
  github_link?: string;
  file_refs: string[];
  is_active: boolean;
  copyright_confirmed: boolean;
  validation_results: (PackageValidationResults | undefined)[];
}

// ===== HOOK RETURN TYPES =====

/**
 * Return type for the upload agent hook
 * @interface UseUploadAgentReturn
 */
export interface UseUploadAgentReturn {
  // State
  activeStep: UploadStep;
  formData: AgentFormData;
  currentTag: string;
  submitting: boolean;
  error: string | null;
  success: string | null;
  uploadedFiles: FileUpload[];
  copyrightConfirmed: boolean;
  dragActive: boolean;
  validationProgress: number;
  
  // Actions
  resetForm: () => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (event: any) => void;
  handleAddTag: () => void;
  handleDeleteTag: (tagToDelete: string) => void;
  handleFileSelect: (files: FileList | null) => void;
  removeFile: (index: number) => void;
  handleNext: () => void;
  handleBack: () => void;
  handleSubmit: () => void;
  
  // Setters
  setCurrentTag: (tag: string) => void;
  setCopyrightConfirmed: (confirmed: boolean) => void;
  setDragActive: (active: boolean) => void;
  setError: (error: string | null) => void;
}

// ===== ERROR TYPES =====

/**
 * Custom error class for upload-related errors
 */
export class UploadError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'UploadError';
  }
}

/**
 * Validation error details
 * @interface ValidationErrorDetails
 */
export interface ValidationErrorDetails {
  field: string;
  message: string;
  code: string;
}
