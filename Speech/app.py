from time import time
from flask import (
    Flask,
    request,
    render_template,
    redirect,
    url_for,
    make_response,
    session,
)
from processing.sst import *
import os
from flask_cors import CORS

# Initialize the Flask application
app = Flask(__name__)
app.secret_key = "A0Zr98j/3yX R~XHH!jmNlLWX/,?cT"
CORS(app, resources={"/*": {"origins": "*"}})


@app.route("/")
def index():
    return redirect(url_for("ui"))


@app.route("/ui", methods=["GET"])
def ui(status=302):
    return render_template("index.html", status=status)


# The stt post request will take an audio file and return predicted text
@app.route("/stt", methods=["POST", "GET"])
def sst():
    if request.method == "POST":
        file = request.files["file"]
        ext = file.filename.split(".")[-1]
        filename = "temp." + ext
        file.save(os.path.join(os.path.dirname(__file__), "tmp/" + filename))
        text = predictAudio(os.path.join(os.path.dirname(__file__), "tmp/" + filename))
        os.remove(os.path.join(os.path.dirname(__file__), "tmp/" + filename))
        # Add text translation to session array\
        print("Text: ", text)
        if "translations" in session and session["translations"] is not None:
            print("Appending")
            session["translations"].append({"text": text})
            session["translations"] = session["translations"][-10:]
        else:
            print("Defining")
            session["translations"] = [{"text": text}]
        print("Translations in stt: ", session["translations"])
        return {"text": text}


@app.route("/translations", methods=["GET"])
def translations():
    # get all translations from session
    if request.method == "GET":
        if "translations" in session:
            return {"translations": session["translations"]}
        else:
            return {"translations": []}


# start server on port 5000
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

