from flask import Flask, request
from discus.util import playlists
from discus.util import images
from discus.util import channels
from discus.api import app
from bson.json_util import dumps
import base64
import os
import json

#dropzone web, 
# db.setup() will have to be run before any actions with the database

#BASE_64 convert the images

@app.route('/ping', methods=['GET'])
def status():
    #image_ids = request.args.get('id')
    #img insert test
    f = open("json_img.txt", 'r')
    img_ex = {
        "description": "testing",
        'end_date': 'Date Thu Dec 31 2099 00:00:00 GMT-0500 (Eastern Standard Time)',
        'id': "clbe5s03c00012e63z2jqlvup",
        'image': f.read(),
        'name': "test",
        'start_date': 'Date Wed Dec 07 2022 16:20:39 GMT-0500 (Eastern Standard Time)'
    }
    
    return insert_image(img_ex['image'])
    #return {'msg':image_ids}

#get all records 
@app.route("/get_collection_<string:coll_name>", methods=["GET"])
def get_collection(coll_name):
    json_data = {}
    #we should use a generic syntax like def collection_tojson(collectionName)
    if (coll_name == 'playlists'):
        cursor = playlists.playlist_get_all()
        json_data = cursor_to_json(cursor)
    elif (coll_name == 'images'):
        cursor = images.image_get_all()
        json_data = cursor_to_json(cursor)
    elif (coll_name == 'channels'):
        cursor = channels.channel_get_all()
        json_data = cursor_to_json(cursor)
    return json_data

#@app.route('/insert_image', methods=["POST"])
def insert_image(json_entry):
    #if not request.json or not 'name' in request.json:
        #abort(400)
    headers = json_entry.split(',')
    with open(r'/images/img_test_save.jpg', 'wb') as f:
        f.write(base64.decodebytes(bytes(headers[1], 'utf-8')))
    return str(headers)
    



#Get a single record or multiple records, by id
#how to pass multiple records
#636ff99df79d9f60de9d05a4
#636ff99cf79d9f60de9d05a1
#@app.route("/get_row_<images>_<1,2,3,5,8>", methods=)
#def get_rows():

#For image insert, find where to save
#@app.route("")


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



def cursor_to_json(cursor):
    list_cursor = list(cursor)
    json_data = dumps(list_cursor, indent=4)
    return json_data

#@app.route("/get_collection_<string:coll_name>", methods=["GET"])
#def get_collection(coll_name):
#    return collection_tojson(coll_name)



#TODO
#all the table

#RETURN N RECORDS (table_name, id_list)

#INSERT (no id from them) single json object or a list of json objects

#UPDATE record, list of records

#DELETE single id or a list of ids and a table name

#def collection_tojson(collectionName):
#    discus = db.get_db()
#    collection = discus.get_collection(collectionName)
#    cursor = collection.find()


