import datetime
import db

# creates a new playlist
def create_playlist(playlistname):

    # Define what the playlist document will look like.
    plst = {
        "name" : playlistname,
        "items" : [],
        "date_created" : datetime.datetime.utcnow()
    }
    
    # Push the playlist document to the playlists collection.
    post_id = db.playlists.insert_one(plst)
    return post_id.inserted_id

def get_playlist_by_name(playlistname):
    return db.playlists.find_one({"name" : playlistname})["_id"]

# adds image or playlist to playlist
def insert_item_to_playlist(playlistID, itemID, itemType):
    db.playlistts.update_one({ "_id": playlistID }, { "$push": { "items": {"type" : itemType, "objectID" : itemID } } }) # add item to playlist

# removes image or playlist from playlist
def remove_item_from_playlist(playlistID, itemID):
    db.playlists.update_one({ "_id": playlistID }, { "$pull": { "items": {"objectID" : itemID } } }) # remove item from playlist