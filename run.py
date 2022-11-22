import sys
import pymongo

if sys.argv[1] == "util":
    from discus.util import main
elif sys.argv[1] == "api":
    from discus.api.views import app
    app.run(debug=True, port=8080)
