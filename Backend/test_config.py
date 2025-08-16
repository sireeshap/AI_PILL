#!/usr/bin/env python3
"""
Configuration Test Script
========================

This script tests the centralized configuration system to ensure
all settings are working correctly across different environments.
"""

import sys
import os
from pathlib import Path

# Add the app directory to the Python path
sys.path.append(str(Path(__file__).parent / "app"))

def test_configuration():
    """Test the centralized configuration system"""
    
    print("🔧 Testing AI Pills Centralized Configuration System")
    print("=" * 60)
    
    try:
        from app.core.config import settings, StorageType, Environment
        
        # Test basic configuration
        print(f"✅ App Name: {settings.APP_NAME}")
        print(f"✅ App Version: {settings.APP_VERSION}")
        print(f"✅ Environment: {settings.ENVIRONMENT.value}")
        print(f"✅ Debug Mode: {settings.DEBUG}")
        print(f"✅ Storage Type: {settings.STORAGE_TYPE.value}")
        
        # Test storage configuration
        print("\n📁 Storage Configuration:")
        print(f"   Base Upload Path: {settings.BASE_UPLOAD_PATH}")
        print(f"   Agent Files Path: {settings.AGENT_FILES_SUBPATH}")
        print(f"   Max File Size: {settings.MAX_FILE_SIZE // (1024*1024)}MB")
        
        # Test path generation
        print("\n🛤️  Path Generation Tests:")
        test_user_id = "user123"
        test_filename = "test_agent.zip"
        
        agent_path = settings.get_file_storage_path("agents", test_user_id, test_filename)
        general_path = settings.get_file_storage_path("general", test_user_id, test_filename)
        temp_path = settings.get_file_storage_path("temp", test_user_id, test_filename)
        
        print(f"   Agent File Path: {agent_path}")
        print(f"   General File Path: {general_path}")
        print(f"   Temp File Path: {temp_path}")
        
        # Test URL generation
        print("\n🌐 URL Generation Tests:")
        agent_url = settings.get_static_file_url("agents", test_user_id, test_filename)
        print(f"   Agent File URL: {agent_url}")
        
        # Test directory creation
        print("\n📂 Directory Tests:")
        base_path = settings.get_base_upload_path()
        print(f"   Base Path Exists: {base_path.exists()}")
        print(f"   Base Path: {base_path}")
        
        agent_dir = base_path / settings.AGENT_FILES_SUBPATH
        general_dir = base_path / settings.GENERAL_FILES_SUBPATH
        temp_dir = base_path / settings.TEMP_FILES_SUBPATH
        
        print(f"   Agent Directory: {agent_dir} ({'✅ exists' if agent_dir.exists() else '❌ missing'})")
        print(f"   General Directory: {general_dir} ({'✅ exists' if general_dir.exists() else '❌ missing'})")
        print(f"   Temp Directory: {temp_dir} ({'✅ exists' if temp_dir.exists() else '❌ missing'})")
        
        # Test database configuration
        print("\n🗄️  Database Configuration:")
        db_connection = settings.get_mongodb_connection_string()
        print(f"   MongoDB Connection: {db_connection[:50]}...")
        print(f"   Database Name: {settings.DATABASE_NAME}")
        print(f"   Use Local MongoDB: {settings.USE_LOCAL_MONGODB}")
        
        # Test environment checks
        print("\n🌍 Environment Checks:")
        print(f"   Is Development: {settings.is_development()}")
        print(f"   Is Production: {settings.is_production()}")
        
        # Test storage configuration
        print("\n⚙️  Storage Config:")
        storage_config = settings.get_storage_config()
        for key, value in storage_config.items():
            if key in ['access_key_id', 'secret_access_key']:
                value = "***" if value else None
            print(f"   {key}: {value}")
        
        print("\n✅ All configuration tests passed!")
        return True
        
    except Exception as e:
        print(f"\n❌ Configuration test failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def test_storage_service():
    """Test the storage service"""
    
    print("\n🗄️  Testing Storage Service")
    print("=" * 40)
    
    try:
        from app.services.storage_service import get_storage_service, StorageError
        
        storage = get_storage_service()
        print(f"✅ Storage Service Initialized: {storage.storage_type}")
        
        # Test file info for non-existent file
        test_path = "./uploads/agents/test/nonexistent.zip"
        file_info = storage.get_file_info(test_path)
        print(f"✅ File Info Test: {file_info}")
        
        # Test file existence
        exists = storage.file_exists(test_path)
        print(f"✅ File Exists Test: {exists}")
        
        print("✅ Storage service tests passed!")
        return True
        
    except Exception as e:
        print(f"❌ Storage service test failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def test_environment_switching():
    """Test environment switching functionality"""
    
    print("\n🔄 Testing Environment Switching")
    print("=" * 40)
    
    try:
        from app.core.config import settings, configure_for_production, configure_for_development
        
        # Save original state
        original_env = settings.ENVIRONMENT
        original_storage = settings.STORAGE_TYPE
        
        print(f"Original Environment: {original_env}")
        print(f"Original Storage: {original_storage}")
        
        # Test production configuration
        configure_for_production()
        print(f"After Production Config: {settings.ENVIRONMENT}, {settings.STORAGE_TYPE}")
        
        # Test development configuration
        configure_for_development()
        print(f"After Development Config: {settings.ENVIRONMENT}, {settings.STORAGE_TYPE}")
        
        print("✅ Environment switching tests passed!")
        return True
        
    except Exception as e:
        print(f"❌ Environment switching test failed: {str(e)}")
        return False

if __name__ == "__main__":
    print("🚀 Starting AI Pills Configuration Tests\n")
    
    success = True
    success &= test_configuration()
    success &= test_storage_service()
    success &= test_environment_switching()
    
    print("\n" + "=" * 60)
    if success:
        print("🎉 ALL TESTS PASSED! Configuration system is working correctly.")
        print("\n💡 Next Steps:")
        print("   1. Start the backend server: python -m app.main")
        print("   2. Check the /health endpoint for storage info")
        print("   3. Test file uploads through the API")
        exit(0)
    else:
        print("❌ SOME TESTS FAILED! Please check the configuration.")
        exit(1)
