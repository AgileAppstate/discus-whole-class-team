# --- IMPORTS --- #

import re
from datetime import datetime

from discus.util import db

from discus.util.playlists import playlist_remove_item


# --- FUNCTIONS --- #

# Insert a new image into the database.
def image_insert(path, duration=0, desc="", start_date=None, end_date=None, img_bytes=None, display_name=""):
    # Parse the file name.
    
    if img_bytes != None:
        filename = path
        contents = img_bytes
    else:
        filename = path.replace("\\", "/").split("/")[-1]
        
        # Insert the image file into GridFS.
        with open(path, 'rb') as f:
            contents = f.read()
    
    img_fsid = db.fs.put(contents, filename=filename)

    
    start_date_only = None
    if isinstance(start_date, datetime):
        start_date_only = start_date.replace(hour=0, minute=0, second=0, microsecond=0)

    end_date_only = None
    if isinstance(end_date, datetime):
        end_date_only = end_date.replace(hour=0, minute=0, second=0, microsecond=0)

    # Define what the image document will look like.
    img = {
        "filename" : filename,
        "description" : desc,
        "display_name" : display_name,
        "file_type" : re.search("[^\.]*$", filename)[0],
        "file_id" : img_fsid,
        "duration" : duration,
        "start_date" : start_date_only,
        "end_date" : end_date_only,
        "date_added" : datetime.now()
    }

    # Push the image document to the images collection.
    post_id = db.images.insert_one(img)
    return post_id.inserted_id

def image_get_id_by_name(filename):
    # Find the image with the given name.
    return db.images.find_one({"filename" : filename})["_id"]

def image_get_id_by_display_name(display_name):
    # Find the image with the given name.
    return db.images.find_one({"display_name" : display_name})["_id"]

# get image by id
def image_get_by_id(id):
    return db.images.find_one({"_id" : id})

# get all images
def image_get_all():
    return db.images.find()

# Return the file_id of the file associated with an image.
def image_get_file_id(id):
    return db.images.find_one({"_id" : id})["file_id"]

# gets the image file from image id
def image_get_file(id):
    return db.fs.get(image_get_file_id(id)).read() # get file from GridFS as a readable image

def image_delete(id):
    # Delete the references to this image in any playlists.
    for plst in db.playlists.find({"items": id}):
        playlist_remove_item(plst["_id"], id)

    # Delete the file from GridFS.
    db.fs.delete(image_get_file_id(id))

    # Delete the image document.
    db.images.delete_one({"_id" : id})


# Set the duration for an image.
def image_set_duration(id, duration):
    db.images.update_one({ "_id": id }, { "$set": { "duration": duration } }) # set duration for image

# Set the start date for an image.
def image_set_start_date(id, start_date):
    start_date_only = None
    if isinstance(start_date, datetime):
        start_date_only = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
    db.images.update_one({ "_id": id }, { "$set": { "start_date": start_date_only } }) # set start date for image

# Set the end date for an image.
def image_set_end_date(id, end_date):
    end_date_only = None
    if isinstance(end_date, datetime):
        end_date_only = end_date.replace(hour=0, minute=0, second=0, microsecond=0)
    db.images.update_one({ "_id": id }, { "$set": { "end_date": end_date_only } }) # set end date for image

# Set the description for an image.
def image_set_description(id, desc):
    db.images.update_one({ "_id": id }, { "$set": { "description": desc } }) # set description for image
   
# Set the display name for an image.
def image_set_display_name(id, display_name):
    db.images.update_one({ "_id": id }, { "$set": { "display_name": display_name } }) # set display_name for image