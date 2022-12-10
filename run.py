import sys

argv = sys.argv
if len(argv) < 2: # No argument
    print("usage: run.py <util | api | cli>")
    sys.exit(1)

if sys.argv[1] == "util":
    from discus.util import main
elif sys.argv[1] == "api":
    from discus.api.views import app
    app.run(debug=True, port=8000)
elif sys.argv[1] == "cli":
    import discus.cli.main as main
    sys.argv.pop() # Required to prevent Click-Shell from crashing
                   # when it passes 'cli' as a parameter to its Cmd instance
    main.main()
