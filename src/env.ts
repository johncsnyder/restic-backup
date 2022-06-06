import { from } from "env-var";
import { resolvePath } from "./resolvePath";

const env = from(process.env, {
  asPath: resolvePath,
});

export const RESTIC_HOME = env
  .get("RESTIC_HOME")
  .default("$HOME/.config/restic")
  .asPath();

export const RESTIC_CACHE_DIR = env
  .get("RESTIC_CACHE_DIR")
  .default("$HOME/.cache/restic")
  .asPath();

// This file should contain a list of directories to backup, one directory per line
export const RESTIC_BACKUP_DIRECTORY_LIST = env
  .get("RESTIC_BACKUP_DIRECTORY_LIST")
  .default("$HOME/.config/restic/backup-directory-list.txt")
  .asPath();
