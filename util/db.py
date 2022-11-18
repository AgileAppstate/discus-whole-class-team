import pymongo
import gridfs

# settings
# TODO - move these to env variables.
db_username = "test_user"
db_password = "password1234"
db_host = "cluster0.5v8p9am.mongodb.net"

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

  # Set up main database.
  global discus, images, playlists, channels, fs

  discus = client['DiSCuS']
  images = discus["images"]
  playlists = discus["playlists"]
  channels = discus["channels"]

  # Set up GridFS database.
  db_gridfs = client["gridfs"]
  fs = gridfs.GridFS(db_gridfs)