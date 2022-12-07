# DiSCuS Documentation

In this folder, you'll find various documentation surrounding the project

## Systemd Service File

The `discus.service` file should be installed as a systemd service.

The safest way to do that would be to copy and paste the file content into the
editor after running this command:
```shell
systemctl edit --force --full discus.service
```

You can also copy the file to `/etc/systemd/system/`. Using this method, you
will have to manually reload the systemd configuration: `systemctl
daemon-reload`.
