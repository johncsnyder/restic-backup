import Ajv, { JSONSchemaType } from "ajv";
import path from "path";
import { RESTIC_HOME } from "./env";
import { readMergeConfigs, validateConfig } from "./readConfig";

const ajv = new Ajv();

interface BackupConfig {
  host: string;
  resticRepository: string;
  resticPasswordFile: string;
  googleApplicationCredentials: string;
}

const schema: JSONSchemaType<BackupConfig> = {
  type: "object",
  properties: {
    host: { type: "string" },
    resticRepository: { type: "string" },
    resticPasswordFile: { type: "string" },
    googleApplicationCredentials: { type: "string" },
  },
  required: [
    "host",
    "resticRepository",
    "resticPasswordFile",
    "googleApplicationCredentials",
  ],
  additionalProperties: true,
};

const schemaValidator = ajv.compile(schema);

export function loadBackupConfig(backupDirectory: string): BackupConfig {
  // Merge the base config with the directory override config
  const config = readMergeConfigs(
    path.join(RESTIC_HOME, "config.yaml"),
    path.join(backupDirectory, ".restic.config.yaml")
  );
  return validateConfig(config, schemaValidator);
}
