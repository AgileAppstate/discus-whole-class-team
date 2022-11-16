from flask import Flask, request, jsonify
import json

print(dir())

app = Flask(__name__)


@app.route("/ping", methods=["GET"])
def status():
    return {"msg": "pong"}


@app.route("/create-playlist", methods=["POST"])
def create_playlist():
    r = request.get_json()
    return {"msg": "Got request: " + json.dumps(r)}

def get_image():
    pass
    #return jsonify({'uploaded':False})

if __name__ == "__main__":
    app.run(debug=True, port=8080)
