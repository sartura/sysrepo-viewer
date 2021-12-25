from flask import Flask
from flask import request
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["POST"])
def hello_world():
    # fetch all sysrepo data based on the query
    jobj = json.loads(request.data)
    return {

    }
