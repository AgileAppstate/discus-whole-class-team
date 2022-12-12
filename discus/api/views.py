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
    return jsonify(pong=str(json_data))

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
        #Appending the binary was a terrible idea, don't do this.
        #curr_dict = json.loads(json_data)
        #curr_dict.append(get_image_data_for_collection(curr_dict))
        #json_data = json.dumps(curr_dict, indent=4)
        #json_data = curr_dict
    elif (coll_name == 'channels'):
        cursor = channels.channel_get_all()
        json_data = cursor_to_json(cursor)
        
    resp = Response(json_data)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    #return jsonify(data=json.loads(json_data))
    return resp


#Playlist Routes ------------------------------------------------------------

#Insert a playlist from Web
@app.route('/api/insert_playlist', methods=["POST"])
def insert_playlist():
    #def playlist_insert(playlistname, shuffle=False, itemList=[]):
    record = request.get_data()
    json_data = json.loads(record)
    
    
    keys_list = list(json_data.keys())
    vals_list = list(json_data.values())
    
    #with open('items.txt', 'w') as f:
    #    f.write(str(keys_list))
    #    f.write('\n')
    #    f.write(str(vals_list))
    
    item_list = []
    for item in vals_list[1]:
        item_list.append({'type': 'image','objectID': ObjectId(item)})

    # !!!! We need to formate the Items lists at some point !!!!
    #with open('after.txt', 'w') as f:
    #    f.write(str(item_list))
    
    ret = playlists.playlist_insert(json_data['name'],json_data['shuffle'],item_list)
    return jsonify(ids=str([ret]))

# json expected {id: "1234", "asdf"}
@app.route('/api/edit_playlist', methods=["POST"])
def edit_playlist():
    record = request.get_data()
    json_data = json.loads(record)
    
    keys_list = list(json_data.keys())
    vals_list = list(json_data.values())
    with open('body.txt', 'w') as f:
       f.write(str(keys_list))
       f.write("\n")
       f.write(str(vals_list))
    id = ObjectId(vals_list[0])
    #find the key and select what is gonna change.
    if (keys_list[1] == 'name'):
        playlists.playlist_set_name(id,vals_list[1])
    elif (keys_list[1] == 'shuffle'):
        playlists.playlist_set_shuffle(id,vals_list[1])
    elif (keys_list[1] == 'items'):
        itemArray = []
        for item in vals_list[1]:
            itemId = ObjectId(str(item['id']))
            #{'type': "image", 'id': itemID}
            itemArray.append({'type': 'image','objectID': itemId})
        playlists.playlist_reorder(ObjectId(vals_list[0]),itemArray)
    ret_str = 'successfully edited: ' + keys_list[1] + ' to ' + vals_list[1]
    return jsonify(status=ret_str)

# json expected [{ids: "1234", "asdf"}]
@app.route('/api/delete_playlist', methods=["POST"])
def delete_playlist():
    record = request.get_data()
    ret_str = ''
    data = json.loads(record)
    keys_list = list(data.keys())
    vals_list = list(data.values())
    
    for id_val in vals_list[0]:
        # with open('body.txt', 'w+') as f:
        #     f.write(str(id_val))
        #     f.write('\n')
        ret = playlists.playlist_delete(ObjectId(str(id_val)))
        ret_str += 'successfully deleted: ' + id_val + '\n'
    return jsonify(status=ret_str)


#json -- {id: "1234number"}
@app.route('/api/get_playlist_name', methods=["POST"])
def get_playlist_name():
    record = request.get_data()
    data = json.loads(record)
    
    #with open('get_name.txt', 'w') as f:
    #    f.write(str(type(data)))
    #    f.write('\n')
    ret = playlists.playlist_get_name(ObjectId(str(data['id'])))
    #with open('get_name.txt', 'w') as f:
    #    f.write(str(ret))
    #    f.write('\n')
    return jsonify(data=str(ret))
#Channel Routes-------------------------------------------------------------

@app.route('/api/insert_channel', methods=["POST"])    
def insert_channel():
    record = request.get_data()
    json_data = json.loads(record)
    #def channel_insert(chanName, playlistID=None, mode="Daily", recurringInfo=None,startDate=None, endDate=None, timeOccurances=[]):
    new_start = format_date(json_data['start_date'])
    new_end = format_date(json_data['end_date'])
    #with open('channel.txt', 'w') as f:
    #    f.write(str(json_data))
    #    f.write('\n')
    #    f.write(str(new_start))
    #    f.write('\n')
    #    f.write(str(new_end))
    
    #Ocurrences!!!! two 'r's!
    ret = channels.channel_insert(json_data['name'], ObjectId(json_data['playlist']), json_data['mode'], json_data['recurring_info'], new_start, new_end, json_data['time_occurances'])

    return jsonify(id=str(ret))

# json expected {id: "1234", "asdf"}
@app.route('/api/edit_channel', methods=["POST"])
def edit_channel():
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
    if (keys_list[1] == 'start_date'):
        new_start = format_date(vals_list[1])
        channels.channel_set_start_date(id, new_start)
    elif (keys_list[1] == 'end_date'):
        new_end = format_date(vals_list[1])
        channels.channel_set_end_date(id, new_end)
    elif (keys_list[1] == 'name'):
        channels.channel_set_name(id, str(vals_list[1]))
    
    ret_str = 'successfully edited: ' + keys_list[1] + ' to ' + vals_list[1]
    return jsonify(status=ret_str)

# json expected [{ids: "1234", "asdf"}]
@app.route('/api/delete_channel', methods=["POST"])
def delete_channel():
    record = request.get_data()
    ret_str = ''
    data = json.loads(record)
    keys_list = list(data.keys())
    vals_list = list(data.values())
    
    for id_val in vals_list[0]:
        #with open('delete.txt', 'w+') as f:
        #    f.write(str(id_val))
        #    f.write('\n')
        ret = channels.channel_delete(ObjectId(str(id_val)))
        #ret = playlists.playlist_delete(ObjectId(str(id_val)))
        ret_str += 'successfully deleted: ' + id_val + '\n'
    return jsonify(status=ret_str)

#Image Routes-----------------------------------------------------------------

#return a list of image records
#provided a json {ids: ["1", "2"]}
#TODO! This is incomplete, not needed by web rn. use get_collection_images
@app.route("/api/get_images", methods=["POST"])
def get_image_records():
    record = request.get_data()
    json_data = json.loads(record)
    id_list = json_data['ids']
    #image_get_by_id()
    return id_list


#return bytes of a file, given 
#json expected [{id: "123num345ber"},{}]
@app.route('/api/get_image_file', methods=["POST"])
def get_image_file():
    records = request.get_data()
    return_data = []
    for record in json.loads(records):
        #with open('get_img_file.txt', 'w') as f:
        #   f.write(str(type(record['id'])))
        #    f.write('\n')
        ret = images.image_get_file(ObjectId(str(record['id'])))
        return_data.append(bytes_to_base64(ret))
    return jsonify(img_dat=return_data)

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
        date = format_date(vals_list[1])
        images.image_set_start_date(id, date)
    elif (keys_list[1] == 'end_date'):
        date = format_date(vals_list[1])
        images.image_set_end_date(id, date)
    elif (keys_list[1] == 'description'):
        images.image_set_description(id, str(vals_list[1]))
    elif (keys_list[1] == 'name'):
        images.image_set_display_name(id, str(vals_list[1]))
    
    ret_str = 'successfully edited: ' + keys_list[1] + ' to ' + vals_list[1]
    return jsonify(status=ret_str)

# json expected [{ids: "1234", "asdf"}]
@app.route('/api/delete_image', methods=["POST"])
def delete_image():
    record = request.get_data()
    ret_str = ''
    data = json.loads(record)
    keys_list = list(data.keys())
    vals_list = list(data.values())
    
    for id_val in vals_list[0]:
        with open('delete.txt', 'w+') as f:
            f.write(str(id_val))
            f.write('\n')
        ret = images.image_delete(ObjectId(str(id_val)))
        ret_str += 'successfully deleted: ' + id_val + '\n'
    return jsonify(status=ret_str)
    
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
                         duration=record['duration'],
                         desc=record['description'],
                         start_date=start_date,
                         end_date=end_date,
                         img_bytes=img_bytes,
                         display_name=record['name'])
        
        return_ids.append(ret_img_id)
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



#Extras-----------------------------------------------------------------------------

def bytes_to_base64(img_bytes):
    return base64.b64encode(img_bytes).decode('utf-8')

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

#def get_image_data_for_collection(coll_json):
    #with open('coll_json.txt', 'w') as f:
#    ret_binaries = []
#    for item in coll_json:
#        ret = images.image_get_file(ObjectId(str(item['_id']['$oid'])))
#        ret_binaries.append(str(ret))
    #        f.write(str(ret[0:10]))
    #        f.write("\n")
        #f.write(str(coll_json))
    
        
#    return {'img_binaries': ret_binaries}