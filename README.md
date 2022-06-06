# restic-backup

This app adds a thin layer of functionality around [restic](https://github.com/restic/restic), while
still intending to be very flexible.

The audience is primarily users on OS X wanting to backup their machines to a google cloud bucket.
The features are limited at the moment, but may expand in the future.

You may be interested in this app if:

- You're interested in [restic](https://github.com/restic/restic)
- You're a dev and interested in developing a simple, flexible backup system but don't want to build
  it yourself
- You like data privacy
- You hate Dropbox

This project is very new, and is currently only used by me. I've published it in case someone else
might be interested. If this project is close to what you need but you're missing some features,
open an issue and ask!

## Installation

TODO

## Configuration

The default configuration directory is configurable via the environment variable `RESTIC_HOME`. The
default is `$HOME/.config/restic`.

The file with the list of directories to backup is configurable via the environment variable
`RESTIC_BACKUP_DIRECTORY_LIST`. The default is `$HOME/.config/restic/backup-directory-list.txt`.

You can find a sample configuration file at [./sample/config.yaml]. Copy this to `RESTIC_HOME` and
replace the placeholders with your repository's information.

The configuration can be overriden partially or fully by a file placed in the root of each backup
directory named `.restic.config.yaml`. The base and directory-specific configurations will be
merged.

## Google Cloud Bucket

Don't back up your machine to an external hard drive. You'll be lulled in a false sense of security,
and in 10 years it will break and you'll lose everything.

Set up a dedicated Google Cloud project to host your backups (currently, only Google Cloud is
supported, but in the future Amazon S3 will be supported).

I'd recommend creating a multi-region bucket for your backup repository (eg
`gs://restic-backup-respository-foobar`)

You'll need a dedicated service account for authentication. Create one and assign it the role
"Storage Object Admin". Download a credentials key.

Before you can start backing up your files, you'll need to initialize your repository first (see
https://restic.readthedocs.io/en/latest/030_preparing_a_new_repo.html).

## Security

Make sure only your user can read/write files in your restic home directory, in particular your
password and google credentials files:

```
chmod 600 $HOME/.config/restic/password
chmod 600 $HOME/.config/restic/google-application-credentials.json
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

## Background service on OS X

There is a sample launchd configuration file located at `./sample/com.restic.backup.example.plist`.
Copy this file and replace the placeholders with your repository's information.

To load the service into launchd, run

```
launchctl load com.restic.backup.plist
```
