# --- IMPORTS --- #

import pymongo
import gridfs
import os


# --- SETTINGS --- #

#db_username = os.environ['MONGO_USER']
#db_password = os.environ['MONGO_PASS']
#db_host = os.environ['MONGO_HOST']

db_username = "test_user"
db_password = "password1234"
db_host = "cluster0.5v8p9am.mongodb.net"


# --- FUNCTIONS --- #

# Connect to the database.
def setup(attempts=3):
    # Attempt to connect to the database.
    for attempt in range(0, attempts):
        try:
            # Try to connect.
            if (attempt == 0):
                print("Attempting to connnect to the database...")
            else:
                print("Reattempting to connect to the database...")
            client = pymongo.MongoClient("mongodb+srv://" + db_username + ":" \
                + db_password + "@" + db_host + "/")
            
            # Check if connected.
            client.server_info()
            print("connected!")
            break
        except pymongo.errors.ServerSelectionTimeoutError as err:
            print("Failed to connect.")
            print(err)
            print("Attempts left: " + (attempts - (attempt + 1)))

    # Set up databases and collections.
    global images, playlists, channels, fs
    client_discus = client['DiSCuS']
    images = client_discus["images"]
    playlists = client_discus["playlists"]
    channels = client_discus["channels"]
    client_gridfs = client["gridfs"]
    fs = gridfs.GridFS(client_gridfs)

# Method to close connection to db
def close(client):
    # check if there is an open connection
    if client.server_info():
        client.close() 
    
