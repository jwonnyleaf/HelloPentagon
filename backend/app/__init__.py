import os
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text

from app.routes import routes
from app.database.database import db
from app.socketio import socketio


def create_app():
    app = Flask(__name__)
    CORS(app)

    socketio.init_app(app)

    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    DATABASE_PATH = os.path.join(BASE_DIR, "database/pentagon.db")

    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DATABASE_PATH}"
    db.init_app(app)

    from app.database.models.user import User
    from app.database.models.file import File

    with app.app_context():
        db.create_all()

    app.register_blueprint(routes)

    return app
