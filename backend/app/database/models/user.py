from sqlalchemy import Column, Integer, String
from app.database.database import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(Integer, primary_key=True, autoincrement=True)
    name = db.Column(String, nullable=False)
    email = db.Column(String, unique=True, nullable=False)
    password = db.Column(String, nullable=False)
