import datetime
import db

# creates a new channel
def create_channel(chanName, playlistID=None):
    # Define what the channel document will look like.
    chan = {
        "name" : chanName,
        "playlist" : playlistID,
        "mode" : None,
        "date_created" : datetime.datetime.utcnow()
    }
    
    # Push the channel document to the channels collection.
    post_id = db.channels.insert_one(chan)
    return post_id.inserted_id


def get_channel_by_name(chanName):
    return db.channels.find_one({"name" : chanName})["_id"]


def set_channel_playlist(chanID, playlistID):
    db.channels.update_one({ "_id": chanID }, { "$set": { "playlist": playlistID } }) # set playlist for channel