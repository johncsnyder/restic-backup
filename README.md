# restic-backup

## Quickstart

The default configuration directory is located at "$HOME/.config/restic". This is configured by the
environment variable `RESTIC_HOME`.

You can find a sample configuration file at "./sample/config.yaml". Copy this to your home
configuration directory and replace the placeholders with your repository information.

The configuration can be overriden partially or fully by a file placed in the root of each backup
directory named ".restic.config.yaml". The base and directory-specific configurations will be
merged.

## Google cloud project setup

Set up a dedicated google cloud project to host your backups.

Create a multi-region bucket for the Restic repository. For example,
"gs://restic-backup-respository-foobar".

Next, create a dedicated service account and download credentials for restic to authenticate and
perform automated backups.

For example, create a service account with name "restic-backup" and assign the role "Storage Object
Admin".

You'll need to initialize your repository before you can start backing up (`restic init`).

## Security

Secure your Restic home directory so that only your user has read/write privileges. For example,

```
chmod 600 $HOME/.config/restic/password
```

## Tips

Add a file "$HOME/.config/restic/env" that sets up your shell environment with your repository's
information. For example,

```
#!/bin/bash

export RESTIC_CACHE_DIR="$HOME/.cache/restic"
export RESTIC_REPOSITORY="gs:restic-backup-foo-bar:/"
export RESTIC_PASSWORD_FILE="$HOME/.config/restic/password"
export GOOGLE_APPLICATION_CREDENTIALS="$HOME/.config/restic/google-application-credentials.json"
```

You can source in this file in your shell and then easily run multiple restic commands to manage
your respository. For example,

```
source $HOME/.config/restic/env
restic init
restic snapshots
restic prune
```

## Load launchd service

There is a sample launchd configuration file located at `./sample/com.restic.backup.example.plist`.
Copy it and replace the placeholders with your repository's information. You can further customize
the backup frequency etc.

To load the service into launchd, run

```
launchctl load com.restic.backup.plist
```
