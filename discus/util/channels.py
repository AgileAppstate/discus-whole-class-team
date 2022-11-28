# --- IMPORTS --- #

import datetime
from discus.util import db

# --- FUNCTIONS --- #

# creates a new channel
def channel_insert(chanName, playlistID=None, mode="Single", recurringInfo=None, startTime=None, endTime=None):
    # Define what the channel document will look like.
    chan = {
        "name" : chanName,
        "playlist" : playlistID,
        "mode" : mode,
        "recurring_info" : recurringInfo,
        "start_time" : startTime,
        "end_time" : endTime,
        "date_created" : datetime.datetime.utcnow()
    }
    
    # Push the channel document to the channels collection.
    post_id = db.channels.insert_one(chan)
    return post_id.inserted_id

# get channel by name
def channel_get_by_name(chanName):
    return db.channels.find_one({"name" : chanName})["_id"]

# get channel by id
def channel_get_by_id(id):
    return db.channels.find_one({"_id" : id})

# get all channels
def channel_get_all():
    return db.channels.find()

# deletes the channel
def channel_delete(id):
    # Delete the channel document.
    db.channels.delete(id)

# sets the playlist for the channel
def channel_set_playlist(chanID, playlistID):
    db.channels.update_one({ "_id": chanID }, { "$set": { "playlist": playlistID } }) # set playlist for channel

# sets the mode for the channel
def channel_set_mode(chanID, mode, recurringInfo=None):
    db.channels.update_one({ "_id": chanID }, { "$set": { "mode": mode, "recurring_info": recurringInfo } }) # set mode for channel

# sets the start time for the channel
def channel_set_start_time(chanID, startTime):
    db.channels.update_one({ "_id": chanID }, { "$set": { "start_time": startTime } }) # set start time for channel

# sets the end time for the channel
def channel_set_end_time(chanID, endTime):
    db.channels.update_one({ "_id": chanID }, { "$set": { "end_time": endTime } }) # set end time for channel