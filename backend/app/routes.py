import os
import logging
import joblib
import sqlite3
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from app.database.models.user import User
from app.utils.extractor import BODMASFeatureExtractor, PEAttributeExtractor
from app.utils.classifier import MalwareClassifier
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
        bodmasExtract = BODMASFeatureExtractor(file_data)
        bodmasFeatures = bodmasExtract.extract_features()

        # Extract PE attributes from file
        peExtract = PEAttributeExtractor(file_data)
        peAttributes = peExtract.extract()

        label, confidence = classifer.classify(bodmasFeatures)

        logger.info(f"[Pentagon] Prediction: {label}, Confidence: {confidence:.2f}")

        return (
            jsonify(
                {
                    "message": "File Processed Successfully.",
                    "prediction": {
                        "label": label,
                        "confidence": round(confidence, 2),
                    },
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
            return jsonify({"error": "Email already exists"}), 400

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

        # Check if the user exists
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401

        # Verify the password
        if not check_password_hash(user.password, password):
            return jsonify({"error": "Invalid email or password"}), 401

        # If valid, return success
        return (
            jsonify(
                {
                    "message": "Login successful",
                    "user": {"email": user.email, "name": user.name},
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"error": "An error occurred during login"}), 500
