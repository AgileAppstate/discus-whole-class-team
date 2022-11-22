from flask import Flask, jsonify, request, Response
from bson.json_util import dumps
from discus.api import app

from discus.util import db
from discus.util import images

@app.route("/ping", methods=["GET"])
def status():
    return Response(response="pong", status=200)
    #playlists.playlist_insert("helloworld")
    #images_data = collection_tojson('images')
    #return images_data

#ex: http://localhost:8080/get_collection_images to receive images collection as json.
# see DB Structure on wiki or db.py for all collections
#TODO Document the DB structure!
@app.route("/get_collection_<string:coll_name>", methods=["GET"])
def get_collection(coll_name):
    return collection_tojson(coll_name)

def collection_tojson(collectionName):
    discus = db.get_db()
    collection = discus.get_collection(collectionName)
    cursor = collection.find()
    list_cursor = list(cursor)
    json_data = dumps(list_cursor, indent=4)
    return json_data

