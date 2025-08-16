#!/bin/bash

# AI Pills - Agent Upload Demo Script
# This script demonstrates the new agent upload functionality

echo "🚀 AI Pills Agent Upload Demo"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}📦 Sample Agent Package Created:${NC}"
echo "✅ sample_document_processor_agent.zip"
echo "   - sample_agent.py (Main Python script)"
echo "   - README.md.sample (Documentation)"
echo "   - agent_config.json (Configuration)"
echo "   - requirements.txt.sample (Dependencies)"
echo ""

echo -e "${BLUE}🔧 New Features Implemented:${NC}"
echo "✅ Enhanced Upload Drawer with Material-UI design"
echo "✅ Agent Category Selection (10 categories)"
echo "✅ File Format Validation by Category"
echo "✅ ZIP File Integrity Checking"
echo "✅ Copyright Compliance Confirmation"
echo "✅ Drag & Drop File Upload"
echo "✅ Progress Indicators and Status"
echo "✅ GitHub Repository Link (Optional)"
echo "✅ Enhanced Backend Validation"
echo ""

echo -e "${BLUE}📋 Supported Agent Categories:${NC}"
echo "1. 🌐 Web-Based Platform Agents"
echo "2. 💻 Local/Open-Source Agents"
echo "3. 🤖 CustomGPT-style Agents"
echo "4. 💬 Conversational AI"
echo "5. 📄 Document Processors"
echo "6. 🔧 Code Assistants"
echo "7. ✍️  Content Creators"
echo "8. 📊 Data Analysts"
echo "9. ⚡ Automation Agents"
echo "10. 🔀 Other Custom Types"
echo ""

echo -e "${BLUE}📝 File Format Support:${NC}"
echo "• ZIP Archives (.zip, .tar.gz)"
echo "• Python Scripts (.py, .ipynb)"
echo "• Configuration Files (.json, .yaml, .yml)"
echo "• Documentation (.md, .txt, .html)"
echo "• Data Files (.csv, .pdf, .docx)"
echo "• Container Files (.dockerfile)"
echo "• Web Files (.js, .ts, .css)"
echo ""

echo -e "${BLUE}🔒 Security Features:${NC}"
echo "✅ File size validation (100MB max)"
echo "✅ File type validation by category"
echo "✅ ZIP integrity checking"
echo "✅ Security path validation"
echo "✅ Copyright compliance requirement"
echo "✅ User authentication required"
echo ""

echo -e "${BLUE}🎯 How to Test:${NC}"
echo "1. Open http://localhost:3000/dashboard"
echo "2. Log in with test credentials:"
echo "   Email: bbbb@mail.com"
echo "   Password: A12345678"
echo "3. Click 'Upload New Agent' button"
echo "4. Select 'Document Processor' category"
echo "5. Upload the sample_document_processor_agent.zip file"
echo "6. Fill in the agent details"
echo "7. Confirm copyright compliance"
echo "8. Submit the agent"
echo ""

echo -e "${BLUE}📚 Documentation:${NC}"
echo "📖 AGENT_UPLOAD_GUIDE.md - Comprehensive upload guide"
echo "🔧 Enhanced backend models with new fields"
echo "🎨 Improved frontend with Material-UI components"
echo "🧪 Sample agent for testing"
echo ""

echo -e "${GREEN}✨ Status: Ready for Testing!${NC}"
echo ""
echo -e "${YELLOW}Note: Both backend (port 8000) and frontend (port 3000) should be running.${NC}"
echo -e "${YELLOW}Use the start-dev.sh script to start both services if not already running.${NC}"
echo ""

# Check if services are running
echo -e "${BLUE}🔍 Service Status Check:${NC}"
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo -e "✅ Backend: ${GREEN}Running${NC} (http://localhost:8000)"
else
    echo -e "❌ Backend: ${RED}Not Running${NC}"
fi

if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "✅ Frontend: ${GREEN}Running${NC} (http://localhost:3000)"
else
    echo -e "❌ Frontend: ${RED}Not Running${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Demo Complete! Ready for agent uploads.${NC}"
