from flask import Flask, request
from discus.util import playlists
from discus.api import app

# db.setup() will have to be run before any actions with the database

@app.route('/ping', methods=['GET']):
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
