from flask import Flask
from discus.util import playlists
from discus.api import app

# db.setup() will have to be run before any actions with the database

@app.route("/ping", methods=["GET"])
def status():
    playlists.playlist_insert("helloworld")
    return {"msg": "pong"}
