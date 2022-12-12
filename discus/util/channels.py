# --- IMPORTS --- #

from datetime import datetime
from datetime import timedelta

from discus.util import db


# --- FUNCTIONS --- #

# Creates a new channel, inserts it into the database, and returns the inserted
# channel's ID.
def channel_insert(chanName, playlistID=None, mode="Daily", recurringInfo=None,startDate=None, endDate=None, timeOccurances=[]):
    start_date_only = None
    end_date_only = None
    if isinstance(startDate, datetime):
        start_date_only = startDate.replace(hour=5, minute=0, second=0, microsecond=0)
    if isinstance(endDate, datetime):
        end_date_only = endDate.replace(hour=5, minute=0, second=0, microsecond=0)
    
    # Define what the channel document will look like.
    chan = {
        "name" : chanName,
        "playlist" : playlistID,
        "mode" : mode,
        "recurring_info" : recurringInfo,
        "start_date" : start_date_only,
        "end_date" : end_date_only,
        "time_occurances" : timeOccurances,
        "date_created" : datetime.now()
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
    return db.channels.delete_one({"_id" : id})

# sets the playlist for the channel
def channel_set_playlist(chanID, playlistID):
    return db.channels.update_one({ "_id": chanID }, { "$set": { "playlist": playlistID } }) # set playlist for channel

# sets the mode for the channel
def channel_set_mode(chanID, mode, recurringInfo=None):
    return db.channels.update_one({ "_id": chanID }, { "$set": { "mode": mode, "recurring_info": recurringInfo } }) # set mode for channel

# sets the start time for the channel
def channel_set_start_date(chanID, startDate):
    start_date_only = None
    if isinstance(startDate, datetime):
        start_date_only = startDate.replace(hour=5, minute=0, second=0, microsecond=0)
    db.channels.update_one({ "_id": chanID }, { "$set": { "start_date": start_date_only } }) # set start time for channel

# sets the end time for the channel
def channel_set_end_date(chanID, endDate):
    end_date_only = None
    if isinstance(endDate, datetime):
        end_date_only = endDate.replace(hour=5, minute=0, second=0, microsecond=0)
    db.channels.update_one({ "_id": chanID }, { "$set": { "end_date": end_date_only } }) # set end time for channel

# adds a time occurances to the channel
def channel_add_time_occurance(chanID, startTime, endTime):
    start_int = startTime.hour * 60 + startTime.minute
    end_int = endTime.hour * 60 + endTime.minute
    return db.channels.update_one({ "_id": chanID }, { "$push": { "time_occurances": {"start_time" : start_int, "end_time" : end_int } } }) # add time occurances to channel

# removes a time occurances from the channel
def channel_remove_time_occurance(chanID, startTime, endTime):
    start_int = startTime.hour * 60 + startTime.minute
    end_int = endTime.hour * 60 + endTime.minute
    return db.channels.update_one({ "_id": chanID }, { "$pull": { "time_occurances": {"start_time" : start_int, "end_time" : end_int } } }) # remove time occurances from channel

# Get a channel that is valid to be played right now. If multiple are valid,
# pick a random one.
def channel_get_live():
    # Get the current date and time.
    dt_now = datetime.now()
    dt_date = dt_now.replace(hour=0, minute=0, second=0, microsecond=0)

    # Get the current time (minutes since 00:00).
    t_now = (dt_now - dt_date).total_seconds() / 60

    # Determine if today is the last day of the month.
    last_day = int((dt_now + timedelta(1)).strftime("%d")) == 1

    # Find a valid channel.
    return db.channels.find_one({
        "$and": [
            {"$or": [
                {"$and": [
                    {"start_date" : {'$lte' : dt_now}},
                    {"end_date" : {'$gte' : dt_now}}
                ]},
                {"$and": [
                    {"start_date" : {'$lte' : dt_now}},
                    {"end_date" : None}
                ]},
                {"$and": [
                    {"start_date" : None},
                    {"end_date" : {'$eq' : dt_date}}
                ]}
            ]},
            {"$or": [
                {"time_occurances": []},
                {"and": [
                    {"time_occurances.start_time": {'$lte' : t_now}},
                    {"time_occurances.end_time": {'$gte' : t_now}},
                ]}
            ]},
            {"$or": [
                {"mode": "Daily"},
                {"$and": [
                    {"mode": "Weekly"},
                    {"recurring_info": dt_now.strftime('%a')}
                ]},
                {"$and": [
                    {"mode": "Monthly"},
                    {"$or": [
                        {"recurring_info": 32 if last_day else -1},
                        {"recurring_info": int(dt_now.strftime('%d'))}
                    ]},
                ]}
            ]},
        ]
    })
