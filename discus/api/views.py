from flask import Flask, request
from discus.util import playlists
from discus.api import app

#dropzone web, 
# db.setup() will have to be run before any actions with the database

@app.route('/ping', methods=['GET'])
    playlists.playlist_insert('helloworld')
    return {'msg':'pong'}

@app.route("/playlists", methods=["POST"])
def add_playlist():
    playlist = request.args.get('playlist')
    playlists.playlist_insert(playlist)
    return {}

@app.route('/playlists/insert', methods=["POST"])
def insert_into_playlist():
    playlist = request.args.get('playlist')
    item_id = request.args.get('item_id')
    item_type = request.args.get('item_type')
    playlists.playlist_insert_item(playlist, item_id, item_type)

@app.route("/get_collection_<string:coll_name>", methods=["GET"])
def get_collection(coll_name):
    return collection_tojson(coll_name)

#TODO
#all the table

#RETURN N RECORDS (table_name, id_list)

#INSERT (no id from them) single json object or a list of json objects

#UPDATE record, list of records

#DELETE single id or a list of ids and a table name

def collection_tojson(collectionName):
    discus = db.get_db()
    collection = discus.get_collection(collectionName)
    cursor = collection.find()
    list_cursor = list(cursor)
    json_data = dumps(list_cursor, indent=4)
    return json_data

