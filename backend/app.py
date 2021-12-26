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


@app.route("/edit", methods=["POST"])
def edit_sysrepo_data():
    jobj = json.loads(request.data)

    print(json.dumps(jobj["modified"]))

    with sysrepo.SysrepoConnection() as connection:
        with connection.start_session() as session:
            session.edit_batch_ly(connection.get_ly_ctx().parse_data_mem(
                json.dumps(jobj["modified"]), "json", config=True, strict=True))
            session.apply_changes()
