import os
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

from app.routes import routes
from app.database.database import db


def create_app():
    app = Flask(__name__)
    CORS(app)

    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    DATABASE_PATH = os.path.join(BASE_DIR, "database/users.db")

    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DATABASE_PATH}"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.init_app(app)

    from app.database.models.user import User

    with app.app_context():
        db.create_all()

    app.register_blueprint(routes)

    return app
