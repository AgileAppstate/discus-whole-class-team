import cfg
import re
import datetime
import io
from PIL import ImageTk, Image


# Given an image document from the database, get the image from GridFS and
# prepare it to be used with TK.
#
# Inputs:
# db_img  - An image document fetched from MongoDB.
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
#
# Inputs:
# path        - string to the image file being uploaded.
# duration    - An Integer representing the numbber of seconds to display the
#               image. Setting to 0 will use whatever the current default is.
# start_date  - A datetime object of when to start connsidering the image.
# end_date    - A datetime object of when to stop connsidering the image.
def insert_img(path, duration=0, start_date=None, end_date=None):
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
    "file_id" : img_fsid,
    "duration" : duration,
    "start_date" : start_date,
    "end_date" : end_date,
    "date_added" : datetime.datetime.utcnow()
  }

  # Push the image document to the images collection.
  post_id = col.insert_one(img)
  return post_id.inserted_id

  
def get_image_by_name(name):
  # Get the collection.
  col = cfg.db["images"]

  # Find the image with the given name.
  return col.find_one({"filename" : name})["_id"]