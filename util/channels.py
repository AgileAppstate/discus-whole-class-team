# --- IMPORTS --- #

from datetime import datetime, timedelta
import db

# --- FUNCTIONS --- #

# creates a new channel
def channel_insert(chanName, playlistID=None):
    # Define what the channel document will look like.
    chan = {
        "name" : chanName,
        "playlist" : playlistID,
        "mode" : None,
        "date_created" : datetime.utcnow()
    }
    
    # Push the channel document to the channels collection.
    post_id = db.channels.insert_one(chan)
    return post_id.inserted_id


def channel_get_by_name(chanName):
    return db.channels.find_one({"name" : chanName})["_id"]


def channel_set_playlist(chanID, playlistID):
    db.channels.update_one({ "_id": chanID }, { "$set": { "playlist": playlistID } }) # set playlist for channel

def channel_next_swap():
    # return datetime.utcnow() + timedelta(minutes=30)
    return db.channels.find_one({"start_date" : {'$gte' : datetime.utcnow()}})["start_date"]