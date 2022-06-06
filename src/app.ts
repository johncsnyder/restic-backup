import SingleInstance from "single-instance";
import { readBackupDirectoryList } from "./backupDirectoryList";
import { createBackup } from "./createBackup";
import { baseLogger } from "./log";

async function run() {
  // Ensure only one instance of this application runs at a time
  const locker = new SingleInstance("restic-backup");

  try {
    await locker.lock();
  } catch (err) {
    baseLogger.error(err);
    process.exit();
  }

  const backupDirectoryList = readBackupDirectoryList();
  baseLogger.info({ backupDirectoryList }, "backup directory list");

  for (const backupDirectory of backupDirectoryList) {
    try {
      await createBackup(backupDirectory);
    } catch (err) {
      baseLogger.error({ err, backupDirectory });
    }
  }

  locker.unlock();
}

if (require.main === module) {
  run();
}
