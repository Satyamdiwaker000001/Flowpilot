import logging
from sqlalchemy.orm import Session
from fastapi import HTTPException, UploadFile
from app.features.documents.repository import FileRepository
from app.features.documents.schema import FileCreate
from app.features.documents.parser import parse_document
from app.features.documents.chunker import chunk_text
from app.db.vector import vector_db

logger = logging.getLogger(__name__)

class FileService:
    def __init__(self, db: Session):
        self.repo = FileRepository(db)

    async def upload_and_index(self, user_id: int, file: UploadFile):
        file_bytes = await file.read()
        
        # 1. Parse document
        text = parse_document(file_bytes, file.content_type)
        if not text:
            raise HTTPException(status_code=400, detail="Could not extract text from file.")
            
        # 2. Chunk text
        chunks = chunk_text(text)
        
        # 3. Save to Postgres to get file ID
        file_in = FileCreate(
            original_filename=file.filename,
            storage_key="", # In V1 we skip actual blob storage
            mime_type=file.content_type,
            file_size=len(file_bytes)
        )
        saved_file = self.repo.create_file(user_id, file_in)
        
        # 4. Upsert chunks to Vector DB
        metadata = {
            "file_id": saved_file.id,
            "filename": saved_file.original_filename,
            "user_id": user_id
        }
        vector_db.upsert_chunks(chunks, metadata)
        
        return saved_file

    def get_user_files(self, user_id: int):
        return self.repo.get_user_files(user_id)

    def get_file(self, file_id: int, user_id: int):
        f = self.repo.get_file(file_id, user_id)
        if not f:
            raise HTTPException(status_code=404, detail="File not found")
        return f
