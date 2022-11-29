# --- IMPORTS --- #
import cfg
import channels
import playlists

# Image processing and display.
from tkinter import *

# Database management.
import pymongo
import gridfs

# Misc.
import time         # For delay handeling.

from images import *
from playlists import *
from channels import *

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


# --- DATABASE QUERY --- #

# Create a list of all of the images that should be displayed.
def get_live_images(channelID):
  chan = get_channel_by_ID(channelID) 
  chan_playlist = get_playlist_by_ID(chan['playlist'])
  nested_playlists = []
  images = []
  # looping through items in chanel playlist to find any item with item
  # type playlist adding any other playlists to a list 
  for i in chan_playlist.find_one({"items"}):
    if i['type'] == 'playlist':
      nested_playlists.append(i)
    if i['type'] == 'image':
      images.append(i)

  # now we have a list of playlists, need to go through them and
  # find all images in each playlist and return as a list
  while len(nested_playlists) != 0:
    for pl in nested_playlists:
      for it in pl.find_one({"items"}):
        if it['type'] == 'playlist':
          nested_playlists.append(i)
        if it['type'] == 'image':
          images.append(i)
    nested_playlists.remove(pl)
  
  return images


# --- DISPLAY LOOP --- #

# Display the images.
while 1:
  for img in get_live_images(chan_name=''):
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