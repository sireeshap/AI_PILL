import { AgentCategory } from './types';

// Upload Steps
export const UPLOAD_STEPS = [
  {
    label: 'Upload Files',
    description: 'Upload your agent package files'
  },
  {
    label: 'Validate Package',
    description: 'Verify package structure and content'
  },
  {
    label: 'Create Agent',
    description: 'Finalize agent creation'
  }
];

// Agent categories
export const AGENT_CATEGORIES: AgentCategory[] = [
  { value: 'web-based', label: 'Web-Based Platform Agent', description: 'Cloud-hosted agents accessible via dashboard' },
  { value: 'local-opensource', label: 'Local/Open-Source Agent', description: 'Downloadable scripts, containers, or packages' },
  { value: 'customgpt', label: 'CustomGPT-style Agent', description: 'GPT-based agents with custom training data' },
  { value: 'conversational', label: 'Conversational AI', description: 'Chat bots and dialogue systems' },
  { value: 'document-processor', label: 'Document Processor', description: 'PDF, text, and document analysis agents' },
  { value: 'code-assistant', label: 'Code Assistant', description: 'Programming and development helpers' },
  { value: 'content-creator', label: 'Content Creator', description: 'Writing, design, and creative agents' },
  { value: 'data-analyst', label: 'Data Analyst', description: 'Data processing and analytics agents' },
  { value: 'automation', label: 'Automation Agent', description: 'Task automation and workflow agents' },
  { value: 'other', label: 'Other', description: 'Custom or specialized agent types' }
];

// Supported file formats for different agent types
export const SUPPORTED_FORMATS: Record<string, string[]> = {
  'web-based': ['.zip', '.tar.gz', '.tar.xz', '.7z'],
  'local-opensource': ['.zip', '.tar.gz', '.tar.xz', '.7z', '.rar'],
  'customgpt': ['.zip', '.tar.gz', '.tar.xz'],
  'conversational': ['.zip', '.tar.gz', '.tar.xz'],
  'document-processor': ['.zip', '.tar.gz', '.tar.xz'],
  'code-assistant': ['.zip', '.tar.gz', '.tar.xz'],
  'content-creator': ['.zip', '.tar.gz', '.tar.xz'],
  'data-analyst': ['.zip', '.tar.gz', '.tar.xz'],
  'automation': ['.zip', '.tar.gz', '.tar.xz'],
  'other': ['.zip', '.tar.gz', '.tar.xz', '.7z']
};
