# --- IMPORTS --- #

from datetime import datetime
import random

from discus.util import db


# --- FUNCTIONS --- #

# creates a new playlist
def playlist_insert(playlistname, shuffle=False, itemList=[]):

    # Define what the playlist document will look like.
    plst = {
        "name" : playlistname,
        "items" : itemList,
        "shuffle" : shuffle,
        "date_created" : datetime.now()
    }
    # Push the playlist document to the playlists collection.
    post_id = db.playlists.insert_one(plst)
    return post_id.inserted_id

# get playlist by name
def playlist_get_id_by_name(playlistname):
    return db.playlists.find_one({"name" : playlistname})["_id"]

# get playlist by id
def playlist_get_by_id(id):
    return db.playlists.find_one({"_id" : id})

# get all playlists
def playlist_get_all():
    return db.playlists.find()

# adds image or playlist to playlist
def playlist_insert_item(playlistID, itemID, itemType):
    if itemID == playlistID:
        return
    # TODO: check if itemID is already in playlist
    db.playlists.update_one({ "_id": playlistID }, { "$push": { "items": {"type" : itemType, "objectID" : itemID } } }) # add item to playlist

# removes image or playlist from playlist
def playlist_remove_item(playlistID, itemID):
    db.playlists.update_one({ "_id": playlistID }, { "$pull": { "items": {"objectID" : itemID } } }) # remove item from playlist

# deletes the playlist
def playlist_delete(id):
    # Delete the references to this playlist in any playlists.
    for plst in db.playlists.find({"items": id}):
        playlist_remove_item(plst["_id"], id)

    # Delete the playlist document.
    db.playlists.delete(id)

# sets the shuffle mode for the playlist
def playlist_set_shuffle(id, shuffle):
    return db.playlists.update_one({ "_id": id }, { "$set": { "shuffle": shuffle } }) # set shuffle for playlist

# sets the name for the playlist
def playlist_set_name(id, name):
    return db.playlists.update_one({ "_id": id }, { "$set": { "name": name } }) # set name for playlist

# get all images in a playlist
def playlist_get_images(playlistID):
    imgs = []

    # get playlist
    chan_playlist = playlist_get_by_id(playlistID)

    # shuffle playlist if shuffle is enabled
    if chan_playlist['shuffle']:
        random.shuffle(chan_playlist['items'])

    # looping through items in chanel playlist to find any item with item
    # type playlist adding any other playlists to a list 
    for i in chan_playlist['items']:
        if i['type'] == 'playlist':
            imgs.extend(playlist_get_images(i['objectID']))
        elif i['type'] == 'image':
            imgOBJ = db.images.find_one({"_id" : i['objectID']})
            if imgOBJ["start_date"] < datetime.now() and (imgOBJ["end_date"] > datetime.now() or imgOBJ["end_date"] == None):
                imgs.append(imgOBJ)

    return imgs
