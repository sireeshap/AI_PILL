/**
 * @fileoverview Utility functions for Agent Upload Feature
 * @author Enterprise Architecture Team
 * @version 1.0.0
 * 
 * This module contains reusable utility functions used across the agent upload feature.
 * Following enterprise patterns for maintainability and testability.
 */

import { AgentFormData, FileUpload, AgentCategory } from '../types';

// ===== FILE UTILITIES =====

/**
 * Formats file size in human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "2.5 MB", "1.2 GB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Gets file extension from filename, handling compound extensions
 * @param fileName - The filename to analyze
 * @returns The file extension (e.g., ".zip", ".tar.gz")
 */
export const getFileExtension = (fileName: string): string => {
  const lowercaseName = fileName.toLowerCase();
  
  // Handle compound extensions
  if (lowercaseName.endsWith('.tar.gz')) return '.tar.gz';
  if (lowercaseName.endsWith('.tar.xz')) return '.tar.xz';
  if (lowercaseName.endsWith('.tar.bz2')) return '.tar.bz2';
  
  // Handle simple extensions
  const lastDotIndex = fileName.lastIndexOf('.');
  return lastDotIndex !== -1 ? fileName.substring(lastDotIndex).toLowerCase() : '';
};

/**
 * Validates if a file type is supported for a given category
 * @param fileName - The filename to check
 * @param supportedFormats - Array of supported file extensions
 * @returns True if file type is supported
 */
export const isFileTypeSupported = (fileName: string, supportedFormats: string[]): boolean => {
  const extension = getFileExtension(fileName);
  return supportedFormats.includes(extension);
};

/**
 * Generates a unique file identifier for tracking
 * @param file - The file object
 * @returns Unique identifier string
 */
export const generateFileId = (file: File): string => {
  return `${file.name}-${file.size}-${file.lastModified}`;
};

// ===== TEXT UTILITIES =====

/**
 * Sanitizes user input to prevent XSS and normalize text
 * @param input - Raw user input
 * @returns Sanitized string
 */
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential script tags
    .replace(/\s+/g, ' '); // Normalize whitespace
};

/**
 * Validates and formats tag input
 * @param tag - Raw tag input
 * @returns Formatted tag or null if invalid
 */
export const formatTag = (tag: string): string | null => {
  const sanitized = sanitizeInput(tag.toLowerCase());
  
  // Tag validation rules
  if (sanitized.length < 2 || sanitized.length > 50) return null;
  if (!/^[a-z0-9-_]+$/.test(sanitized)) return null;
  
  return sanitized;
};

/**
 * Truncates text to specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

// ===== VALIDATION UTILITIES =====

/**
 * Validates GitHub URL format
 * @param url - URL to validate
 * @returns True if valid GitHub URL
 */
export const isValidGitHubUrl = (url: string): boolean => {
  const githubUrlPattern = /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+\/?$/;
  return githubUrlPattern.test(url.trim());
};

/**
 * Validates email format (if needed for user attribution)
 * @param email - Email to validate
 * @returns True if valid email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email.trim());
};

/**
 * Checks if a string contains only alphanumeric characters and allowed symbols
 * @param input - String to validate
 * @param allowedSymbols - Additional symbols to allow
 * @returns True if string is safe
 */
export const isSafeString = (input: string, allowedSymbols: string = '-_.'): boolean => {
  const pattern = new RegExp(`^[a-zA-Z0-9${allowedSymbols.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s]+$`);
  return pattern.test(input);
};

// ===== UPLOAD PROGRESS UTILITIES =====

/**
 * Calculates overall upload progress across multiple files
 * @param uploadedFiles - Array of file upload objects
 * @returns Overall progress percentage (0-100)
 */
export const calculateOverallProgress = (uploadedFiles: FileUpload[]): number => {
  if (uploadedFiles.length === 0) return 0;
  
  const totalProgress = uploadedFiles.reduce((sum, file) => sum + file.progress, 0);
  return Math.round(totalProgress / uploadedFiles.length);
};

/**
 * Determines if all files have completed upload
 * @param uploadedFiles - Array of file upload objects
 * @returns True if all files are uploaded
 */
export const areAllFilesUploaded = (uploadedFiles: FileUpload[]): boolean => {
  return uploadedFiles.length > 0 && uploadedFiles.every(file => 
    file.status === 'uploaded' || file.status === 'validated'
  );
};

/**
 * Counts files by status
 * @param uploadedFiles - Array of file upload objects
 * @param status - Status to count
 * @returns Number of files with specified status
 */
export const countFilesByStatus = (uploadedFiles: FileUpload[], status: string): number => {
  return uploadedFiles.filter(file => file.status === status).length;
};

// ===== FORM UTILITIES =====

/**
 * Checks if form data meets minimum requirements for submission
 * @param formData - Current form data
 * @returns True if form is ready for submission
 */
export const isFormReadyForSubmission = (formData: AgentFormData): boolean => {
  return Boolean(
    formData.name?.trim() &&
    formData.description?.trim() &&
    formData.category &&
    formData.agent_type?.trim()
  );
};

/**
 * Generates a slug from agent name for URL-friendly identifiers
 * @param name - Agent name
 * @returns URL-friendly slug
 */
export const generateAgentSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Estimates upload time based on file sizes and connection speed
 * @param uploadedFiles - Array of files to upload
 * @param connectionSpeedMbps - Estimated connection speed in Mbps
 * @returns Estimated time in seconds
 */
export const estimateUploadTime = (uploadedFiles: FileUpload[], connectionSpeedMbps: number = 10): number => {
  const totalSizeBytes = uploadedFiles.reduce((sum, file) => sum + file.file.size, 0);
  const totalSizeMb = totalSizeBytes / (1024 * 1024);
  return Math.ceil(totalSizeMb / connectionSpeedMbps);
};

// ===== DATE AND TIME UTILITIES =====

/**
 * Formats timestamp for display
 * @param timestamp - Unix timestamp or Date object
 * @returns Formatted date string
 */
export const formatTimestamp = (timestamp: number | Date): string => {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

/**
 * Gets relative time string (e.g., "2 minutes ago")
 * @param timestamp - Unix timestamp or Date object
 * @returns Relative time string
 */
export const getRelativeTime = (timestamp: number | Date): string => {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

// ===== ERROR UTILITIES =====

/**
 * Extracts user-friendly error message from error object
 * @param error - Error object or string
 * @returns User-friendly error message
 */
export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String(error.message);
  }
  return 'An unexpected error occurred';
};

/**
 * Determines if an error is a network-related error
 * @param error - Error object
 * @returns True if error is network-related
 */
export const isNetworkError = (error: unknown): boolean => {
  const message = getErrorMessage(error).toLowerCase();
  return message.includes('network') || 
         message.includes('fetch') || 
         message.includes('timeout') ||
         message.includes('connection');
};

// ===== DEBUG UTILITIES =====

/**
 * Creates a debug-friendly representation of upload state
 * @param formData - Current form data
 * @param uploadedFiles - Current uploaded files
 * @returns Debug object
 */
export const createDebugSnapshot = (formData: AgentFormData, uploadedFiles: FileUpload[]) => {
  return {
    timestamp: new Date().toISOString(),
    formData: {
      name: formData.name,
      category: formData.category,
      tagsCount: formData.tags.length,
      hasGithubLink: Boolean(formData.github_link)
    },
    files: uploadedFiles.map(file => ({
      name: file.file.name,
      size: formatFileSize(file.file.size),
      status: file.status,
      progress: file.progress,
      hasErrors: Boolean(file.error)
    })),
    overall: {
      totalFiles: uploadedFiles.length,
      uploadedFiles: countFilesByStatus(uploadedFiles, 'uploaded'),
      validatedFiles: countFilesByStatus(uploadedFiles, 'validated'),
      errorFiles: countFilesByStatus(uploadedFiles, 'error'),
      overallProgress: calculateOverallProgress(uploadedFiles)
    }
  };
};
