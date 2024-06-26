from features.check_phone_number.checking_FTC import check_ftc_records
from features.data.post_call_summary import run
from features.data.custom_model import run as run_percentage
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os

application = Flask(__name__, static_folder="my-react-app/build", static_url_path="")
app = application

UPLOAD_FOLDER = '/uploads'  # Update this path to where you want to store uploaded files
ALLOWED_EXTENSIONS = {'mp3'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Allow CORS for all domains on all routes
CORS(app)

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/api/submit", methods=["POST"])
def submit_username():
    data = request.json
    username = data.get("username")
    if username:
        print(f"\n Received username: {username}")
        return jsonify({"message": f"Hello, {username}!"}), 200
    else:
        return jsonify({"error": "No username provided"}), 400


@app.route("/api/check_phone_number", methods=["POST"])
def check_phone_number():
    data = request.json
    phone_number = data.get("phone_number")
    print(phone_number)
    status, result, time_taken, total_records = check_ftc_records(phone_number)

    if status == 1:
        response = {
            "status": "success",
            "result": result,
            "time_taken": f"{time_taken:.10f} seconds",
            "total_records": total_records,
        }
    else:
        response = {
            "status": "not_found",
            "message": "Record not found",
            "time_taken": f"{time_taken:.10f} seconds",
            "total_records": total_records,
        }

    print(response)
    return jsonify(response)


@app.route("/api/summarize", methods=["POST"])
def summarize_call():
    data = request.json
    message = data.get("message")

    response = summarize_call(message)

    if response:
        return jsonify({"summary": f"Summary of the call: {response}"}), 200
    else:
        return jsonify({"error": "No message provided"}), 400

@app.route("/api/post_call_transcript_with_emotion", methods=["POST"])
def post_call_summary():
    data = request.json
    message = data.get("message")
    response = run(message)
    if response:
        return jsonify({"summary": f"Summary of the call: {response}"}), 200
    else:
        return jsonify({"error": "No message provided"}), 400

@app.route("/api/post_scam_likely", methods=["POST"])
def scam_likely():
    data = request.json
    message = data.get("message")

    if message:
        response = run_percentage(message)  # Assuming run_percentage is defined elsewhere
        return jsonify(response), 200
    else:
        return jsonify({"error": "No message provided"}), 400
    
if __name__ == "__main__":
    app.run(debug=True, port=os.getenv("PORT", default=5000))
