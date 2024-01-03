import Logger, { ILogLevel } from "js-logger";

export const LOG_LEVEL_OFF = "off";
export const LOG_LEVEL_ERROR = "error";
export const LOG_LEVEL_WARN = "warn";
export const LOG_LEVEL_INFO = "info";
export const LOG_LEVEL_DEBUG = "debug";
export const LOG_LEVEL_TRACE = "trace";

export const logLevelToString = (level: ILogLevel) => {
	switch (level) {
		case Logger.OFF:
			return LOG_LEVEL_OFF;
		case Logger.ERROR:
			return LOG_LEVEL_ERROR;
		case Logger.WARN:
			return LOG_LEVEL_WARN;
		case Logger.INFO:
			return LOG_LEVEL_INFO;
		case Logger.DEBUG:
			return LOG_LEVEL_DEBUG;
		case Logger.TRACE:
			return LOG_LEVEL_TRACE;
		default:
			throw new Error("Unhandled log level");
	}
}

export const stringToLogLevel = (value: string) => {
	switch (value) {
		case LOG_LEVEL_OFF:
			return Logger.OFF;
		case LOG_LEVEL_ERROR:
			return Logger.ERROR;
		case LOG_LEVEL_WARN:
			return Logger.WARN;
		case LOG_LEVEL_INFO:
			return Logger.INFO;
		case LOG_LEVEL_DEBUG:
			return Logger.DEBUG;
		case LOG_LEVEL_TRACE:
			return Logger.TRACE;
		default:
			throw new Error(`Unhandled log level: ${value}`);
	}
}

export const formatMessageForLogger = (...args: string[]) => {
	if (args.length < 3) {
		return args[0];
	}
	const fileName = args[0];
	const functionName = args[1];
	const message = args[2];
	return `[${fileName}:${functionName}] ${message}`;
}
