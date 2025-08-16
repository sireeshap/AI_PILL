/**
 * @fileoverview Constants for Agent Upload Feature
 * @author Enterprise Architecture Team
 * @version 1.0.0
 * 
 * This module contains all constants used across the agent upload feature.
 * Constants are organized by domain and follow enterprise naming conventions.
 */

import { AgentCategory } from '../types';

// ===== UPLOAD PROCESS CONFIGURATION =====

/**
 * Maximum file size allowed for upload (in bytes)
 * Standard enterprise limit: 100MB
 */
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

/**
 * Maximum number of tags allowed per agent
 */
export const MAX_TAGS_PER_AGENT = 10;

/**
 * Upload timeout duration (in milliseconds)
 */
export const UPLOAD_TIMEOUT = 30000; // 30 seconds

/**
 * Validation timeout duration (in milliseconds)
 */
export const VALIDATION_TIMEOUT = 60000; // 60 seconds

// ===== UPLOAD WORKFLOW STEPS =====

/**
 * Configuration for upload process steps
 * Following UX best practices for multi-step workflows
 */
export const UPLOAD_STEPS = [
  {
    id: 0,
    label: 'Upload Files',
    description: 'Upload your agent package files',
    icon: 'UploadFile',
    estimatedTime: '2-3 minutes'
  },
  {
    id: 1,
    label: 'Validate Package', 
    description: 'Verify package structure and content',
    icon: 'Verified',
    estimatedTime: '1-2 minutes'
  },
  {
    id: 2,
    label: 'Agent Details',
    description: 'Enter agent information and configuration',
    icon: 'Settings',
    estimatedTime: '2-3 minutes'
  },
  {
    id: 3,
    label: 'Review & Submit',
    description: 'Review all details and submit for creation',
    icon: 'Publish',
    estimatedTime: '30 seconds'
  }
] as const;

// ===== AGENT CATEGORY DEFINITIONS =====

/**
 * Agent category metadata with business rules and validation
 * Each category defines specific requirements and supported formats
 */
export const AGENT_CATEGORIES = [
  {
    value: 'web-based' as AgentCategory,
    label: 'Web-Based Platform Agent',
    description: 'Cloud-hosted agents accessible via web dashboard',
    businessDomain: 'Web Applications',
    supportedFormats: ['.zip', '.tar.gz', '.tar.xz', '.tar.bz2'],
    requiredFiles: ['index.html', 'app.js', 'package.json'],
    recommendedFiles: ['README.md', 'config.json', 'docker-compose.yml']
  },
  {
    value: 'local-opensource' as AgentCategory,
    label: 'Local/Open-Source Agent',
    description: 'Downloadable scripts, containers, or packages for local execution',
    businessDomain: 'Open Source',
    supportedFormats: ['.zip', '.tar.gz', '.tar.xz', '.tar.bz2', '.7z', '.rar'],
    requiredFiles: ['main.py', 'requirements.txt'],
    recommendedFiles: ['README.md', 'LICENSE', 'setup.py', 'docker-compose.yml']
  },
  {
    value: 'customgpt' as AgentCategory,
    label: 'CustomGPT-style Agent',
    description: 'GPT-based agents with custom training data and prompts',
    businessDomain: 'Artificial Intelligence',
    supportedFormats: ['.zip', '.tar.gz', '.tar.xz', '.tar.bz2'],
    requiredFiles: ['prompt.txt', 'config.json'],
    recommendedFiles: ['README.md', 'training_data.json', 'examples.md']
  },
  {
    value: 'conversational' as AgentCategory,
    label: 'Conversational AI',
    description: 'Chat bots and interactive dialogue systems',
    businessDomain: 'Customer Service',
    supportedFormats: ['.zip', '.tar.gz', '.tar.xz', '.tar.bz2'],
    requiredFiles: ['bot.py', 'intents.json'],
    recommendedFiles: ['README.md', 'training_data.json', 'responses.json']
  },
  {
    value: 'document-processor' as AgentCategory,
    label: 'Document Processor',
    description: 'PDF, text, and document analysis agents',
    businessDomain: 'Document Management',
    supportedFormats: ['.zip', '.tar.gz', '.tar.xz', '.tar.bz2'],
    requiredFiles: ['processor.py', 'requirements.txt'],
    recommendedFiles: ['README.md', 'sample_documents/', 'output_templates/']
  },
  {
    value: 'code-assistant' as AgentCategory,
    label: 'Code Assistant',
    description: 'Programming and development helper agents',
    businessDomain: 'Software Development',
    supportedFormats: ['.zip', '.tar.gz', '.tar.xz', '.tar.bz2'],
    requiredFiles: ['assistant.py', 'languages.json'],
    recommendedFiles: ['README.md', 'code_templates/', 'examples/']
  },
  {
    value: 'content-creator' as AgentCategory,
    label: 'Content Creator',
    description: 'Writing, design, and creative content generation agents',
    businessDomain: 'Content Marketing',
    supportedFormats: ['.zip', '.tar.gz', '.tar.xz', '.tar.bz2'],
    requiredFiles: ['creator.py', 'templates.json'],
    recommendedFiles: ['README.md', 'content_templates/', 'style_guides/']
  },
  {
    value: 'data-analyst' as AgentCategory,
    label: 'Data Analyst',
    description: 'Data processing, analysis, and visualization agents',
    businessDomain: 'Business Intelligence',
    supportedFormats: ['.zip', '.tar.gz', '.tar.xz', '.tar.bz2'],
    requiredFiles: ['analyzer.py', 'requirements.txt'],
    recommendedFiles: ['README.md', 'sample_data/', 'visualization_templates/']
  },
  {
    value: 'automation' as AgentCategory,
    label: 'Automation Agent',
    description: 'Task automation and workflow orchestration agents',
    businessDomain: 'Process Automation',
    supportedFormats: ['.zip', '.tar.gz', '.tar.xz', '.tar.bz2'],
    requiredFiles: ['automation.py', 'workflows.json'],
    recommendedFiles: ['README.md', 'workflow_templates/', 'schedules.json']
  },
  {
    value: 'other' as AgentCategory,
    label: 'Other',
    description: 'Custom or specialized agent types not covered by standard categories',
    businessDomain: 'General',
    supportedFormats: ['.zip', '.tar.gz', '.tar.xz', '.tar.bz2', '.7z'],
    requiredFiles: ['main.py'],
    recommendedFiles: ['README.md', 'requirements.txt', 'config.json']
  }
] as const;

// ===== FILE FORMAT MAPPINGS =====

/**
 * Supported file formats by agent category
 * Used for validation and UI display
 */
export const SUPPORTED_FORMATS_BY_CATEGORY: Record<AgentCategory, string[]> = {
  'web-based': ['.zip', '.tar.gz', '.tar.xz', '.tar.bz2'],
  'local-opensource': ['.zip', '.tar.gz', '.tar.xz', '.tar.bz2', '.7z', '.rar'],
  'customgpt': ['.zip', '.tar.gz', '.tar.xz', '.tar.bz2'],
  'conversational': ['.zip', '.tar.gz', '.tar.xz', '.tar.bz2'],
  'document-processor': ['.zip', '.tar.gz', '.tar.xz', '.tar.bz2'],
  'code-assistant': ['.zip', '.tar.gz', '.tar.xz', '.tar.bz2'],
  'content-creator': ['.zip', '.tar.gz', '.tar.xz', '.tar.bz2'],
  'data-analyst': ['.zip', '.tar.gz', '.tar.xz', '.tar.bz2'],
  'automation': ['.zip', '.tar.gz', '.tar.xz', '.tar.bz2'],
  'other': ['.zip', '.tar.gz', '.tar.xz', '.tar.bz2', '.7z']
};

// ===== VALIDATION RULES =====

/**
 * Validation rules for different file types
 */
export const FILE_VALIDATION_RULES = {
  /**
   * Archive formats that support compression
   */
  COMPRESSED_FORMATS: ['.zip', '.7z', '.rar'],
  
  /**
   * TAR-based formats
   */
  TAR_FORMATS: ['.tar.gz', '.tar.xz', '.tar.bz2'],
  
  /**
   * File extensions that indicate main entry points
   */
  MAIN_FILE_INDICATORS: ['main', 'app', 'index', 'start', 'run'],
  
  /**
   * Dependency file patterns
   */
  DEPENDENCY_FILE_PATTERNS: [
    'requirements.txt',
    'package.json',
    'environment.yml',
    'conda.yml',
    'pipfile',
    'setup.py',
    'build.gradle',
    'pom.xml'
  ],
  
  /**
   * Configuration file patterns
   */
  CONFIG_FILE_PATTERNS: [
    'config.json',
    'config.yaml',
    'config.yml',
    'settings.json',
    '.env',
    'docker-compose.yml'
  ]
} as const;

// ===== UI/UX CONSTANTS =====

/**
 * UI component sizing and layout constants
 */
export const UI_CONSTANTS = {
  /**
   * Responsive drawer width configuration
   * Desktop: min-content to 40% of screen width
   * Tablet & Mobile: 100% width
   */
  DRAWER_RESPONSIVE_CONFIG: {
    minWidth: 'min-content',
    maxWidthDesktop: '40vw',
    widthTablet: '100vw',
    widthMobile: '100vw',
    breakpoints: {
      mobile: 768,
      tablet: 1024
    }
  },
  
  /**
   * Legacy drawer width (kept for backward compatibility)
   * @deprecated Use DRAWER_RESPONSIVE_CONFIG instead
   */
  DRAWER_WIDTH: 500,
  
  /**
   * Legacy maximum drawer width on mobile (kept for backward compatibility)
   * @deprecated Use DRAWER_RESPONSIVE_CONFIG instead
   */
  DRAWER_MAX_WIDTH: '90vw',
  
  /**
   * Progress bar height
   */
  PROGRESS_BAR_HEIGHT: 8,
  
  /**
   * File upload area minimum height
   */
  UPLOAD_AREA_MIN_HEIGHT: 200,
  
  /**
   * Icon sizes for different contexts
   */
  ICON_SIZES: {
    small: 16,
    medium: 24,
    large: 32,
    xlarge: 48
  }
} as const;

// ===== ERROR MESSAGES =====

/**
 * Standardized error messages for consistency
 */
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
  CATEGORY_REQUIRED: 'Please select an agent category first',
  NAME_REQUIRED: 'Agent name is required',
  COPYRIGHT_REQUIRED: 'Please confirm that your agent is open-source or self-developed',
  FILES_REQUIRED: 'Please upload at least one file for your agent',
  VALIDATION_INCOMPLETE: 'Please wait for all files to finish uploading',
  VALIDATION_STEPS_INCOMPLETE: 'Please complete all validation steps first',
  SESSION_EXPIRED: 'Session expired. Please log in again.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.',
  UNSUPPORTED_FORMAT: 'Unsupported file format for selected category'
} as const;

// ===== SUCCESS MESSAGES =====

/**
 * Standardized success messages
 */
export const SUCCESS_MESSAGES = {
  AGENT_CREATED: 'Agent created successfully!',
  FILES_UPLOADED: 'Files uploaded successfully',
  VALIDATION_COMPLETE: 'Package validation completed',
  FORM_SAVED: 'Form data saved'
} as const;

// ===== ANIMATION TIMINGS =====

/**
 * Animation durations for consistent UX
 */
export const ANIMATION_TIMINGS = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  DRAWER_TRANSITION: 225,
  NOTIFICATION_DISPLAY: 4000
} as const;
