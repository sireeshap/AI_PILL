import { FileUpload, ValidationResults } from './types';
import { SUPPORTED_FORMATS } from './constants';

export const validateFile = (file: File, category: string): string | null => {
  const maxSize = 100 * 1024 * 1024; // 100MB
  
  if (file.size > maxSize) {
    return 'File size must be less than 100MB';
  }

  if (!category) {
    return 'Please select an agent category first';
  }

  const allowedFormats = SUPPORTED_FORMATS[category] || [];
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  
  // Handle compound extensions like .tar.gz
  const fileName = file.name.toLowerCase();
  let detectedExtension = fileExtension;
  if (fileName.endsWith('.tar.gz')) {
    detectedExtension = '.tar.gz';
  } else if (fileName.endsWith('.tar.xz')) {
    detectedExtension = '.tar.xz';
  }
  
  if (!allowedFormats.includes(detectedExtension)) {
    return `Please upload a complete agent package. Only bundled formats are accepted: ${allowedFormats.join(', ')}. Individual files like ${detectedExtension} are not sufficient for AI agents.`;
  }

  return null;
};

export const mockValidatePackage = async (file: File): Promise<ValidationResults> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const fileName = file.name.toLowerCase();
      const hasMainFile = fileName.includes('main') || fileName.includes('app') || fileName.includes('index');
      const hasDependencies = Math.random() > 0.3; // 70% chance
      const hasReadme = Math.random() > 0.2; // 80% chance
      const hasConfig = Math.random() > 0.4; // 60% chance

      const warnings = [];
      const errors = [];

      if (!hasMainFile) warnings.push('No main entry point file detected');
      if (!hasDependencies) warnings.push('No dependencies file found (requirements.txt, package.json, etc.)');
      if (!hasReadme) warnings.push('No README.md file found');
      if (!hasConfig) warnings.push('No configuration files detected');

      // Simulate critical errors
      if (Math.random() > 0.9) { // 10% chance
        errors.push('Package appears to be corrupted or incomplete');
      }

      resolve({
        hasMainFile,
        hasDependencies,
        hasReadme,
        hasConfig,
        packageStructure: [
          'src/',
          hasMainFile ? 'main.py' : '',
          hasDependencies ? 'requirements.txt' : '',
          hasReadme ? 'README.md' : '',
          hasConfig ? 'config.json' : '',
          'examples/',
          'tests/'
        ].filter(Boolean),
        warnings,
        errors
      });
    }, 2000 + Math.random() * 1000); // 2-3 seconds
  });
};

export const canProceedToValidation = (
  uploadedFiles: FileUpload[], 
  category: string, 
  copyrightConfirmed: boolean
): boolean => {
  return uploadedFiles.length > 0 && 
         uploadedFiles.every(file => file.status === 'uploaded') &&
         Boolean(category) &&
         copyrightConfirmed;
};

export const canProceedToCreate = (
  uploadedFiles: FileUpload[], 
  name: string, 
  category: string
): boolean => {
  const hasFiles = uploadedFiles.length > 0;
  const allValidated = uploadedFiles.every(file => file.status === 'validated');
  const hasName = Boolean(name.trim());
  const hasCategory = Boolean(category);
  
  console.log('canProceedToCreate check:', {
    hasFiles,
    allValidated,
    hasName,
    hasCategory,
    uploadedFiles: uploadedFiles.map(f => ({ name: f.file.name, status: f.status })),
    name: name.trim(),
    category
  });
  
  const canProceed = hasFiles && allValidated && hasName && hasCategory;
  console.log('canProceedToCreate result:', canProceed);
  
  return canProceed;
};
