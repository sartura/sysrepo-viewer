from flask import Flask
from flask import request
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["POST"])
def get_sysrepo_data():
    jobj = json.loads(request.data)
    return {

    }
