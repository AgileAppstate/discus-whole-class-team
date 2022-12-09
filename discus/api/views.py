from flask import Flask, request, Response
from flask_cors import CORS, cross_origin
from discus.util import playlists
from discus.util import images
from discus.util import channels
from discus.api import app
from bson.json_util import dumps
import base64
from datetime import datetime
import logging
import sys

# db.setup() will have to be run before any actions with the database
#CORS(app, origins=['http://localhost:8080'], methods=['GET', 'POST'])
#BASE_64 convert the images

@app.route('/ping', methods=['GET'])
def status():
    #image_ids = request.args.get('id')
    #img insert test
    #f = open("json_img.txt", 'r')
    #img_ex = {
    #    "description": "testing",
    #    'end_date': 'Date Thu Dec 31 2099 00:00:00 GMT-0500 (Eastern Standard Time)',
    #    'id': "clbe5s03c00012e63z2jqlvup",
    #    'image': f.read(),
    #    'name': "test",
    #    'start_date': 'Date Wed Dec 07 2022 16:20:39 GMT-0500 (Eastern Standard Time)'
    #}

    print('myname')
    return {'mesg': 'foo'}
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
        #include all image data in another json object.
    elif (coll_name == 'channels'):
        cursor = channels.channel_get_all()
        json_data = cursor_to_json(cursor)
    resp = Response(json_data)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

@app.route('/insert_image', methods=["POST", "OPTIONS"], strict_slashes=False)
@cross_origin()
def insert_image():
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
    elif request.method == "POST":
        img_data = request.get_json()
        return _corsify_actual_response(img_data)
    else:
        raise RuntimeError("Weird - don't know how to handle method {}".format(request.method))
    #with open('test_cors.txt', 'w') as f:
        #f.write(request.get_json())
    #clean up response for insertion
    #fname, img_bytes = format_image_data(img_data['image'], img_data['name'])
    #start_date = format_date(img_data['start_date'])
    #end_date = format_date(img_data['end_date'])
    #img_id = images.image_insert(path=fname,
     #                desc=img_data['description'],
    #                 start_date=start_date,
      #               end_date=end_date,
      #               img_bytes=img_bytes)
    
    #response = jsonify(message=img_id)
    #response.headers.add("Access-Control-Allow-Origin", "*")

@app.route('/get_image_file', methods=['GET'])
def get_image_file():
    pass

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

def format_date(date_str):
    try:
        if date_str is not None:
            date_time = datetime.strptime(date_str[9:29], '%b %d %Y %H:%M:%S')
            return date_time
        else:
            return None
    except ValueError as e:
        print(e)
        return str(e)

def format_image_data(img_data, name):
    #if not request.json or not 'name' in request.json:
        #abort(400)
    headers = img_data.split(',')
    img_type_headers = headers[0].split(';')
    img_type = img_type_headers[0].split('/')[-1]
    img_bytes = base64.decodebytes(bytes(headers[1], 'utf-8'))
    fname = name + '.' + img_type
    return fname, img_bytes


def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response

def _corsify_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

#TODO

#RETURN N RECORDS (table_name, id_list)

#INSERT (no id from them) single json object or a list of json objects

#UPDATE record, list of records

#DELETE single id or a list of ids and a table name

#def collection_tojson(collectionName):
#    discus = db.get_db()
#    collection = discus.get_collection(collectionName)
#    cursor = collection.find()


