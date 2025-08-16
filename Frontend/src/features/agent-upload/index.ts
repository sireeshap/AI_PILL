/**
 * @fileoverview Main Export for Agent Upload Feature
 * @author Enterprise Architecture Team
 * @version 1.0.0
 * 
 * This is the main entry point for the agent upload feature module.
 * Following enterprise architecture patterns for clean module boundaries.
 */

// ===== MAIN COMPONENT EXPORTS =====
export { AgentUploadDrawer } from './components';

// ===== HOOK EXPORTS =====
export { useUploadAgent } from './hooks/useUploadAgent';

// ===== SERVICE EXPORTS =====
export {
  fileValidationService,
  agentCreationService,
  fileUploadService,
  analyticsService,
  ServiceFactory
} from './services';

// ===== UTILITY EXPORTS =====
export * from './utils';

// ===== VALIDATOR EXPORTS =====
export {
  validateFile,
  validateAgentFormData,
  validateGitHubUrl,
  canProceedToValidation,
  canProceedToCreate,
  validateBusinessRules
} from './validators';

// ===== CONSTANT EXPORTS =====
export {
  UPLOAD_STEPS,
  AGENT_CATEGORIES,
  SUPPORTED_FORMATS_BY_CATEGORY,
  MAX_FILE_SIZE,
  MAX_TAGS_PER_AGENT,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  UI_CONSTANTS
} from './constants';

// ===== TYPE EXPORTS =====
export type {
  // Core domain types
  AgentFormData,
  FileUpload,
  PackageValidationResults,
  UploadAgentDrawerProps,
  
  // Enum types
  AgentVisibility,
  AgentCategory,
  FileUploadStatus,
  UploadStep,
  
  // Component prop types
  StepOneProps,
  StepTwoProps,
  StepThreeProps,
  
  // Service interface types
  FileValidationService,
  AgentCreationService,
  AgentCreationPayload,
  
  // Hook return types
  UseUploadAgentReturn,
  
  // Error types
  UploadError,
  ValidationErrorDetails
} from './types';
