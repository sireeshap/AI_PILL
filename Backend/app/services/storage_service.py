"""
File Storage Service
==================

Centralized file storage service that handles different storage backends
(local, S3, GridFS, etc.) based on configuration.

This service abstracts the storage implementation details and provides
a unified interface for file operations across different environments.
"""

import os
import shutil
from pathlib import Path
from typing import BinaryIO, Optional, Tuple, Dict, Any
from datetime import datetime, timedelta
import mimetypes
import hashlib

from app.core.config import settings, StorageType
from app.models.file_models import File as FileModel


class StorageError(Exception):
    """Custom exception for storage-related errors"""
    pass


class FileStorageService:
    """
    Unified file storage service that handles multiple storage backends
    """
    
    def __init__(self):
        self.storage_type = settings.STORAGE_TYPE
        self.config = settings.get_storage_config()
        self._ensure_directories()
    
    def _ensure_directories(self):
        """Ensure required directories exist for local storage"""
        if self.storage_type == StorageType.LOCAL:
            base_path = settings.get_base_upload_path()
            
            # Create subdirectories
            (base_path / settings.AGENT_FILES_SUBPATH).mkdir(parents=True, exist_ok=True)
            (base_path / settings.GENERAL_FILES_SUBPATH).mkdir(parents=True, exist_ok=True)
            (base_path / settings.TEMP_FILES_SUBPATH).mkdir(parents=True, exist_ok=True)
    
    def store_file(
        self, 
        file_content: bytes, 
        filename: str, 
        user_id: str, 
        file_type: str = "general",
        content_type: Optional[str] = None
    ) -> Tuple[str, str]:
        """
        Store a file using the configured storage backend
        
        Args:
            file_content: Binary content of the file
            filename: Name of the file
            user_id: ID of the user uploading the file
            file_type: Type of file ('agents', 'general', 'temp')
            content_type: MIME type of the file
            
        Returns:
            Tuple of (storage_path, file_url)
            
        Raises:
            StorageError: If storage operation fails
        """
        try:
            # Validate file size
            if len(file_content) > settings.MAX_FILE_SIZE:
                raise StorageError(f"File size exceeds maximum allowed size of {settings.MAX_FILE_SIZE} bytes")
            
            # Generate storage path
            storage_path = settings.get_file_storage_path(file_type, user_id, filename)
            
            # Store based on storage type
            if self.storage_type == StorageType.LOCAL:
                actual_path = self._store_local(file_content, storage_path)
                file_url = settings.get_static_file_url(file_type, user_id, filename)
                return actual_path, file_url
            
            elif self.storage_type == StorageType.S3:
                return self._store_s3(file_content, storage_path, content_type)
            
            elif self.storage_type == StorageType.GRIDFS:
                return self._store_gridfs(file_content, storage_path, content_type)
            
            else:
                raise StorageError(f"Unsupported storage type: {self.storage_type}")
                
        except Exception as e:
            raise StorageError(f"Failed to store file: {str(e)}")
    
    def _store_local(self, file_content: bytes, storage_path: str) -> str:
        """Store file in local filesystem"""
        # Convert relative path to absolute path
        if not storage_path.startswith('/'):
            full_path = Path.cwd() / storage_path
        else:
            full_path = Path(storage_path)
        
        # Ensure directory exists
        full_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Write file
        with open(full_path, 'wb') as f:
            f.write(file_content)
        
        return str(full_path)
    
    def _store_s3(self, file_content: bytes, storage_path: str, content_type: Optional[str]) -> Tuple[str, str]:
        """Store file in Amazon S3"""
        try:
            import boto3
            from botocore.exceptions import ClientError
            
            s3_client = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_REGION
            )
            
            # Upload file to S3
            s3_client.put_object(
                Bucket=settings.S3_BUCKET_NAME,
                Key=storage_path,
                Body=file_content,
                ContentType=content_type or 'application/octet-stream'
            )
            
            # Generate URL
            file_url = f"https://{settings.S3_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{storage_path}"
            
            return storage_path, file_url
            
        except ClientError as e:
            raise StorageError(f"S3 upload failed: {str(e)}")
        except ImportError:
            raise StorageError("boto3 library is required for S3 storage")
    
    def _store_gridfs(self, file_content: bytes, storage_path: str, content_type: Optional[str]) -> Tuple[str, str]:
        """Store file in MongoDB GridFS"""
        try:
            from gridfs import GridFS
            from app.core.database import get_database
            
            # This would need to be implemented with proper async/await
            # For now, this is a placeholder
            raise NotImplementedError("GridFS storage not yet implemented")
            
        except ImportError:
            raise StorageError("gridfs library is required for GridFS storage")
    
    def retrieve_file(self, storage_path: str) -> bytes:
        """
        Retrieve file content from storage
        
        Args:
            storage_path: Path where the file is stored
            
        Returns:
            File content as bytes
            
        Raises:
            StorageError: If file retrieval fails
        """
        try:
            if self.storage_type == StorageType.LOCAL:
                return self._retrieve_local(storage_path)
            elif self.storage_type == StorageType.S3:
                return self._retrieve_s3(storage_path)
            elif self.storage_type == StorageType.GRIDFS:
                return self._retrieve_gridfs(storage_path)
            else:
                raise StorageError(f"Unsupported storage type: {self.storage_type}")
                
        except Exception as e:
            raise StorageError(f"Failed to retrieve file: {str(e)}")
    
    def _retrieve_local(self, storage_path: str) -> bytes:
        """Retrieve file from local filesystem"""
        try:
            with open(storage_path, 'rb') as f:
                return f.read()
        except FileNotFoundError:
            raise StorageError(f"File not found: {storage_path}")
    
    def _retrieve_s3(self, storage_path: str) -> bytes:
        """Retrieve file from S3"""
        try:
            import boto3
            
            s3_client = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_REGION
            )
            
            response = s3_client.get_object(Bucket=settings.S3_BUCKET_NAME, Key=storage_path)
            return response['Body'].read()
            
        except Exception as e:
            raise StorageError(f"S3 retrieval failed: {str(e)}")
    
    def _retrieve_gridfs(self, storage_path: str) -> bytes:
        """Retrieve file from GridFS"""
        raise NotImplementedError("GridFS retrieval not yet implemented")
    
    def delete_file(self, storage_path: str) -> bool:
        """
        Delete file from storage
        
        Args:
            storage_path: Path where the file is stored
            
        Returns:
            True if deletion was successful
            
        Raises:
            StorageError: If file deletion fails
        """
        try:
            if self.storage_type == StorageType.LOCAL:
                return self._delete_local(storage_path)
            elif self.storage_type == StorageType.S3:
                return self._delete_s3(storage_path)
            elif self.storage_type == StorageType.GRIDFS:
                return self._delete_gridfs(storage_path)
            else:
                raise StorageError(f"Unsupported storage type: {self.storage_type}")
                
        except Exception as e:
            raise StorageError(f"Failed to delete file: {str(e)}")
    
    def _delete_local(self, storage_path: str) -> bool:
        """Delete file from local filesystem"""
        try:
            os.remove(storage_path)
            return True
        except FileNotFoundError:
            return False  # File already doesn't exist
    
    def _delete_s3(self, storage_path: str) -> bool:
        """Delete file from S3"""
        try:
            import boto3
            
            s3_client = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_REGION
            )
            
            s3_client.delete_object(Bucket=settings.S3_BUCKET_NAME, Key=storage_path)
            return True
            
        except Exception as e:
            raise StorageError(f"S3 deletion failed: {str(e)}")
    
    def _delete_gridfs(self, storage_path: str) -> bool:
        """Delete file from GridFS"""
        raise NotImplementedError("GridFS deletion not yet implemented")
    
    def file_exists(self, storage_path: str) -> bool:
        """
        Check if file exists in storage
        
        Args:
            storage_path: Path where the file should be stored
            
        Returns:
            True if file exists
        """
        try:
            if self.storage_type == StorageType.LOCAL:
                return os.path.exists(storage_path)
            elif self.storage_type == StorageType.S3:
                return self._s3_file_exists(storage_path)
            elif self.storage_type == StorageType.GRIDFS:
                return self._gridfs_file_exists(storage_path)
            else:
                return False
        except Exception:
            return False
    
    def _s3_file_exists(self, storage_path: str) -> bool:
        """Check if file exists in S3"""
        try:
            import boto3
            from botocore.exceptions import ClientError
            
            s3_client = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_REGION
            )
            
            s3_client.head_object(Bucket=settings.S3_BUCKET_NAME, Key=storage_path)
            return True
            
        except ClientError:
            return False
    
    def _gridfs_file_exists(self, storage_path: str) -> bool:
        """Check if file exists in GridFS"""
        return False  # Placeholder
    
    def cleanup_temp_files(self, hours_old: int = None) -> int:
        """
        Clean up temporary files older than specified hours
        
        Args:
            hours_old: Files older than this many hours will be deleted
                      If None, uses settings.CLEANUP_TEMP_FILES_AFTER_HOURS
            
        Returns:
            Number of files deleted
        """
        if hours_old is None:
            hours_old = settings.CLEANUP_TEMP_FILES_AFTER_HOURS
        
        if self.storage_type == StorageType.LOCAL:
            return self._cleanup_local_temp_files(hours_old)
        else:
            # For cloud storage, this would need different implementation
            return 0
    
    def _cleanup_local_temp_files(self, hours_old: int) -> int:
        """Clean up local temporary files"""
        temp_path = settings.get_base_upload_path() / settings.TEMP_FILES_SUBPATH
        if not temp_path.exists():
            return 0
        
        cutoff_time = datetime.now() - timedelta(hours=hours_old)
        deleted_count = 0
        
        for file_path in temp_path.rglob('*'):
            if file_path.is_file():
                file_mtime = datetime.fromtimestamp(file_path.stat().st_mtime)
                if file_mtime < cutoff_time:
                    try:
                        file_path.unlink()
                        deleted_count += 1
                    except Exception:
                        pass  # Skip files that can't be deleted
        
        return deleted_count
    
    def get_file_info(self, storage_path: str) -> Dict[str, Any]:
        """
        Get information about a stored file
        
        Args:
            storage_path: Path where the file is stored
            
        Returns:
            Dictionary with file information
        """
        if self.storage_type == StorageType.LOCAL:
            return self._get_local_file_info(storage_path)
        else:
            return {"exists": self.file_exists(storage_path)}
    
    def _get_local_file_info(self, storage_path: str) -> Dict[str, Any]:
        """Get information about a local file"""
        try:
            path = Path(storage_path)
            if not path.exists():
                return {"exists": False}
            
            stat = path.stat()
            return {
                "exists": True,
                "size": stat.st_size,
                "created": datetime.fromtimestamp(stat.st_ctime),
                "modified": datetime.fromtimestamp(stat.st_mtime),
                "mime_type": mimetypes.guess_type(str(path))[0]
            }
        except Exception:
            return {"exists": False}


# Global storage service instance
storage_service = FileStorageService()


def get_storage_service() -> FileStorageService:
    """Get the global storage service instance"""
    return storage_service
