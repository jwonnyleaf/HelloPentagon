import os
import logging
import joblib
import sqlite3
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
from threading import Timer
from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from openai import OpenAI
from app.database.models.user import User
from app.database.models.file import File
from app.database.models.notification import Notification
from app.utils.extractor import BODMASFeatureExtractor, PEAttributeExtractor
from app.utils.classifier import MalwareClassifier
from app.utils.family import MalwareFamily
from app.database.database import db
from app.socketio import socketio


env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
load_dotenv(env_path)


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
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()],
)
logger = logging.getLogger()
for handler in logger.handlers:
    handler.setFormatter(ColorFormatter("%(asctime)s [%(levelname)s] %(message)s"))

routes = Blueprint("routes", __name__)

# Initialize OpenAI API
openAIClient = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Initialize Malware Classifier
classifer = MalwareClassifier()
logger.info(f"{len(classifer.model)} models loaded successfully.")


@socketio.on("connect")
def handle_connect():
    sid = request.sid
    logger.info(f"Client connected to the WebSocket. SID: {sid}")


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

        if label == "Goodware":
            familyResult = "N/A"

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

        if label == "Malware":
            logger.info(f"[Pentagon] Scheduling Alert Timer for File ID {new_file.id}.")
            schedule_alert_timer(new_file.user_id, new_file.id, new_file.file_name)

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


def schedule_alert_timer(user_id, file_id, file_name):
    """
    Schedule a malware alert notification after 30 seconds.
    """
    app = current_app._get_current_object()

    def create_alert():
        try:
            logger.info(f"Timer triggered for File ID {file_id}, creating alert...")
            with app.app_context():

                existing_alert = Notification.query.filter_by(
                    user_id=user_id, file_id=file_id
                ).first()
                if existing_alert:
                    logger.info(
                        f"Alert already exists for File ID {file_id}, skipping creation."
                    )
                    return

                alert = Notification(
                    user_id=user_id,
                    file_id=file_id,
                    file_name=file_name,
                    title="Malware Detected",
                    message=f"A malware was detected in the file '{file_name}'. Please review and take action.",
                )
                db.session.add(alert)
                db.session.commit()

                socketio.emit(
                    "new_alert",
                    {
                        "file_name": file_name,
                    },
                )
                logger.info(f"Malware Alert created and emitted for File ID {file_id}.")
        except Exception as e:
            logger.error(
                f"Error creating alert for File ID {file_id}: {str(e)}",
                exc_info=True,
            )

    logger.info(f"Starting Timer for File ID {file_id}.")
    Timer(30.0, create_alert).start()


@routes.route("/api/register", methods=["POST"])
def register():
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
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "name": user.name,
                        "level": user.level,
                    },
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


@routes.route("/api/file/<string:file_id>", methods=["GET"])
def get_file_details(file_id):
    """
    Fetch detailed information about a specific file.
    """
    try:
        # Fetch the file from the database
        file = File.query.filter_by(id=file_id).first()
        if not file:
            return jsonify({"error": "File not found"}), 404

        # Construct response data
        result = {
            "file_id": file.id,
            "file_name": file.file_name,
            "prediction_label": file.prediction_label,
            "prediction_confidence": round(file.prediction_confidence * 100, 2),
            "family": file.family,
            "created_at": file.created_at.isoformat(),
            "user_id": file.user_id,
        }

        return jsonify(result), 200

    except Exception as e:
        logger.error(f"Error fetching file details: {str(e)}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500


@routes.route("/api/chat", methods=["POST"])
def chat():
    """
    Handle chat queries and provide AI-based responses with malware context.
    """
    try:
        data = request.json
        query = data.get("query")
        level = data.get("level")
        chat_history = data.get("chatHistory", [])
        malware_details = data.get("malwareDetails", {})

        if not query:
            return jsonify({"error": "Query is required."}), 400

        messages = [
            {
                "role": "system",
                "content": f"""You are a cybersecurity specialist assisting a client. Provide explanations and recommendations tailored for a {level} user. Adjust the level of technical detail accordingly.
                The client has provided you with the following email about the malware:
                I ran malware analysis software on a file and received the following results:
                    - **Confidence Score**: {malware_details.get("confidence", 0)}
                    - **Detection Status**: {malware_details.get("label", "Unknown")}
                    - **Malware Family Type**: {malware_details.get("family", "Unknown")}

                Based on this analysis:
                1. Provide a clear recommendation on how to handle the file (e.g., quarantine, delete, or ignore).
                2. If applicable, include any additional precautions or steps the user should take to mitigate risks.

                Ensure the recommendations are actionable and concise, tailored to the detected malware characteristics.""",
            },
        ]

        for message in chat_history:
            messages.append(
                {
                    "role": "user" if message["sender"] == "user" else "system",
                    "content": message["message"],
                }
            )

        messages.append({"role": "user", "content": query})

        response = openAIClient.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=750,
            temperature=0.7,
        )

        ai_response = response.choices[0].message.content.strip()
        return jsonify({"response": ai_response}), 200

    except Exception as e:
        logger.error(f"Error in /api/chat: {str(e)}", exc_info=True)
        return jsonify({"error": "Failed to process the chat request."}), 500


@routes.route("/api/set-level", methods=["PUT"])
def set_level():
    """
    Update the proficiency level of a user.
    """
    try:
        data = request.json
        user_id = data.get("user_id")
        level = data.get("level")

        # Validate input
        if not user_id or not level:
            return jsonify({"error": "User ID and level are required."}), 400

        if level not in ["Beginner", "Intermediate", "Expert"]:
            return (
                jsonify(
                    {
                        "error": "Invalid level. Choose Beginner, Intermediate, or Expert."
                    }
                ),
                400,
            )

        # Retrieve the user from the database
        user = User.query.get(user_id)

        if not user:
            return jsonify({"error": "User not found."}), 404

        # Update the user's level
        user.level = level
        db.session.commit()

        return jsonify({"message": "Proficiency level updated successfully!"}), 200

    except Exception as e:
        print(f"Error in /api/set-level: {e}")
        return jsonify({"error": "An error occurred while updating the level."}), 500


@routes.route("/api/notifications/<int:user_id>", methods=["GET"])
def get_notifications(user_id):
    """
    Fetch active notifications for a user.
    """
    try:
        notifications = Notification.query.filter_by(
            user_id=user_id, is_dismissed=False
        ).all()
        return (
            jsonify(
                [
                    {
                        "id": n.id,
                        "file_id": n.file_id,
                        "file_name": n.file_name,
                        "title": n.title,
                        "message": n.message,
                        "created_at": n.created_at,
                    }
                    for n in notifications
                ]
            ),
            200,
        )
    except Exception as e:
        logger.error(f"Error fetching notifications: {str(e)}", exc_info=True)
        return jsonify({"error": "An error occurred while fetching notifications"}), 500


@routes.route("/api/notifications/<int:notification_id>/dismiss", methods=["PUT"])
def dismiss_notification(notification_id):
    """
    Dismiss a notification by its ID.
    """
    try:
        notification = Notification.query.get(notification_id)
        if not notification:
            return jsonify({"error": "Notification not found"}), 404

        notification.is_dismissed = True
        db.session.commit()

        return jsonify({"message": "Notification dismissed successfully"}), 200
    except Exception as e:
        print(f"Error dismissing notification: {e}")
        return (
            jsonify({"error": "An error occurred while dismissing the notification"}),
            500,
        )


@routes.route("/api/notifications/<int:user_id>/count", methods=["GET"])
def get_undismissed_alerts_count(user_id):
    """
    Fetch the count of undismissed notifications for a user.
    """
    try:
        count = Notification.query.filter_by(
            user_id=user_id, is_dismissed=False
        ).count()
        return jsonify({"count": count}), 200
    except Exception as e:
        logger.error(f"Error fetching undismissed notifications count: {str(e)}")
        return jsonify({"error": "An error occurred while fetching the count"}), 500
