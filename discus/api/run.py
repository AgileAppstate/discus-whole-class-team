from flask import Flask

app = Flask(__name__)


@app.route("/ping", methods=["GET"])
def status():
    return {"msg": "pong"}


if __name__ == "__main__":
    app.run(debug=True, port=8080)
