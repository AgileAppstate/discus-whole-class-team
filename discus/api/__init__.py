from functools import wraps
from flask import Flask
from flask_cors import CORS,cross_origin
from discus.util import playlists
from discus.util import db

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
app.url_map.strict_slashes = False
CORS(app, origins=['http://localhost:8080/*', 'http://localhost:8000/', '*'], methods=['GET', 'POST'])
# db.setup() will have to be run before any actions with the database
db.setup()

