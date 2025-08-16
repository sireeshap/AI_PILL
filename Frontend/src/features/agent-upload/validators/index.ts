/**
 * @fileoverview Validation utilities for Agent Upload Feature
 * @author Enterprise Architecture Team
 * @version 1.0.0
 * 
 * This module provides comprehensive validation functions following enterprise
 * standards for data validation, security, and business rule enforcement.
 */

import { 
  AgentCategory, 
  AgentFormData, 
  PackageValidationResults,
  ValidationErrorDetails 
} from '../types';
import { 
  MAX_FILE_SIZE,
  SUPPORTED_FORMATS_BY_CATEGORY,
  FILE_VALIDATION_RULES,
  ERROR_MESSAGES
} from '../constants';

// ===== FILE VALIDATION =====

/**
 * Validates a file based on size, format, and category requirements
 * @param file - The file to validate
 * @param category - The selected agent category
 * @returns Validation error message or null if valid
 */
export const validateFile = (file: File, category?: AgentCategory): string | null => {
  // File size validation
  if (file.size > MAX_FILE_SIZE) {
    return ERROR_MESSAGES.FILE_TOO_LARGE;
  }

  // Category selection validation
  if (!category) {
    return ERROR_MESSAGES.CATEGORY_REQUIRED;
  }

  // Format validation
  const formatError = validateFileFormat(file, category);
  if (formatError) {
    return formatError;
  }

  return null;
};

/**
 * Validates file format against category requirements
 * @param file - The file to validate
 * @param category - The agent category
 * @returns Validation error message or null if valid
 */
export const validateFileFormat = (file: File, category: AgentCategory): string | null => {
  const allowedFormats = SUPPORTED_FORMATS_BY_CATEGORY[category] || [];
  const detectedExtension = getFileExtension(file.name);
  
  if (!allowedFormats.includes(detectedExtension)) {
    return `Please upload a complete agent package. Only bundled formats are accepted: ${allowedFormats.join(', ')}. Individual files like ${detectedExtension} are not sufficient for AI agents.`;
  }

  return null;
};

/**
 * Extracts file extension handling compound extensions
 * @param fileName - Name of the file
 * @returns Detected file extension
 */
export const getFileExtension = (fileName: string): string => {
  const lowercaseName = fileName.toLowerCase();
  
  // Handle compound extensions
  if (lowercaseName.endsWith('.tar.gz')) {
    return '.tar.gz';
  }
  if (lowercaseName.endsWith('.tar.xz')) {
    return '.tar.xz';
  }
  if (lowercaseName.endsWith('.tar.bz2')) {
    return '.tar.bz2';
  }
  
  // Handle simple extensions
  const lastDotIndex = fileName.lastIndexOf('.');
  return lastDotIndex !== -1 ? fileName.substring(lastDotIndex).toLowerCase() : '';
};

// ===== FORM VALIDATION =====

/**
 * Validates agent form data
 * @param formData - The form data to validate
 * @returns Array of validation error details
 */
export const validateAgentFormData = (formData: AgentFormData): ValidationErrorDetails[] => {
  const errors: ValidationErrorDetails[] = [];

  // Name validation
  if (!formData.name?.trim()) {
    errors.push({
      field: 'name',
      message: ERROR_MESSAGES.NAME_REQUIRED,
      code: 'REQUIRED_FIELD'
    });
  } else if (formData.name.trim().length < 3) {
    errors.push({
      field: 'name',
      message: 'Agent name must be at least 3 characters long',
      code: 'MIN_LENGTH'
    });
  } else if (formData.name.trim().length > 100) {
    errors.push({
      field: 'name',
      message: 'Agent name must not exceed 100 characters',
      code: 'MAX_LENGTH'
    });
  }

  // Category validation
  if (!formData.category) {
    errors.push({
      field: 'category',
      message: ERROR_MESSAGES.CATEGORY_REQUIRED,
      code: 'REQUIRED_FIELD'
    });
  }

  // Description validation (optional but with limits)
  if (formData.description && formData.description.length > 1000) {
    errors.push({
      field: 'description',
      message: 'Description must not exceed 1000 characters',
      code: 'MAX_LENGTH'
    });
  }

  // GitHub link validation
  if (formData.github_link) {
    const githubUrlError = validateGitHubUrl(formData.github_link);
    if (githubUrlError) {
      errors.push({
        field: 'github_link',
        message: githubUrlError,
        code: 'INVALID_URL'
      });
    }
  }

  // Tags validation
  if (formData.tags.length > 10) {
    errors.push({
      field: 'tags',
      message: 'Maximum 10 tags allowed',
      code: 'MAX_ITEMS'
    });
  }

  return errors;
};

/**
 * Validates GitHub URL format
 * @param url - The URL to validate
 * @returns Validation error message or null if valid
 */
export const validateGitHubUrl = (url: string): string | null => {
  if (!url.trim()) return null; // Optional field
  
  try {
    const urlObj = new URL(url);
    
    // Must be HTTPS
    if (urlObj.protocol !== 'https:') {
      return 'GitHub URL must use HTTPS protocol';
    }
    
    // Must be GitHub domain
    if (!urlObj.hostname.includes('github.com')) {
      return 'URL must be a valid GitHub repository';
    }
    
    // Must have valid path structure
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    if (pathParts.length < 2) {
      return 'GitHub URL must include both username and repository name';
    }
    
    return null;
  } catch (error) {
    return 'Please enter a valid GitHub URL';
  }
};

// ===== PACKAGE VALIDATION =====

/**
 * Real package validation that analyzes actual ZIP file contents
 * @param file - The package file to validate
 * @returns Promise resolving to validation results with actual file structure
 */
export const validatePackage = async (file: File): Promise<PackageValidationResults> => {
  return new Promise((resolve, reject) => {
    if (!file.name.toLowerCase().endsWith('.zip')) {
      resolve(createValidationResults([], [], ['Only ZIP files are currently supported for package analysis']));
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        if (!arrayBuffer) {
          reject(new Error('Failed to read file'));
          return;
        }

        // Use JSZip to analyze the ZIP file contents
        const JSZip = (await import('jszip')).default;
        const zip = await JSZip.loadAsync(arrayBuffer);
        
        const fileList: string[] = [];
        const actualFiles: string[] = [];
        
        // Extract all file paths from the ZIP
        zip.forEach((relativePath, file) => {
          if (!file.dir) {
            fileList.push(relativePath);
            actualFiles.push(relativePath);
          } else {
            fileList.push(relativePath + '/');
          }
        });

        // Analyze the extracted structure
        const results = analyzeActualPackageStructure(actualFiles);
        results.packageStructure = fileList.sort();
        
        resolve(results);
      } catch (error) {
        console.error('ZIP analysis failed:', error);
        resolve(createValidationResults([], [], ['Failed to analyze package structure. Please ensure it\'s a valid ZIP file.']));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsArrayBuffer(file);
  });
};

/**
 * Creates validation results structure
 */
const createValidationResults = (
  packageStructure: string[],
  warnings: string[],
  errors: string[]
): PackageValidationResults => {
  return {
    hasMainFile: false,
    hasDependencies: false,
    hasReadme: false,
    hasConfig: false,
    packageStructure,
    warnings,
    errors
  };
};

/**
 * Analyzes actual package structure from extracted file list
 * @param files - Array of file paths from the ZIP
 * @returns Package validation results
 */
const analyzeActualPackageStructure = (files: string[]): PackageValidationResults => {
  const warnings: string[] = [];
  const errors: string[] = [];
  
  // Analyze for main files
  const hasMainFile = files.some(file => 
    FILE_VALIDATION_RULES.MAIN_FILE_INDICATORS.some(indicator => 
      file.toLowerCase().includes(indicator)
    )
  );

  // Check for dependencies files
  const hasDependencies = files.some(file => {
    const fileName = file.toLowerCase();
    return fileName.includes('requirements.txt') || 
           fileName.includes('package.json') || 
           fileName.includes('pyproject.toml') ||
           fileName.includes('environment.yml') ||
           fileName.includes('pipfile');
  });

  // Check for README
  const hasReadme = files.some(file => 
    file.toLowerCase().includes('readme')
  );

  // Check for configuration files
  const hasConfig = files.some(file => {
    const fileName = file.toLowerCase();
    return fileName.includes('config') || 
           fileName.includes('.env') ||
           fileName.includes('settings') ||
           fileName.includes('.toml') ||
           fileName.includes('.yaml') ||
           fileName.includes('.yml');
  });

  // Generate warnings for missing recommended files
  if (!hasMainFile) {
    warnings.push('No main entry point file detected (main.py, app.py, index.py, etc.)');
  }
  if (!hasDependencies) {
    warnings.push('No dependencies file found (requirements.txt, package.json, pyproject.toml, etc.)');
  }
  if (!hasReadme) {
    warnings.push('No README file found - documentation is highly recommended');
  }
  if (!hasConfig) {
    warnings.push('No configuration files detected - consider adding config files for better deployment');
  }

  // Check for critical issues
  if (files.length === 0) {
    errors.push('Package appears to be empty');
  } else if (files.length === 1 && files[0].endsWith('.py')) {
    errors.push('Package contains only a single Python file. Please package your agent properly with all dependencies.');
  }

  // Additional validation based on file types
  const pythonFiles = files.filter(f => f.endsWith('.py'));
  const nonPythonFiles = files.filter(f => !f.endsWith('.py') && !f.includes('/'));
  
  if (pythonFiles.length === 0) {
    warnings.push('No Python files detected - make sure this is a Python-based agent');
  }

  return {
    hasMainFile,
    hasDependencies,
    hasReadme,
    hasConfig,
    packageStructure: [], // Will be filled by the calling function
    warnings,
    errors
  };
};

/**
 * Legacy mock validation function - kept for backward compatibility
 * @deprecated Use validatePackage instead for real validation
 */
export const mockValidatePackage = async (file: File): Promise<PackageValidationResults> => {
  console.warn('Using deprecated mockValidatePackage. Consider using validatePackage for real analysis.');
  return validatePackage(file);
};

/**
 * Generates a realistic package structure representation
 * @param hasMainFile - Whether main file exists
 * @param hasDependencies - Whether dependencies file exists
 * @param hasReadme - Whether README file exists
 * @param hasConfig - Whether config file exists
 * @returns Array of file/folder paths
 */
const generatePackageStructure = (
  hasMainFile: boolean,
  hasDependencies: boolean,
  hasReadme: boolean,
  hasConfig: boolean
): string[] => {
  const structure: string[] = ['src/'];

  if (hasMainFile) {
    structure.push('main.py', 'src/app.py');
  }
  
  if (hasDependencies) {
    structure.push('requirements.txt');
  }
  
  if (hasReadme) {
    structure.push('README.md');
  }
  
  if (hasConfig) {
    structure.push('config.json', '.env.example');
  }

  // Always include some common folders
  structure.push('examples/', 'tests/', 'docs/');

  return structure.sort();
};

// ===== BUSINESS RULE VALIDATION =====

/**
 * Validates business rules for agent creation
 * @param formData - Form data to validate
 * @param copyrightConfirmed - Whether copyright is confirmed
 * @param filesUploaded - Whether files are uploaded
 * @returns Validation error message or null if valid
 */
export const validateBusinessRules = (
  formData: AgentFormData,
  copyrightConfirmed: boolean,
  filesUploaded: boolean
): string | null => {
  // Copyright confirmation is mandatory
  if (!copyrightConfirmed) {
    return ERROR_MESSAGES.COPYRIGHT_REQUIRED;
  }

  // At least one file must be uploaded
  if (!filesUploaded) {
    return ERROR_MESSAGES.FILES_REQUIRED;
  }

  // Agent name must be unique (in real implementation, this would call an API)
  if (isAgentNameTaken(formData.name)) {
    return 'An agent with this name already exists. Please choose a different name.';
  }

  return null;
};

/**
 * Checks if agent name is already taken
 * Mock implementation - in production, this would call an API
 * @param name - Agent name to check
 * @returns Whether the name is taken
 */
const isAgentNameTaken = (name: string): boolean => {
  // Mock implementation - randomly simulate name conflicts
  return Math.random() > 0.95; // 5% chance of name conflict
};

// ===== PROGRESS VALIDATION =====

/**
 * Validates if user can proceed to validation step
 * @param uploadedFiles - Array of uploaded files
 * @param category - Selected category
 * @param copyrightConfirmed - Copyright confirmation status
 * @returns Whether user can proceed
 */
export const canProceedToValidation = (
  uploadedFiles: any[],
  category?: string,
  copyrightConfirmed?: boolean
): boolean => {
  return uploadedFiles.length > 0 && 
         uploadedFiles.every(file => file.status === 'uploaded') &&
         !!category &&
         !!copyrightConfirmed;
};

/**
 * Validates if user can proceed to create agent
 * @param uploadedFiles - Array of uploaded files
 * @param name - Agent name
 * @param category - Selected category
 * @returns Whether user can create agent
 */
export const canProceedToCreate = (
  uploadedFiles: any[],
  name?: string,
  category?: string
): boolean => {
  return uploadedFiles.length > 0 && 
         uploadedFiles.every(file => file.status === 'validated') &&
         !!name?.trim() &&
         !!category;
};

/**
 * Checks if user can proceed from validation step to agent details
 * Only allows proceeding if all required components are found
 * @param uploadedFiles - List of uploaded files
 * @returns Whether user can proceed to next step
 */
export const canProceedToAgentDetails = (
  uploadedFiles: any[]
): boolean => {
  if (uploadedFiles.length === 0) {
    return false;
  }

  // All files must be validated successfully
  const allFilesValidated = uploadedFiles.every(file => file.status === 'validated');
  if (!allFilesValidated) {
    return false;
  }

  // At least one file must satisfy the required components
  const hasValidPackage = uploadedFiles.some(file => {
    const results = file.validationResults;
    return results && 
           results.hasMainFile && 
           results.hasDependencies &&
           results.errors.length === 0;
  });

  return hasValidPackage;
};
