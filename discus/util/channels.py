# --- IMPORTS --- #

from datetime import datetime, timedelta
from discus.util import db

# --- FUNCTIONS --- #

# creates a new channel
def channel_insert(chanName, playlistID=None, mode="Daily", recurringInfo=None, startDate=None, endDate=None, timeOccurances=[]):
    # Define what the channel document will look like.
    chan = {
        "name" : chanName,
        "playlist" : playlistID,
        "mode" : mode,
        "recurring_info" : recurringInfo,
        "start_date" : startDate,
        "end_date" : endDate,
        "time_occurances" : timeOccurances,
        "date_created" : datetime.utcnow()
    }
    
    # Push the channel document to the channels collection.
    post_id = db.channels.insert_one(chan)
    return post_id.inserted_id

# get channel by name
def channel_get_id_by_name(chanName):
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
def channel_set_start_date(chanID, startDate):
    db.channels.update_one({ "_id": chanID }, { "$set": { "start_date": startDate } }) # set start time for channel

# sets the end time for the channel
def channel_set_end_date(chanID, endDate):
    db.channels.update_one({ "_id": chanID }, { "$set": { "end_date": endDate } }) # set end time for channel

# adds a time occurances to the channel
def channel_add_time_occurance(chanID, startTime, endTime):
    db.channels.update_one({ "_id": chanID }, { "$push": { "time_occurances": {"start_time" : startTime, "end_time" : endTime } } }) # add time occurances to channel

# removes a time occurances from the channel
def channel_remove_time_occurance(chanID, startTime, endTime):
    db.channels.update_one({ "_id": chanID }, { "$pull": { "time_occurances": {"start_time" : startTime, "end_time" : endTime } } }) # remove time occurances from channel

# TODO: handle last-day-of-month
# TODO: check timeOccurances
def channel_next_swap():
    db.channels.find({
        "$and": [
            {"start_date" : {'$gte' : datetime.utcnow()}},
            {"$or": [
                {"mode": "Daily"},
                {"$and": [
                    {"mode": "Weekly"},
                    {"recurring_info": datetime.utcnow().strftime('%a')}
                ]},
                {"$and": [
                    {"mode": "Monthly"},
                    {"last_name": datetime.utcnow().strftime('%d')}
                ]}
            ]}
        ]
    }).sort({"start_date": 1}).limit(1)



