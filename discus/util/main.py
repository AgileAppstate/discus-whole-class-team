# --- IMPORTS --- #

from discus.util import db
from discus.util import screen

from discus.util.images import *
from discus.util.playlists import *
from discus.util.channels import *

# --- SETUP --- #

screen.setup()
db.setup()


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
  # Initialize the start_time for the channel.
  start_time = datetime.now()
  prev_time = start_time
  next_swap = channel_next_swap()

  # Fetch the current channnel and then display all of the images in it.
  for img in get_live_images():
    curr_time = datetime.now()
    if (prev_time < next_swap and curr_time >= next_swap):
      break
    prev_time = curr_time

    # Read the image binary.
    bin_img = db.fs.get(img["file_id"]).read()

    # Clear the canvas.
    screen.clear()

    # Draw the image.
    screen.draw_img(bin_img)

    # Sleep until the next image needs to be displayed.
    screen.sleep(img["duration"])
