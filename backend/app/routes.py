import os
import logging
import joblib
import sqlite3
from datetime import datetime, timedelta, timezone
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from app.database.models.user import User
from app.database.models.file import File
from app.utils.extractor import BODMASFeatureExtractor, PEAttributeExtractor
from app.utils.classifier import MalwareClassifier
from app.utils.family import MalwareFamily
from app.database.database import db


class ColorFormatter(logging.Formatter):
    COLORS = {
        "DEBUG": "\033[94m",  # Blue
        "INFO": "\033[92m",  # Green
        "WARNING": "\033[93m",  # Yellow
        "ERROR": "\033[91m",  # Red
        "CRITICAL": "\033[95m",  # Magenta
    }
    RESET = "\033[0m"

    def format(self, record):
        log_color = self.COLORS.get(record.levelname, self.RESET)
        message = super().format(record)
        return f"{log_color}{message}{self.RESET}"


logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()],
)
logger = logging.getLogger()
for handler in logger.handlers:
    handler.setFormatter(ColorFormatter("%(asctime)s [%(levelname)s] %(message)s"))

routes = Blueprint("routes", __name__)

# Initial Malware Classifier
classifer = MalwareClassifier()
logger.info(f"{len(classifer.model)} models loaded successfully.")


@routes.route("/api/upload", methods=["POST"])
def upload():
    if "file" not in request.files:
        return jsonify({"error": "No file part in request."}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No file was uploaded."}), 400

    # Print File Information'
    logger.info(f"[Pentagon] Processing file: {file.filename}")

    try:
        # Extract features from file
        file_data = file.read()

        # Extract BODMAS features from file
        bodmasExtract = BODMASFeatureExtractor(file_data)
        bodmasFeatures = bodmasExtract.extract_features()
        label, confidence = classifer.classify(bodmasFeatures)

        # Extract PE attributes from file
        peExtract = PEAttributeExtractor(file_data)
        peAttributes = peExtract.extract()

        # Family Prediction
        familyExtract = MalwareFamily()
        familyResult = familyExtract.getfamily(file_data)

        data = request.form or request.json
        user_id = data.get("user_id")
        if not user_id:
            return jsonify({"error": "User ID is required."}), 400

        new_file = File(
            user_id=user_id,
            file_name=file.filename,
            prediction_label=label,
            prediction_confidence=confidence,
            family=familyResult,
        )

        db.session.add(new_file)
        db.session.commit()

        logger.info(
            f"[Pentagon] Saved file info to database: {file.filename}, File ID: {new_file.id}"
        )

        return (
            jsonify(
                {
                    "message": "File Processed Successfully.",
                    "file_id": new_file.id,
                    "prediction": {
                        "label": label,
                        "confidence": round(confidence, 2),
                    },
                    "family": familyResult,
                }
            ),
            200,
        )
    except Exception as e:
        logger.error(f"Error during processing: {str(e)}", exc_info=True)
        return jsonify({"error": "Internal server error."}), 500


@routes.route("/api/signup", methods=["POST"])
def signup():
    try:
        data = request.json
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if not name or not email or not password:
            return jsonify({"error": "All fields are required"}), 400

        hashed_password = generate_password_hash(password)

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"error": "Email Already Exists"}), 400

        new_user = User(name=name, email=email, password=hashed_password)

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        logger.error(f"Error during registration: {str(e)}", exc_info=True)
        return jsonify({"error": "An error occurred during registration"}), 500


@routes.route("/api/login", methods=["POST"])
def login():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")

        # Validate User Exists in Database
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401

        # Validate Password
        if not check_password_hash(user.password, password):
            return jsonify({"error": "Invalid email or password"}), 401

        return (
            jsonify(
                {
                    "message": "Login successful",
                    "user": {"id": user.id, "email": user.email, "name": user.name},
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"error": "An error occurred during login"}), 500


@routes.route("/api/user", methods=["GET"])
def get_user_id():
    username = request.args.get("username")

    if not username:
        return jsonify({"error": "Username is required"}), 400

    user = User.query.filter_by(name=username).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"user_id": str(user.id)}), 200


@routes.route("/api/user/<int:user_id>/files", methods=["GET"])
def get_user_files(user_id):
    try:
        # Validate the user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Optional filters
        search_query = request.args.get("search", "").lower()
        sort_by = request.args.get("sort_by", "created_at")
        order = request.args.get("order", "desc")
        last_week = request.args.get("last_week", "false").lower() == "true"

        files_query = File.query.filter_by(user_id=user_id)

        if last_week:
            one_week_ago = datetime.now(timezone.utc) - timedelta(days=7)
            files_query = files_query.filter(File.created_at >= one_week_ago)
        if search_query:
            files_query = files_query.filter(File.file_name.ilike(f"%{search_query}%"))
        if order == "desc":
            files_query = files_query.order_by(getattr(File, sort_by).desc())
        else:
            files_query = files_query.order_by(getattr(File, sort_by).asc())

        # Fetch files
        files = files_query.all()
        result = [
            {
                "file_id": file.id,
                "file_name": file.file_name,
                "prediction_label": file.prediction_label,
                "prediction_confidence": file.prediction_confidence,
                "family": file.family,
                "created_at": file.created_at,
            }
            for file in files
        ]

        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Error fetching user files: {str(e)}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500
