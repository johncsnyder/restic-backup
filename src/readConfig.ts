import { ErrorObject, ValidateFunction } from "ajv";
import fs from "fs";
import _ from "lodash";
import YAML from "yaml";

export class ValidationError extends Error {
  errors: ErrorObject[] | null | undefined;

  constructor(message: string, errors: ErrorObject[] | null | undefined) {
    super(message);
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function readConfig(filename: string): unknown {
  if (!fs.existsSync(filename)) {
    return {};
  }
  return YAML.parse(fs.readFileSync(filename, { encoding: "utf-8" }));
}

export function readMergeConfigs(...filenames: string[]): unknown {
  if (filenames.length === 0) return {};

  const configs = filenames.map((filename) => readConfig(filename));
  const merged = configs[0];

  configs.slice(1).forEach((config) => {
    _.merge(merged, config);
  });

  return merged;
}

export function validateConfig<T>(
  config: unknown,
  schemaValidator: ValidateFunction<T>
): T {
  if (schemaValidator(config)) {
    return config;
  } else {
    throw new ValidationError("invalid backup config", schemaValidator.errors);
  }
}
