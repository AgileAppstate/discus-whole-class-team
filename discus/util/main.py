# --- IMPORTS --- #

from datetime import datetime
from math import floor

from discus.util import db
from discus.util import screen

from discus.util.images import *
from discus.util.playlists import *
from discus.util.channels import *


# --- SETUP --- #

db.setup()
screen.setup()

# --- DISPLAY LOOP --- #

while 1:
    # Get the the channel that should be playing.
    chan = channel_get_live()

    # If no channel is found, clear the screen, wait for 1min, and try again.
    if chan is None:
        print("no channel found")
        screen.clear()
        screen.sleep(60)
        continue
    else:
        print("Playing channel: " + chan["name"])

    # Fetch the current channnel and then display all of the images in it.
    for img in playlist_get_images(chan['playlist']):

        # If the ID of the channel returned from channel_get_live() is different
        # than the one currently being displayed, stop showing this channel.
        chan_next = channel_get_live()
        if (chan_next is None or chan["_id"] != chan_next["_id"]):
            break

        # Read the image binary.
        bin_img = db.fs.get(img["file_id"]).read()

        # Clear the canvas.
        screen.clear()

        # Draw the image.
        screen.draw_img(bin_img)

        # Sleep until the next image needs to be displayed.
        screen.sleep(int(img["duration"]))
