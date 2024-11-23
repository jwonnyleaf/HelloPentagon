import os
import logging
import joblib
from flask import Blueprint, request, jsonify
from app.utils.extractor import BODMASFeatureExtractor, PEAttributeExtractor
from app.utils.classifier import MalwareClassifier


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

# Load Models
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

        pred = classifer.classify(bodmasFeatures)
        print(pred)

        return jsonify({"message": "File uploaded successfully."}), 200
    except Exception as e:
        logger.error(f"Error during processing: {str(e)}", exc_info=True)
        return jsonify({"error": "Internal server error."}), 500
