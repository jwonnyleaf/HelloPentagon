from app.database.database import db
from datetime import datetime


class Notification(db.Model):
    __tablename__ = "notifications"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    file_id = db.Column(db.String(255), nullable=False)
    file_name = db.Column(db.String(255), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_dismissed = db.Column(db.Boolean, default=False)

    user = db.relationship("User", back_populates="notifications")

    def __repr__(self):
        return (
            f"<Notification ID={self.id}, Title={self.title}, User ID={self.user_id}, "
            f"File ID={self.file_id}, File Name={self.file_name}, Dismissed={self.is_dismissed}>"
        )
