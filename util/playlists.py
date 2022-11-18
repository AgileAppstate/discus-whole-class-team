# --- IMPORTS --- #

import datetime
import db

# --- FUNCTIONS --- #

# creates a new playlist
def playlist_insert(playlistname, shuffle=False):

    # Define what the playlist document will look like.
    plst = {
        "name" : playlistname,
        "items" : [],
        "shuffle" : shuffle,
        "date_created" : datetime.datetime.utcnow()
    }
    
    # Push the playlist document to the playlists collection.
    post_id = db.playlists.insert_one(plst)
    return post_id.inserted_id

def playlist_get_by_name(playlistname):
    return db.playlists.find_one({"name" : playlistname})["_id"]

# adds image or playlist to playlist
def playlist_insert_item(playlistID, itemID, itemType):
    db.playlistts.update_one({ "_id": playlistID }, { "$push": { "items": {"type" : itemType, "objectID" : itemID } } }) # add item to playlist

# removes image or playlist from playlist
def playlist_remove_item(playlistID, itemID):
    db.playlists.update_one({ "_id": playlistID }, { "$pull": { "items": {"objectID" : itemID } } }) # remove item from playlist