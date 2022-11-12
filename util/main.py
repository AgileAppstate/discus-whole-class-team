# --- IMPORTS --- #

# Image processing and display.
from tkinter import *
from PIL import ImageTk, Image

# Database management.
import pymongo
import gridfs

# Misc.
import time         # For delay handeling.
import io           # For reading images from GridFS

from images import *


# --- SETTINGS --- #

# TODO - Make this it's own file

default_border=10
# default_duration=30
db_username="test_user"
db_password="password1234"
db_host="cluster0.5v8p9am.mongodb.net"


# --- DISPLAY SETUP --- #

# Set up the fullscreen window.
root = Tk()
root.attributes('-fullscreen',True)
screen_width = root.winfo_screenwidth()
screen_height = root.winfo_screenheight()

# Create a fullscreen canvas with a black background.
canvas = Canvas(root, width = screen_width, height = screen_height)
canvas.configure(highlightthickness=0)
canvas.configure(background='black')
canvas.pack()

# Function for converting a Image to an ImageTk.
def prep_img(img):
  img_width, img_height = img.size
  scale = min((screen_width - (2 * default_border))/img_width, (screen_height - (2 * default_border))/img_height)
  img_resize = img.resize((int(img_width * scale), int(img_height * scale)))
  tk_img = ImageTk.PhotoImage(img_resize)
  return tk_img

# TODO : Display default image.


# --- DATABASE CONNECTION --- #

# Attempt to connect to the database.
try:
  print("connnecting to database...")
  client = pymongo.MongoClient("mongodb+srv://" + db_username + ":" + db_password + "@" + db_host + "/")
  client.server_info()
  print("connected!")
except pymongo.errors.ServerSelectionTimeoutError as err:
  print("failed to connect")
  print(err)

# Set up GridFS.
db_gridfs = client["gridfs"]
fs = gridfs.GridFS(db_gridfs)

# Set up collections.
db = client['DiSCuS']
col_images = db["images"]


# --- DISPLAY LOOP --- #

live_posts = col_images.find()
live_images = []
for post in live_posts:
  img = prep_img(Image.open(io.BytesIO(fs.get(post["file_id"]).read())))
  live_images.append(img)

while 1:
  for img in live_images:
    canvas.delete("all")
    canvas.create_image(screen_width/2, screen_height/2, anchor=CENTER, image=img)
    root.update()
    
    time.sleep(post["duration"])