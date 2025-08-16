# Migration Guide: Legacy to Enterprise Architecture

## Overview

This guide outlines the migration from the monolithic `UploadAgentDrawer.tsx` component to the new enterprise-grade feature architecture.

## 🔄 Migration Steps

### 1. Update Imports

**Before:**
```typescript
import UploadAgentDrawer from '../../components/dashboard/UploadAgentDrawer';
```

**After:**
```typescript
import { AgentUploadDrawer } from '../../features/agent-upload';
```

### 2. Component Usage

**Before:**
```typescript
<UploadAgentDrawer
  open={isOpen}
  onClose={handleClose}
  onAgentCreated={handleAgentCreated}
/>
```

**After:**
```typescript
<AgentUploadDrawer
  open={isOpen}
  onClose={handleClose}
  onAgentCreated={handleAgentCreated}
/>
```

### 3. Type Imports

**Before:**
```typescript
import { AgentFormData } from '../upload/types';
```

**After:**
```typescript
import { AgentFormData } from '../../features/agent-upload';
```

## 📁 File Structure Changes

### Legacy Structure
```
src/components/dashboard/
├── UploadAgentDrawer.tsx    # 1000+ lines monolith
└── upload/
    ├── StepOne.tsx
    ├── StepTwo.tsx
    ├── StepThree.tsx
    ├── types.ts
    ├── constants.ts
    ├── utils.ts
    └── useUploadAgent.ts
```

### New Enterprise Structure
```
src/features/agent-upload/
├── components/
│   ├── drawer/
│   │   ├── AgentUploadDrawer.tsx
│   │   └── index.ts
│   ├── steps/
│   │   ├── StepOneContainer.tsx
│   │   ├── StepTwoContainer.tsx
│   │   ├── StepThreeContainer.tsx
│   │   └── index.ts
│   └── shared/
│       └── index.ts
├── hooks/
│   └── useUploadAgent.ts
├── services/
│   └── index.ts
├── types/
│   └── index.ts
├── constants/
│   └── index.ts
├── validators/
│   └── index.ts
├── utils/
│   └── index.ts
├── README.md
└── index.ts
```

## 🔧 Breaking Changes

### 1. Component Name Change

- `UploadAgentDrawer` → `AgentUploadDrawer`

### 2. Hook API Changes

**Before:**
```typescript
const {
  formData,
  handleSubmit,
  // ... other exports
} = useUploadAgent();
```

**After:**
```typescript
const {
  formData,
  handleSubmit,
  resetForm,           // New
  validationProgress,  // New
  // ... enhanced exports
} = useUploadAgent(onAgentCreated, onClose);
```

### 3. Type System Enhancement

**Before:**
```typescript
interface AgentFormData {
  name: string;
  description: string;
  // ... basic fields
}
```

**After:**
```typescript
interface AgentFormData {
  name: string;
  description: string;
  visibility: AgentVisibility;
  agent_type: string;
  category: AgentCategory;
  tags: string[];
  is_active: boolean;
  github_link?: string;
}
```

## 🎯 Enhanced Features

### 1. New Validation System
```typescript
// New comprehensive validation
import { 
  validateAgentFormData, 
  validateBusinessRules,
  canProceedToValidation 
} from '../../features/agent-upload';
```

### 2. Service Layer
```typescript
// Access to enterprise services
import { 
  fileValidationService,
  agentCreationService,
  analyticsService 
} from '../../features/agent-upload';
```

### 3. Enhanced Constants
```typescript
// More organized constants
import { 
  AGENT_CATEGORIES,
  MAX_FILE_SIZE,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES 
} from '../../features/agent-upload';
```

## 🧪 Testing Migration

### Update Test Imports

**Before:**
```typescript
import UploadAgentDrawer from '../UploadAgentDrawer';
```

**After:**
```typescript
import { AgentUploadDrawer } from '../../../features/agent-upload';
```

### New Test IDs

The enterprise version includes comprehensive `data-testid` attributes:

```typescript
// Agent name input
screen.getByTestId('agent-name-input')

// Upload button
screen.getByTestId('upload-button')

// Step containers
screen.getByTestId('step-one-container')
screen.getByTestId('step-two-container')
screen.getByTestId('step-three-container')
```

## ⚠️ Migration Checklist

### Phase 1: Preparation
- [ ] Review new feature documentation
- [ ] Update development dependencies
- [ ] Run existing tests to establish baseline

### Phase 2: Code Migration
- [ ] Update import statements
- [ ] Change component names
- [ ] Update prop interfaces
- [ ] Migrate custom logic to new services

### Phase 3: Testing
- [ ] Update test files
- [ ] Verify functionality parity
- [ ] Test new enterprise features
- [ ] Performance testing

### Phase 4: Cleanup
- [ ] Remove legacy files
- [ ] Update documentation
- [ ] Remove unused dependencies
- [ ] Final integration testing

## 🔍 Verification Steps

### 1. Functionality Check
```bash
# Test the upload workflow
npm run test -- --testPathPattern=agent-upload

# Check TypeScript compilation
npm run type-check

# Lint the new code
npm run lint
```

### 2. Performance Verification
```bash
# Bundle size analysis
npm run analyze

# Runtime performance
npm run test:performance
```

### 3. SonarQube Compliance
```bash
# Run SonarQube analysis
npm run sonar

# Check coverage
npm run test:coverage
```

## 🚀 Post-Migration Benefits

### 1. Maintainability
- **Modular Architecture**: Easy to understand and modify
- **Type Safety**: Comprehensive TypeScript coverage
- **Documentation**: Extensive JSDoc comments

### 2. Scalability
- **Feature-based Organization**: Easy to extend
- **Service Layer**: Reusable business logic
- **Component Composition**: Flexible UI building

### 3. Quality
- **SonarQube Compliant**: Enterprise quality standards
- **Testing Infrastructure**: Comprehensive test coverage
- **Error Handling**: Robust error management

### 4. Developer Experience
- **IntelliSense**: Enhanced IDE support
- **Debugging**: Better error messages and logging
- **Hot Reloading**: Faster development cycles

## 📞 Support During Migration

### Common Issues

1. **Import Errors**: Check file paths and named exports
2. **Type Errors**: Review interface changes
3. **Runtime Errors**: Verify prop passing
4. **Test Failures**: Update test data and expectations

### Getting Help

- Review the enterprise feature README
- Check JSDoc comments in source files
- Run TypeScript compiler for detailed errors
- Use browser DevTools for runtime issues

### Rollback Plan

If issues arise:

1. Revert import changes
2. Restore legacy component usage
3. Remove new feature imports
4. Test functionality
5. Address issues before re-attempting migration

---

**Migration Version**: 1.0.0  
**Estimated Time**: 2-4 hours  
**Risk Level**: Low (backward compatible)  
**Support**: Enterprise Architecture Team
