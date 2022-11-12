import re           # For string parsing.
import datetime

'''
    Version: 1.0
    Author: Utility Team
    Date created: 11/10/2022
    Date last modified: 11/10/2022
    Description:
        Creates the image tables for MonogDB
'''

'''
    The image function takes in a db and required parameters and 
    creates a post from them.
    It then adds the post to the data base
'''
def image(db, scheduled, start, end, priority, playlist, duration, uuid):

        #not finding an exact way to handle optional values. Figuring if no 
        #value is passed in it will be treated as null and can update later
    post = {"scheduled": scheduled,
        "start_date": start,
        "end_date": end,
        "priority": priority, 
        "playlist": playlist, 
        "duration": duration, 
        "uuid" : uuid}
    posts = db.posts
    post_id = posts.insert_one(post).inserted_id
    return post_id





# --- SETTINGS --- #

default_duration = 30

# --- IMAGE INSERT --- #

def insert_image(db, fs, path, schedule, duration=default_duration):
  # Get the correct collection.
  col = db["images"]

  # Parse the file name.
  filename = re.search("[^/]*$", path)[0]

  # Insert the image file into GridFS.
  with open(path, 'rb') as f:
    contents = f.read()
  img_fsid = fs.put(contents, filename=filename)

  # Define what the image document will look like.
  img = {
    "filename" : filename,
    "file_type" : re.search("[^\.]*$", filename)[0],
    "duration" : duration,
    "file_id" : img_fsid,
    "date_added" : datetime.datetime.utcnow()
  }

  # Push the image document to the images collection.
  post_id = col.insert_one(img)
  return post_id