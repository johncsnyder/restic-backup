import os from "os";
import path from "path";

export function resolvePath(...values: string[]) {
  return path.resolve(
    ...values.map((value) => value.replace("$HOME", os.homedir()))
  );
}
