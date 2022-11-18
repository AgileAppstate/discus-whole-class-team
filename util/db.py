# --- IMPORTS --- #

import pymongo
import gridfs

# --- SETTINGS --- #

# TODO - move these to env variables.
db_username = "test_user"
db_password = "password1234"
db_host = "cluster0.5v8p9am.mongodb.net"


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