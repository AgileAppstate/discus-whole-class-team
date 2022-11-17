import datetime
import cfg

# creates a new channel
def create_channel(chanName, playlistID=None):
    col = cfg.db["channels"] # get collection

    # Define what the channel document will look like.
    chan = {
        "name" : chanName,
        "playlist" : playlistID,
        "mode" : None,
        "date_created" : datetime.datetime.utcnow()
    }
    
    # Push the channel document to the channels collection.
    post_id = col.insert_one(chan)
    return post_id


def get_channel_by_name(chanName):
    col = cfg.db["channels"] # get collection
    return col.find_one({"name" : chanName})


def set_channel_playlist(chanID, playlistID):
    col = cfg.db["channels"] # get collection
    col.update_one({ "_id": chanID }, { "$set": { "playlist": playlistID } }) # set playlist for channel