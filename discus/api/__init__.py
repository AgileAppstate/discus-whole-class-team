from functools import wraps
from flask import Flask
from flask_cors import CORS
from discus.util import playlists
from discus.util import db

app = Flask(__name__)
CORS(app)

# db.setup() will have to be run before any actions with the database
db.setup()

