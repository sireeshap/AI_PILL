/**
 * @fileoverview Services for Agent Upload Feature
 * @author Enterprise Architecture Team
 * @version 1.0.0
 * 
 * This module provides service layer implementations following enterprise
 * patterns including dependency injection, error handling, and logging.
 */

import { 
  AgentCreationPayload, 
  FileValidationService,
  AgentCreationService,
  PackageValidationResults,
  AgentCategory,
  UploadError
} from '../types';
import { 
  validateFile, 
  validatePackage as validatePackageContent 
} from '../validators';
import { fetchClient } from '../../../services/api';
import { ERROR_MESSAGES } from '../constants';

// ===== FILE VALIDATION SERVICE =====

/**
 * Implementation of file validation service
 * Handles file format, size, and content validation
 */
class FileValidationServiceImpl implements FileValidationService {
  /**
   * Validates a file based on category requirements
   * @param file - File to validate
   * @param category - Agent category for validation rules
   * @returns Validation error message or null if valid
   */
  validateFile(file: File, category: AgentCategory): string | null {
    try {
      return validateFile(file, category);
    } catch (error) {
      console.error('File validation error:', error);
      return ERROR_MESSAGES.GENERIC_ERROR;
    }
  }

  /**
   * Performs comprehensive package content validation
   * @param file - Package file to validate
   * @returns Promise resolving to validation results
   */
  async validatePackage(file: File): Promise<PackageValidationResults> {
    try {
      // In production, this would call actual package analysis services
      return await validatePackageContent(file);
    } catch (error) {
      console.error('Package validation error:', error);
      throw new UploadError(
        'Package validation failed',
        'VALIDATION_ERROR',
        { originalError: error, fileName: file.name }
      );
    }
  }
}

// ===== AGENT CREATION SERVICE =====

/**
 * Implementation of agent creation service
 * Handles API communication for agent creation
 */
class AgentCreationServiceImpl implements AgentCreationService {
  /**
   * Creates a new agent with provided data
   * @param data - Agent creation payload
   * @throws UploadError on creation failure
   */
  async createAgent(data: AgentCreationPayload): Promise<void> {
    try {
      // Validate payload before sending
      this.validateCreationPayload(data);

      // Call API to create agent
      await fetchClient('/agents/', {
        method: 'POST',
        body: data
      });

      // Log successful creation for audit
      console.info('Agent created successfully:', {
        name: data.name,
        category: data.category,
        fileCount: data.file_refs.length
      });

    } catch (error: any) {
      console.error('Agent creation failed:', error);
      
      // Transform API errors into domain-specific errors
      if (error.message?.includes('401')) {
        throw new UploadError(
          ERROR_MESSAGES.SESSION_EXPIRED,
          'AUTHENTICATION_ERROR',
          { originalError: error }
        );
      }
      
      if (error.message?.includes('validation error')) {
        throw new UploadError(
          `Validation Error: ${error.message}`,
          'VALIDATION_ERROR',
          { originalError: error }
        );
      }

      if (error.message?.includes('network') || error.code === 'NETWORK_ERROR') {
        throw new UploadError(
          ERROR_MESSAGES.NETWORK_ERROR,
          'NETWORK_ERROR',
          { originalError: error }
        );
      }
      
      throw new UploadError(
        error.message || ERROR_MESSAGES.GENERIC_ERROR,
        'CREATION_ERROR',
        { originalError: error }
      );
    }
  }

  /**
   * Validates agent creation payload
   * @param data - Payload to validate
   * @throws UploadError if payload is invalid
   */
  private validateCreationPayload(data: AgentCreationPayload): void {
    if (!data.name?.trim()) {
      throw new UploadError(
        ERROR_MESSAGES.NAME_REQUIRED,
        'INVALID_PAYLOAD',
        { field: 'name' }
      );
    }

    if (!data.category) {
      throw new UploadError(
        ERROR_MESSAGES.CATEGORY_REQUIRED,
        'INVALID_PAYLOAD',
        { field: 'category' }
      );
    }

    if (!data.file_refs || data.file_refs.length === 0) {
      throw new UploadError(
        ERROR_MESSAGES.FILES_REQUIRED,
        'INVALID_PAYLOAD',
        { field: 'file_refs' }
      );
    }

    if (!data.copyright_confirmed) {
      throw new UploadError(
        ERROR_MESSAGES.COPYRIGHT_REQUIRED,
        'INVALID_PAYLOAD',
        { field: 'copyright_confirmed' }
      );
    }
  }
}

// ===== FILE UPLOAD SERVICE =====

/**
 * Service for handling file upload operations
 * Manages upload progress, retries, and error handling
 */
export class FileUploadService {
  private uploadTimeouts = new Map<string, NodeJS.Timeout>();

  /**
   * Simulates file upload with progress tracking
   * In production, this would handle actual file upload to cloud storage
   * @param file - File to upload
   * @param onProgress - Progress callback
   * @returns Promise resolving when upload completes
   */
  async uploadFile(
    file: File,
    onProgress: (progress: number) => void
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileId = this.generateFileId(file);
      let progress = 0;

      // Simulate upload progress
      const interval = setInterval(() => {
        progress = Math.min(progress + Math.random() * 15, 100);
        onProgress(progress);

        if (progress >= 100) {
          clearInterval(interval);
          clearTimeout(this.uploadTimeouts.get(fileId)!);
          this.uploadTimeouts.delete(fileId);
          resolve(fileId);
        }
      }, 200);

      // Set upload timeout
      const timeout = setTimeout(() => {
        clearInterval(interval);
        this.uploadTimeouts.delete(fileId);
        reject(new UploadError(
          'Upload timeout exceeded',
          'UPLOAD_TIMEOUT',
          { fileName: file.name, fileSize: file.size }
        ));
      }, 30000); // 30 second timeout

      this.uploadTimeouts.set(fileId, timeout);
    });
  }

  /**
   * Cancels an ongoing upload
   * @param fileId - ID of file upload to cancel
   */
  cancelUpload(fileId: string): void {
    const timeout = this.uploadTimeouts.get(fileId);
    if (timeout) {
      clearTimeout(timeout);
      this.uploadTimeouts.delete(fileId);
    }
  }

  /**
   * Generates unique file ID for tracking
   * @param file - File to generate ID for
   * @returns Unique file identifier
   */
  private generateFileId(file: File): string {
    return `${file.name}_${file.size}_${Date.now()}`;
  }
}

// ===== ANALYTICS SERVICE =====

/**
 * Service for tracking upload analytics and metrics
 * Provides insights into upload patterns and performance
 */
export class UploadAnalyticsService {
  /**
   * Tracks upload start event
   * @param category - Agent category
   * @param fileCount - Number of files being uploaded
   */
  trackUploadStart(category: AgentCategory, fileCount: number): void {
    // In production, this would send events to analytics service
    console.info('Upload started', {
      category,
      fileCount,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Tracks upload completion event
   * @param category - Agent category
   * @param duration - Upload duration in milliseconds
   * @param success - Whether upload was successful
   */
  trackUploadComplete(
    category: AgentCategory, 
    duration: number, 
    success: boolean
  ): void {
    console.info('Upload completed', {
      category,
      duration,
      success,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Tracks validation metrics
   * @param results - Validation results
   * @param duration - Validation duration in milliseconds
   */
  trackValidation(results: PackageValidationResults, duration: number): void {
    console.info('Package validated', {
      hasMainFile: results.hasMainFile,
      hasDependencies: results.hasDependencies,
      hasReadme: results.hasReadme,
      hasConfig: results.hasConfig,
      warningCount: results.warnings.length,
      errorCount: results.errors.length,
      duration,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Tracks error events for monitoring
   * @param error - Error that occurred
   * @param context - Additional context
   */
  trackError(error: UploadError, context?: Record<string, any>): void {
    console.error('Upload error tracked', {
      message: error.message,
      code: error.code,
      details: error.details,
      context,
      timestamp: new Date().toISOString()
    });
  }
}

// ===== SERVICE FACTORY =====

/**
 * Factory for creating service instances
 * Implements dependency injection pattern for better testability
 */
export class ServiceFactory {
  private static fileValidationService: FileValidationService;
  private static agentCreationService: AgentCreationService;
  private static fileUploadService: FileUploadService;
  private static analyticsService: UploadAnalyticsService;

  /**
   * Gets file validation service instance
   */
  static getFileValidationService(): FileValidationService {
    if (!this.fileValidationService) {
      this.fileValidationService = new FileValidationServiceImpl();
    }
    return this.fileValidationService;
  }

  /**
   * Gets agent creation service instance
   */
  static getAgentCreationService(): AgentCreationService {
    if (!this.agentCreationService) {
      this.agentCreationService = new AgentCreationServiceImpl();
    }
    return this.agentCreationService;
  }

  /**
   * Gets file upload service instance
   */
  static getFileUploadService(): FileUploadService {
    if (!this.fileUploadService) {
      this.fileUploadService = new FileUploadService();
    }
    return this.fileUploadService;
  }

  /**
   * Gets analytics service instance
   */
  static getAnalyticsService(): UploadAnalyticsService {
    if (!this.analyticsService) {
      this.analyticsService = new UploadAnalyticsService();
    }
    return this.analyticsService;
  }
}

// ===== EXPORTS =====

export const fileValidationService = ServiceFactory.getFileValidationService();
export const agentCreationService = ServiceFactory.getAgentCreationService();
export const fileUploadService = ServiceFactory.getFileUploadService();
export const analyticsService = ServiceFactory.getAnalyticsService();
