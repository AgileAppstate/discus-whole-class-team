from flask import Flask, request, Response, jsonify
from flask_cors import CORS
from discus.util import playlists
from discus.util import images
from discus.util import channels
from discus.api import app
from bson.json_util import dumps
from bson.objectid import ObjectId
import base64
import json
from datetime import datetime
#dropzone web, 
# db.setup() will have to be run before any actions with the database

#BASE_64 convert the images

@app.route('/api/ping', methods=['POST'])
def ping():
    record = request.get_data()
    json_data = json.loads(record)[0]
    return jsonify(json_data)

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
        curr_dict = json.loads(json_data)
        curr_dict.append(get_image_data_for_collection(curr_dict))
        #json_data = json.dumps(curr_dict, indent=4)
        json_data = curr_dict
    elif (coll_name == 'channels'):
        cursor = channels.channel_get_all()
        json_data = cursor_to_json(cursor)
        
    #resp = Response(json_data)
    #resp.headers['Access-Control-Allow-Origin'] = '*'
    return jsonify(data=json_data)



#Insert a playlist from Web
@app.route('/api/insert_playlist', methods=["POST"])
def insert_playlist():
    #def playlist_insert(playlistname, shuffle=False, itemList=[]):
    fields_str = 'def playlist_insert(playlistname, shuffle=False, itemList=[])'
    return jsonify(fields=fields_str)

@app.route('/api/insert_channel', methods=["POST"])    
def insert_channel():
    #def channel_insert(chanName, playlistID=None, mode="Daily", recurringInfo=None,startDate=None, endDate=None, timeOccurances=[]):
    fields_str = 'def channel_insert(chanName, playlistID=None,'
    fields_str += 'mode=\"Daily\", recurringInfo=None,startDate=None, endDate=None, timeOccurances=[])'
    return jsonify(fields=fields_str)


#return a list of image records
#provided a json {ids: ["1", "2"]}

@app.route("/api/get_images", methods=["POST"])
def get_image_records():
    record = request.get_data()
    json_data = json.loads(record)
    id_list = json_data['ids']
    #image_get_by_id()
    return id_list


#return bytes of a file, given 
#json expected {id: "123num345ber"}
@app.route('/api/get_image_file', methods=["POST"])
def get_image_file():
    records = request.get_data()
    return_data = []
    for record in json.loads(records):
        ret = images.image_get_file(ObjectId(str(record['id'])))
        return_data.append(ret)
    return jsonify(img_dat=str(return_data))

# json expected {id: "1234", "asdf"}
@app.route('/api/edit_image', methods=["POST"])
def edit_image():
    record = request.get_data()
    json_data = json.loads(record)
    
    keys_list = list(json_data.keys())
    vals_list = list(json_data.values())
    #with open('kvps.txt', 'w') as f:
    #    f.write(str(keys_list[1]))
    #    f.write("\n")
    #    f.write(str(vals_list[1]))
    id = ObjectId(vals_list[0])
    #find the key and select what is gonna change.
    if (keys_list[1] == 'duration'):
        images.image_set_duration(id, int(vals_list[1]))
    elif (keys_list[1] == 'start_date'):
        images.image_set_start_date(id, datetime(vals_list[1]))
    elif (keys_list[1] == 'end_date'):
        images.image_set_end_date(id, datetime(vals_list[1]))
    elif (keys_list[1] == 'description'):
        images.image_set_description(id, str(vals_list[1]))
    elif (keys_list[1] == 'name'):
        images.image_set_display_name(id, str(vals_list[1]))
    
    ret_str = 'successfully edited: ' + keys_list[1] + ' to ' + vals_list[1]
    return jsonify(status='successfully edited')

# json expected {ids: "1234", "asdf"}
@app.route('/api/delete_image')
def delete_image():
    record = request.get_data()
    json_data = json.loads(record)
    return jsonify(foo=str(json_data))
    
#Insert an image from Web
@app.route('/api/insert_image', methods=["POST"])
def insert_image():
    records = request.get_data()
    return_ids = []
    # this makes record a dictionary!
    for record in json.loads(records):
    #    json_data = json.loads(record)
        fname, img_bytes = format_image_data(record['image'], record['name'])
        start_date = format_date(record['start_date'])
        end_date = format_date(record['end_date'])
            
        ret_img_id = images.image_insert(path=fname,
                         duration=12,
                         desc=record['description'],
                         start_date=start_date,
                         end_date=end_date,
                         img_bytes=img_bytes,
                         display_name=fname)
                         
#        with open('sent_data.txt', 'w+') as f:
#            f.write(fname)
#            f.write("\n")
#            f.write(record['description'])
#            f.write("\n")
#            f.write(str(start_date))
#            f.write("\n")
#            f.write(str(end_date))
#            f.write("\n")
#            f.write(str(img_bytes))
        
    return jsonify(ids=str(return_ids))

def bytes_to_base64(img_bytes):
    return base64.b64encodebytes(img_bytes)

def get_keys(json_str):
    with open('get_keys.txt','w') as f:
        f.write(json_str)

def cursor_to_json(cursor):
    list_cursor = list(cursor)
    json_data = dumps(list_cursor, indent=4)
    return json_data

def format_date(date_str):
    try:
        #with open('dates.txt', 'w+') as f:
        #    f.write(date_str)
        #    f.write("\n")
        date_time = datetime.strptime(date_str[0:10], '%Y-%m-%d')
        return date_time
    except ValueError as e:
        print(e)
        return str(e)

def format_image_data(img_data, name):
    #with open('fmt_img_data.txt', 'w+') as f:
    #    f.write(name)
    #    f.write("\n")
    #    f.write(str(img_data))
    headers = img_data.split(',')
    img_type_headers = headers[0].split(';')
    img_type = img_type_headers[0].split('/')[-1]
    img_bytes = base64.decodebytes(bytes(headers[1], 'utf-8'))
    fname = name + '.' + img_type
    #with open('fmt_img_data.txt', 'w+') as f:
    #    f.write(fname)
    #    f.write("\n")
    #    f.write(str(img_bytes))
    return fname, img_bytes

def get_image_data_for_collection(coll_json):
    #with open('coll_json.txt', 'w') as f:
    ret_binaries = []
    for item in coll_json:
        ret = images.image_get_file(ObjectId(str(item['_id']['$oid'])))
        ret_binaries.append(str(ret))
    #        f.write(str(ret[0:10]))
    #        f.write("\n")
        #f.write(str(coll_json))
    
        
    return {'img_binaries': ret_binaries}
    #return 0
#TODO

#RETURN N RECORDS (table_name, id_list)

#INSERT (no id from them) single json object or a list of json objects

#UPDATE record, list of records

#DELETE single id or a list of ids and a table name