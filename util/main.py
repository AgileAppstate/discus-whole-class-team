# --- IMPORTS --- #
import cfg

# Image processing and display.
from tkinter import *

# Database management.
import pymongo
import gridfs

# Misc.
import time         # For delay handeling.

from images import *
from playlists import *

# --- DISPLAY SETUP --- #

# Set up the fullscreen window.
root = Tk()
root.attributes('-fullscreen',True)
cfg.screen_width = root.winfo_screenwidth()
cfg.screen_height = root.winfo_screenheight()

# Create a fullscreen canvas with a black background.
canvas = Canvas(root, width = cfg.screen_width, height = cfg.screen_height)
canvas.configure(highlightthickness=0)
canvas.configure(background='black')
canvas.pack()


# --- DATABASE CONNECTION --- #

# Attempt to connect to the database.
try:
  print("connnecting to database...")
  client = pymongo.MongoClient("mongodb+srv://" + cfg.db_username + ":" \
    + cfg.db_password + "@" + cfg.db_host + "/")
  client.server_info()
  print("connected!")
except pymongo.errors.ServerSelectionTimeoutError as err:
  print("failed to connect")
  print(err)

# Set up main database.
cfg.db = client['DiSCuS']

# Set up GridFS database.
db_gridfs = client["gridfs"]
cfg.fs = gridfs.GridFS(db_gridfs)


# --- DISPLAY LOOP --- #

while 1:
  # TODO - upgrade this "find" to actually filter stuff.
  for img in cfg.db["images"].find():
    # Read the file from GridFS.
    img_file = prep_img(img)

    # Clear the canvas.
    canvas.delete("all")

    # Draw the image.
    canvas.create_image(
      cfg.screen_width / 2,
      cfg.screen_height / 2,
      anchor = CENTER,
      image = img_file
    )
    root.update()

    # Sleep for the assigned duration, or if 0, the default duration.
    time.sleep(img["duration"] if img["duration"] > 0 else cfg.default_duration)