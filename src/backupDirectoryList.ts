import fs from "fs";
import { RESTIC_BACKUP_DIRECTORY_LIST } from "./env";
import { resolvePath } from "./resolvePath";
import path from "path";

export function readBackupDirectoryList() {
  if (!fs.existsSync(RESTIC_BACKUP_DIRECTORY_LIST)) {
    throw new Error(
      `Backup directory list at "${RESTIC_BACKUP_DIRECTORY_LIST}" does not exist`
    );
  }

  const base = path.dirname(RESTIC_BACKUP_DIRECTORY_LIST);

  return fs
    .readFileSync(RESTIC_BACKUP_DIRECTORY_LIST)
    .toString()
    .split("\n")
    .map((value) => value.trim())
    .filter((value) => value !== "" && !value.startsWith("#"))
    .map((value) => resolvePath(base, value));
}
