from sqlalchemy.orm import Session
from app.features.documents.model import UploadedFile
from app.features.documents.schema import FileCreate

class FileRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_file(self, user_id: int, file_in: FileCreate) -> UploadedFile:
        db_obj = UploadedFile(**file_in.model_dump(), user_id=user_id)
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def get_user_files(self, user_id: int):
        return self.db.query(UploadedFile).filter(UploadedFile.user_id == user_id).all()

    def get_file(self, file_id: int, user_id: int):
        return self.db.query(UploadedFile).filter(UploadedFile.id == file_id, UploadedFile.user_id == user_id).first()
