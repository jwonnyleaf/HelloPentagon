from flask import Flask, render_template, request, session, redirect, url_for
from main import chat_with_gpt  
from flask_session import Session

app = Flask(__name__)

# Configure server-side sessions
app.config["SESSION_TYPE"] = "filesystem"
app.secret_key = "your_secret_key"  # Replace with a secure key
Session(app)

# Example malware and confidence level data (these could be dynamically set)
detected_malware = "Trojan.Win32"
confidence_level = 85


@app.route("/", methods=["GET", "POST"])
def index():
    detected_malware = request.args.get("virusType")
    confidence_level = request.args.get("confidenceLevel")
    # Initialize session variables if not present
    

    if "conversation" not in session:
        session["conversation"] = []
    if "user_type_selected" not in session:
        session["user_type_selected"] = False

    if detected_malware:    # saving to session in case of convo refresh
        session["virus_type"] = detected_malware
    if confidence_level:
        session["confidence_level"] = confidence_level

    # Retrieve from session, defaulting if not set
    detected_malware = session.get("virus_type", "Unknown Virus")
    confidence_level = session.get("confidence_level", "Unknown Confidence Level")

    print("Received virusType:", detected_malware)
    print("Received confidenceLevel:", confidence_level)

    response = ""
    user_type = request.form.get("user_type")  # "novice" or "expert"
    user_input = request.form.get("user_input")  # Any direct input by the user

    # Define initial question candidates for the first visit
    if request.method == "GET" and not session["user_type_selected"]:
        initial_question = "Are you a novice or expert in malware analysis?"
        session["conversation"].append({"role": "system", "content": initial_question})

    elif request.method == "POST":
        # Handle the user's expertise level selection
        if user_type and not session["user_type_selected"]:
            session["user_type_selected"] = True  # Mark user type as selected
            if user_type == "novice":
                session["context"] = f"You are interacting with a novice user. The detected malware is {detected_malware} with a confidence level of {confidence_level}%. Provide general information and safety recommendations for the user."
            elif user_type == "expert":
                session["context"] = f"You are interacting with an expert user. The detected malware is {detected_malware} with a confidence level of {confidence_level}%. Provide technical details and recommended actions."

            # Get response from ChatGPT using the initial context
            response = chat_with_gpt(session["context"])
            session["conversation"].append({"role": "assistant", "content": response})
            
        # Handle follow-up question or custom user input
        elif user_input:
            session["conversation"].append({"role": "user", "content": user_input})
            
            # Include previous context in the prompt for ChatGPT
            full_prompt = f"{session['context']} {user_input}"
            response = chat_with_gpt(full_prompt)
            
            # Store the response in the conversation history
            session["conversation"].append({"role": "assistant", "content": response})
    
    # Mark session as modified to save changes
    session.modified = True

    # Pass conversation data to the template
    return render_template("index.html", conversation=session["conversation"], user_type_selected=session["user_type_selected"])

@app.route("/refresh")
def refresh():
    """Clear the conversation history and reset user type selection."""
    session.pop("conversation", None)
    session.pop("user_type_selected", None)
    session.pop("context", None)  # Clear the context
    return redirect(url_for("index"))

if __name__ == "__main__":
    app.run(port=5001, debug=True)
