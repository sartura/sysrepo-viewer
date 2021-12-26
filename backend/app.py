from flask import Flask
from flask import request
from flask_cors import CORS
import json
import sysrepo

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["POST"])
def get_sysrepo_data():
    jobj = json.loads(request.data)

    datastore = jobj["datastore"]
    path = jobj["path"]
    data = {}

    with sysrepo.SysrepoConnection() as connection:
        with connection.start_session(datastore) as session:
            data = session.get_data_ly(path)
            return json.loads(data.print_mem('json'))

    return {"ok": 100}


@app.route("/edit", methods=["POST"])
def edit_sysrepo_data():
    jobj = json.loads(request.data)

    path = jobj["path"]
    datastore = jobj["datastore"]
    value = jobj["value"]

    print(path)
    print(datastore)
    print(value)

    with sysrepo.SysrepoConnection() as connection:
        with connection.start_session(datastore) as session:
            session.edit_batch_ly()

    return {"ok": 100}
