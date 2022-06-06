import { spawn } from "child_process";
import fs from "fs";
import { loadBackupConfig } from "./backupConfig";
import { RESTIC_CACHE_DIR } from "./env";
import { baseLogger } from "./log";
import { resolveExcludeFile } from "./resolveExcludeFile";
import { resolvePath } from "./resolvePath";

export async function createBackup(backupDirectory: string) {
  const log = baseLogger.child({ backupDirectory });
  log.info("backing up directory...");

  if (!fs.existsSync(backupDirectory)) {
    log.warn("backup directory does not exist");
    return;
  }

  const config = loadBackupConfig(backupDirectory);
  const excludeFile = resolveExcludeFile(backupDirectory);
  log.info({ config, excludeFile }, "resolved config");

  const env = {
    RESTIC_CACHE_DIR,
    RESTIC_PROGRESS_FPS: "0.1",
    RESTIC_REPOSITORY: config.resticRepository,
    RESTIC_PASSWORD_FILE: resolvePath(config.resticPasswordFile),
    GOOGLE_APPLICATION_CREDENTIALS: resolvePath(
      config.googleApplicationCredentials
    ),
  };

  log.info({ env }, "creating backup...");
  const cmd = spawn(
    "restic",
    [
      "--verbose",
      "--host",
      `"${config.host}"`,
      ...(excludeFile ? ["--exclude-file", `"${excludeFile}"`] : []),
      "backup",
      `"${backupDirectory}"`,
    ],
    {
      shell: true,
      env: { PATH: process.env.PATH, ...env },
    }
  );

  cmd.stdout.on("data", (data: Buffer) => {
    console.info(data.toString());
  });
  cmd.stderr.on("data", (data: Buffer) => {
    console.error(data.toString());
  });

  // Wait for restic to finish...
  const exitCode = await new Promise<number | null>((resolve, reject) => {
    cmd.on("error", (err) => {
      reject(err);
    });
    cmd.on("close", (exitCode) => {
      resolve(exitCode);
    });
  });

  if (exitCode === 0) {
    log.info("backup completed");
  } else {
    log.error({ exitCode }, "backup failed");
  }
}
