# --- IMPORTS --- #

import db
from discus.util import screen

from discus.util.images import *
from discus.util.playlists import *
from discus.util.channels import *

# --- SETUP --- #

screen.setup()
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
    # Read the image binary.
    bin_img = db.fs.get(img["file_id"]).read()

    # Clear the canvas.
    screen.clear()

    # Draw the image.
    screen.draw_img(bin_img)

    # Sleep until the next image needs to be displayed.
    screen.sleep(img["duration"])