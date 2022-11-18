# --- IMPORTS --- #
import cfg

# Image processing and display.
from tkinter import *

# Misc.
import time         # For delay handeling.

from images import *
from playlists import *
from channels import *
import db

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

db.setup()


# --- DATABASE QUERY --- #

# Create an array of all of the images that should be displayed.
def get_live_images():
  # TODO - upgrade this "find" to actually filter stuff.
  return db.images.find()


# --- DISPLAY LOOP --- #

# Display the images.
while 1:
  for img in get_live_images():
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