import fs from "fs";
import path from "path";
import { RESTIC_HOME } from "./env";
import { resolvePath } from "./resolvePath";

const EXCLUDE_FILE_NAME = ".restic.exclude";

export function resolveExcludeFile(backupDirectory: string) {
  const excludeFile = path.join(RESTIC_HOME, EXCLUDE_FILE_NAME);
  if (fs.existsSync(excludeFile)) {
    return excludeFile;
  }
  const defaultExcludeFile = resolvePath(
    path.join(RESTIC_HOME, EXCLUDE_FILE_NAME)
  );
  if (fs.existsSync(defaultExcludeFile)) {
    return defaultExcludeFile;
  }
  return null;
}
