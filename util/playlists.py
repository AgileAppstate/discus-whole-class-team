import datetime
import cfg

# creates a new playlist
def create_playlist(playlistname):
    col = cfg.db["playlists"] # get collection

    # Define what the playlist document will look like.
    plst = {
        "name" : playlistname,
        "items" : [],
        "date_created" : datetime.datetime.utcnow()
    }
    
    # Push the playlist document to the playlists collection.
    post_id = col.insert_one(plst)
    return post_id.inserted_id

def get_playlist_by_name(playlistname):
    col = cfg.db["playlists"] # get collection
    return col.find_one({"name" : playlistname})["_id"]

# adds image or playlist to playlist
def insert_item_to_playlist(playlistID, itemID, itemType):
    col = cfg.db["playlists"] # get collection
    col.update_one({ "_id": playlistID }, { "$push": { 
                    "items": {"type" : itemType, "objectID" : itemID } } }) # add item to playlist

# removes image or playlist from playlist
def remove_item_from_playlist(playlistID, itemID):
    col = cfg.db["playlists"] # get collection
    col.update_one({ "_id": playlistID }, { "$pull": { "items": {"objectID" : itemID } } }) # remove item from playlist