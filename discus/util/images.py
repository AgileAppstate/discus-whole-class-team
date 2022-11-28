# --- IMPORTS --- #

import re
import datetime
from discus.util import db

from discus.util.playlists import *


# --- FUNCTIONS --- #

# Insert a new image into the database.
#
# Inputs:
# path        - string to the image file being uploaded.
# duration    - An Integer representing the numbber of seconds to display the
#               image. Setting to 0 will use whatever the current default is.
# start_date  - A datetime object of when to start connsidering the image.
# end_date    - A datetime object of when to stop connsidering the image.
def image_insert(path, duration=0, start_date=None, end_date=None):
  # Parse the file name.
  filename = re.search("[^/\\]*$", path)[0]

  # Insert the image file into GridFS.
  with open(path, 'rb') as f:
    contents = f.read()
  img_fsid = db.fs.put(contents, filename=filename)

  # Define what the image document will look like.
  img = {
    "filename" : filename,
    "file_type" : re.search("[^\.]*$", filename)[0],
    "file_id" : img_fsid,
    "duration" : duration,
    "start_date" : start_date,
    "end_date" : end_date,
    "date_added" : datetime.datetime.utcnow()
  }

  # Push the image document to the images collection.
  post_id = db.images.insert_one(img)
  return post_id.inserted_id


def image_get_by_name(name):
  # Find the image with the given name.
  return db.images.find_one({"filename" : name})["_id"]

# Return the file_id of the file associated with an image.
def image_get_file_id(id):
  return db.images.find_one({"_id" : id})["file_id"]

def image_delete(id):
  # Delete the references to this image in any playlists.
  for plst in db.playlists.find({"items": id}):
    playlist_remove_item(plst["_id"], id)

  # Delete the file from GridFS.
  db.fs.delete(image_get_file_id(id))

  # Delete the image document.
  db.images.delete(id)
