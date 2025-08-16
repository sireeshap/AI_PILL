// Types for the upload agent drawer system

export interface AgentFormData {
  name: string;
  description: string;
  visibility: string;
  agent_type: string;
  category: string;
  tags: string[];
  is_active: boolean;
  github_link?: string;
}

export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'uploaded' | 'validating' | 'validated' | 'error';
  error?: string;
  validationResults?: ValidationResults;
}

export interface ValidationResults {
  hasMainFile: boolean;
  hasDependencies: boolean;
  hasReadme: boolean;
  hasConfig: boolean;
  packageStructure: string[];
  warnings: string[];
  errors: string[];
}

export interface UploadStep {
  label: string;
  description: string;
}

export interface AgentCategory {
  value: string;
  label: string;
  description: string;
}

export interface UploadAgentDrawerProps {
  open: boolean;
  onClose: () => void;
  onAgentCreated: () => void;
}
