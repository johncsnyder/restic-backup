import parentLogger from "pino";

/**
 * The base logger, from which a child logger can be derived.
 *
 * With base as undefined, the logger will not automatically include hostname and pid.
 *
 * For more information, see https://github.com/pinojs/pino/blob/master/docs/api.md
 */
export const baseLogger = parentLogger({
  base: undefined,
  transport: {
    target: "pino-pretty",
    options: {
      translateTime: true,
      ignore: "err.stack",
    },
  },
});
