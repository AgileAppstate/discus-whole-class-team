from flask import Flask, request, jsonify
<<<<<<< Updated upstream:discus/api/run.py
import json

#print(dir())
=======
import sys
import json

print(sys.path)
>>>>>>> Stashed changes:api/run.py

app = Flask(__name__)


@app.route("/ping", methods=["GET"])
def status():
    return {"msg": "pong"}


@app.route("/create-playlist", methods=["POST"])
def create_playlist():
    r = request.get_json()
    return {"msg": "Got request: " + json.dumps(r)}

<<<<<<< Updated upstream:discus/api/run.py
def get_image():
    pass
    #return jsonify({'uploaded':False})

def start_api():
=======
if __name__ == "__main__":
>>>>>>> Stashed changes:api/run.py
    app.run(debug=True, port=8080)
