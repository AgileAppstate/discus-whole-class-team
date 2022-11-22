from flask import Flask, jsonify, request
from discus.util import *
#from discus.util import images
from discus.api import app
from bson.json_util import dumps
#from discus.util import db

@app.route("/ping", methods=["GET"])
def status():
    playlists.playlist_insert("helloworld")
    live_images = []
    cursor = db.images.find()
    list_cursor = list(cursor)
    json_data = dumps(list_cursor, indent=4)
    return json_data

@app.route("/get_image_named<string:image_name>", methods=["GET"])
def get_image_named(name):
    return images.image_get_by_name(name)


def collection_tojson()
