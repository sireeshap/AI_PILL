# AI Agent Upload Guide

## Overview
The AI Pills platform supports uploading complete AI agent packages as bundled archives. This guide will help you prepare and upload your agent successfully.

## ⚠️ Important: Package-Based Upload Only

**All agents must be uploaded as complete project packages in bundled formats:**
- **Primary formats**: `.zip`, `.tar.gz`, `.tar.xz`
- **Additional formats**: `.7z`, `.rar` (for some categories)

**Individual files (`.py`, `.js`, `.json`, etc.) are NOT accepted** because:
- AI agents are complex projects requiring multiple files
- Dependencies, configurations, and documentation are essential
- Proper project structure ensures reproducibility and usability

## Supported Agent Categories

### 1. Web-Based Platform Agents
**Description**: Cloud-hosted agents accessible via dashboard  
**Supported Formats**: `.zip`, `.tar.gz`, `.tar.xz`, `.7z`  
**Package should include**: Web assets, configurations, deployment scripts, documentation

### 2. Local/Open-Source Agents  
**Description**: Downloadable scripts, containers, or packages  
**Supported Formats**: `.zip`, `.tar.gz`, `.tar.xz`, `.7z`, `.rar`  
**Package should include**: Source code, dependencies file, README, examples, tests

### 3. CustomGPT-style Agents
**Description**: GPT-based agents with custom training data  
**Supported Formats**: `.zip`, `.tar.gz`, `.tar.xz`  
**Package should include**: Training data, prompt templates, configuration, documentation

### 4. Conversational AI
**Description**: Chat bots and dialogue systems  
**Supported Formats**: `.zip`, `.tar.gz`, `.tar.xz`  
**Package should include**: Conversation flows, intents, training data, deployment config

### 5. Document Processors
**Description**: PDF, text, and document analysis agents  
**Supported Formats**: `.zip`, `.tar.gz`, `.tar.xz`  
**Package should include**: Processing scripts, models, sample documents, API definitions

### 6. Code Assistants
**Description**: Programming and development helpers  
**Supported Formats**: `.zip`, `.tar.gz`, `.tar.xz`  
**Package should include**: Core logic, templates, rule sets, integration examples

### 7. Content Creators
**Description**: Writing, design, and creative agents  
**Supported Formats**: `.zip`, `.tar.gz`, `.tar.xz`  
**Package should include**: Generation logic, templates, style guides, sample outputs

### 8. Data Analysts
**Description**: Data processing and analytics agents  
**Supported Formats**: `.zip`, `.tar.gz`, `.tar.xz`  
**Package should include**: Analysis scripts, visualization tools, sample datasets, notebooks

### 9. Automation Agents
**Description**: Task automation and workflow agents  
**Supported Formats**: `.zip`, `.tar.gz`, `.tar.xz`  
**Package should include**: Automation scripts, workflow definitions, configuration files

### 10. Other
**Description**: Custom or specialized agent types  
**Supported Formats**: `.zip`, `.tar.gz`, `.tar.xz`, `.7z`  
**Package should include**: All necessary files for your specific agent type

## 📦 Package Structure Requirements

Your agent package **must** include these essential components:

### 🔗 Required Files

1. **Entry Point**
   - `main.py`, `app.py`, `index.js`, `agent.py`, etc.
   - The primary executable file for your agent

2. **Dependencies File**
   - `requirements.txt` (Python)
   - `package.json` (Node.js)
   - `environment.yml` (Conda)
   - List all required packages and versions

3. **README.md**
   - Clear description of what the agent does
   - Installation and setup instructions
   - Usage examples with sample inputs/outputs
   - API documentation (if applicable)

4. **Configuration Files**
   - `config.json`, `settings.yaml`, `.env.example`
   - Default settings and configurable parameters

### 📁 Recommended Structure

```
your-agent-package.zip
├── README.md                 # Essential documentation
├── requirements.txt          # Dependencies
├── config.json              # Configuration
├── main.py                  # Entry point
├── src/                     # Source code
│   ├── agent.py
│   └── utils.py
├── data/                    # Sample data/templates
│   ├── examples.json
│   └── sample_input.txt
├── tests/                   # Test files (recommended)
│   └── test_agent.py
└── docs/                    # Additional documentation
    └── examples.md
```

### 🚫 What NOT to Include

- Actual API keys or sensitive credentials
- Large model files (>100MB) - provide download links instead
- Temporary files (.tmp, .cache, __pycache__)
- IDE-specific files (.vscode, .idea)

## 📋 Pre-Upload Checklist

✅ **Package is complete** - All required files are included  
✅ **Dependencies are listed** - requirements.txt or equivalent exists  
✅ **README is comprehensive** - Clear installation and usage instructions  
✅ **No sensitive data** - API keys and credentials are removed  
✅ **Size is under 100MB** - Use external storage for large files  
✅ **Archive format is correct** - .zip, .tar.gz, or .tar.xz

## File Upload Requirements

### General Requirements
- **Maximum file size**: 100MB per file
- **Copyright compliance**: Agents must be open-source or self-developed
- **File validation**: All uploads are scanned for security and integrity

### ZIP File Structure (Recommended)
```
agent_package.zip
├── README.md              # Agent documentation
├── agent_config.json      # Configuration file
├── requirements.txt       # Dependencies (Python)
├── package.json          # Dependencies (Node.js)
├── main.py               # Entry point script
├── src/                  # Source code directory
│   ├── __init__.py
│   ├── agent.py
│   └── utils.py
├── data/                 # Sample data or templates
│   ├── examples.json
│   └── templates/
├── tests/                # Test files
│   ├── test_agent.py
│   └── fixtures/
└── docs/                 # Additional documentation
    ├── api.md
    └── examples.md
```

### Required Files
1. **README.md**: Documentation explaining the agent's purpose, installation, and usage
2. **Configuration File**: JSON/YAML file with agent metadata and settings
3. **Entry Point**: Main script or executable file
4. **Requirements**: Dependency list (requirements.txt, package.json, etc.)

### Optional Files
- **Examples**: Sample inputs and outputs
- **Tests**: Unit tests and validation scripts
- **Documentation**: API docs, tutorials, guides
- **Data**: Training data, templates, configuration examples

## Agent Configuration File Format

Create an `agent_config.json` file with the following structure:

```json
{
  "name": "Your Agent Name",
  "version": "1.0.0",
  "category": "document-processor",
  "description": "Brief description of what your agent does",
  "author": "Your Name",
  "license": "MIT",
  "tags": ["tag1", "tag2", "tag3"],
  "requirements": {
    "python": ">=3.7",
    "packages": ["package1>=1.0.0", "package2>=2.0.0"]
  },
  "entry_point": "main.py",
  "supported_formats": [".txt", ".pdf", ".json"],
  "configuration": {
    "param1": {
      "type": "string",
      "default": "default_value",
      "description": "Parameter description"
    }
  },
  "api": {
    "endpoints": [
      {
        "path": "/process",
        "method": "POST",
        "description": "Process input data"
      }
    ]
  }
}
```

## Pre-Upload Checklist

### ✅ Code Quality
- [ ] Code is well-documented with clear comments
- [ ] Functions and classes have docstrings
- [ ] Error handling is implemented
- [ ] Code follows best practices for the language

### ✅ Documentation
- [ ] README.md explains installation and usage
- [ ] Configuration options are documented
- [ ] Examples are provided
- [ ] API documentation (if applicable)

### ✅ Security & Compliance
- [ ] No hardcoded credentials or sensitive data
- [ ] Code is free of known vulnerabilities
- [ ] Dependencies are up-to-date and secure
- [ ] Copyright/licensing requirements met

### ✅ Testing
- [ ] Basic functionality tests included
- [ ] Example inputs and expected outputs provided
- [ ] Error cases are tested
- [ ] Installation/setup process verified

### ✅ Packaging
- [ ] All required files are included
- [ ] File structure is organized and clear
- [ ] ZIP file is under 100MB
- [ ] No unnecessary files (logs, cache, etc.)

## Upload Process

1. **Select Category**: Choose the appropriate agent category
2. **Upload Files**: Drag and drop or select your ZIP file
3. **Fill Details**: Provide agent name, description, and tags
4. **Confirm Compliance**: Check the copyright confirmation
5. **Submit**: Review and submit your agent

## Validation Process

The platform automatically validates:
- **File Format**: Ensures uploaded files match the selected category
- **ZIP Integrity**: Validates ZIP files are not corrupted
- **Security**: Scans for potentially unsafe content
- **Size Limits**: Enforces file size restrictions
- **Required Files**: Checks for essential documentation

## Best Practices

### Documentation
- Write clear, comprehensive README files
- Include installation instructions
- Provide usage examples
- Document configuration options

### Code Organization
- Use clear directory structure
- Separate source code, tests, and documentation
- Include type hints (Python) or JSDoc (JavaScript)
- Follow language-specific conventions

### Dependencies
- Pin dependency versions for reproducibility
- Minimize external dependencies when possible
- Use virtual environments for testing
- Document system requirements

### Examples & Testing
- Include working examples
- Provide sample input/output data
- Add unit tests for core functionality
- Test installation process on clean environment

## Troubleshooting

### Common Upload Issues
- **File size too large**: Compress files or remove unnecessary content
- **Unsupported format**: Check category-specific format requirements  
- **ZIP corruption**: Re-create ZIP file with proper compression
- **Missing required files**: Ensure README and config files are included

### Validation Errors
- **Security warnings**: Remove potentially unsafe code patterns
- **Missing documentation**: Add comprehensive README file
- **Invalid configuration**: Fix JSON/YAML syntax errors
- **Copyright issues**: Ensure all code is properly licensed

## Support

If you encounter issues during upload:
1. Check this guide for requirements
2. Validate your files locally
3. Review error messages carefully
4. Contact support with specific error details

## Examples

See the sample agents in the platform for reference implementations:
- Document Processor (Python)
- Chat Bot (JavaScript) 
- Data Analyzer (Jupyter Notebook)
- Automation Script (YAML + Python)
