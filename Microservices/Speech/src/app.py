from flask import Flask, request, render_template, redirect, url_for
from sst import *
import os

# Initialize the Flask application
app = Flask(__name__)


@app.route("/")
def index():
    return "Hello World!"


@app.route("/ui", methods=["GET"])
def ui():
    return render_template("index.html")


# The stt post request will take an audio file and return predicted text
@app.route("/stt", methods=["POST"])
def sst():
    if request.method == "POST":
        file = request.files["file"]
        ext = file.filename.split(".")[-1]
        filename = "temp." + ext
        file.save(os.path.join(os.path.dirname(__file__), "tmp/" + filename))
        text = predictAudio(os.path.join(os.path.dirname(__file__), "tmp/" + filename))
        os.remove(os.path.join(os.path.dirname(__file__), "tmp/" + filename))
        return {"text": text}


# start server on port 5000
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
