from flask import Blueprint, request, jsonify

routes = Blueprint('routes', __name__)

@routes.route('/api/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in request.'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No file was uploaded.'}), 400

    print(f"File uploaded: {file.filename}")
    print(f"File content: {file.content_type}")
    print(f"File size: {len(file.read())} bytes")

    file.seek(0)  

    return jsonify({'message': 'File uploaded successfully.'}), 200
