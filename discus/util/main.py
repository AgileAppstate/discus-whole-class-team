# --- IMPORTS --- #

import random
from datetime import datetime

from discus.util import db
from discus.util import screen

from discus.util.images import *
from discus.util.playlists import *
from discus.util.channels import *

# --- SETUP --- #

screen.setup()
db.setup()


# --- DATABASE QUERY --- #

# get all images in a playlist
def get_playlist_images(playlistID):
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
            imgs.extend(get_playlist_images(i['objectID']))
        elif i['type'] == 'image':
            imgOBJ = image_get_by_id(i['objectID'])
            if imgOBJ["start_date"] < datetime.now() and imgOBJ["end_date"] > datetime.now():
                imgs.append(imgOBJ)

    return imgs

# --- DISPLAY LOOP --- #

# Display the images.
while 1:
    # Initialize the start_time for the channel.
    start_time = datetime.now()
    prev_time = start_time
    # next_swap = channel_next_swap()

    # Get the ID of the channel that should be playing.
    chan = channel_get_live()

    # If no channel is found, clear the screen, wait for 10 seconds, and try again.
    if chan is None:
        print("no channel found")
        screen.clear()
        screen.sleep(10)
        continue

    # Fetch the current channnel and then display all of the images in it.
    for img in get_playlist_images(chan['playlist']):
        # curr_time = datetime.now()
        # if (prev_time < next_swap and curr_time >= next_swap):
        # break
        # prev_time = curr_time

        # Read the image binary.
        bin_img = db.fs.get(img["file_id"]).read()

        # Clear the canvas.
        screen.clear()

        # Draw the image.
        screen.draw_img(bin_img)

        # Sleep until the next image needs to be displayed.
        screen.sleep(img["duration"])