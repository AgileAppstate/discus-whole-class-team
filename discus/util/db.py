# --- IMPORTS --- #

import pymongo
import gridfs
import os

# --- SETTINGS --- #

db_username = os.environ['MONGO_USER']
db_password = os.environ['MONGO_PASS']
db_host = os.environ['MONGO_HOST']


# --- FUNCTIONS --- #

def setup():
  # Attempt to connect to the database.
  try:
    print("connnecting to database...")
    client = pymongo.MongoClient("mongodb+srv://" + db_username + ":" \
      + db_password + "@" + db_host + "/")
    client.server_info()
    print("connected!")
  except pymongo.errors.ServerSelectionTimeoutError as err:
    print("failed to connect")
    print(err)

  # Set up databases and collections.
  global images, playlists, channels, fs
  db_discus = client['DiSCuS']
  images = db_discus["images"]
  playlists = db_discus["playlists"]
  channels = db_discus["channels"]
  db_gridfs = client["gridfs"]
  fs = gridfs.GridFS(db_gridfs)