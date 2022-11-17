from util import cfg
from api import run
import re
import datetime
import io
from PIL import ImageTk, Image


'''
    Version: 1.0
    Author: Utility Team
    Date created: 11/10/2022
    Date last modified: 11/10/2022
    Description:
        Creates the image tables for MonogDB
'''

'''
    The image function takes in a db and required parameters and 
    creates a post from them.
    It then adds the post to the data base
'''
def image(db, scheduled, start, end, priority, playlist, duration, uuid):

        #not finding an exact way to handle optional values. Figuring if no 
        #value is passed in it will be treated as null and can update later
    post = {"scheduled": scheduled,
        "start_date": start,
        "end_date": end,
        "priority": priority, 
        "playlist": playlist, 
        "duration": duration, 
        "uuid" : uuid}
    posts = db.posts
    post_id = posts.insert_one(post).inserted_id
    return post_id


# Given an image document from the database, get the image from GridFS and
# prepare it to be used with TK.
def prep_img(db_img):
  # Open the image.
  img = Image.open(io.BytesIO(cfg.fs.get(db_img["file_id"]).read()))

  # Scale it to fit the screen.
  img_width, img_height = img.size
  scale = min(
    (cfg.screen_width - (2 * cfg.default_border)) / img_width,
    (cfg.screen_height - (2 * cfg.default_border)) / img_height
  )
  img_resize = img.resize((int(img_width * scale), int(img_height * scale)))

  # Convert it for TK and return.
  return ImageTk.PhotoImage(img_resize)


# Insert a new image into the database.
def insert_img(path, schedule, duration=0):
  # Get the correct collection.
  col = cfg.db["images"]

  # Parse the file name.
  filename = re.search("[^/\\]*$", path)[0]

  # Insert the image file into GridFS.
  with open(path, 'rb') as f:
    contents = f.read()
  img_fsid = cfg.fs.put(contents, filename=filename)

  # Define what the image document will look like.
  img = {
    "filename" : filename,
    "file_type" : re.search("[^\.]*$", filename)[0],
    "duration" : duration,
    "file_id" : img_fsid,
    "date_added" : datetime.datetime.utcnow()
  }

  # Push the image document to the images collection.
  post_id = col.insert_one(img)
  return post_id

  
def get_image_by_name(name):
  # Get the collection.
  col = cfg.db["images"]

  # Find the image with the given name.
  return col.find_one({"filename" : name})