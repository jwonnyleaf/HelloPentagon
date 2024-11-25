from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.database.database import db
import uuid
from datetime import datetime


class File(db.Model):
    __tablename__ = "files"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(Integer, ForeignKey("users.id"), nullable=False)
    file_name = db.Column(db.String(255), nullable=False)
    prediction_label = db.Column(db.String(255), nullable=False)
    prediction_confidence = db.Column(db.Float, nullable=False)
    family = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="files")

    def __repr__(self):
        return (
            f"<File id={self.id}, file_name={self.file_name}, user_id={self.user_id}>"
        )
