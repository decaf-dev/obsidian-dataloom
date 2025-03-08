import Logger, { type ILogLevel } from "js-logger";
import {
	LOG_LEVEL_DEBUG,
	LOG_LEVEL_ERROR,
	LOG_LEVEL_INFO,
	LOG_LEVEL_OFF,
	LOG_LEVEL_TRACE,
	LOG_LEVEL_WARN,
} from "./constants";
import { type FormattedLogMessage } from "./types";

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
};

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
};

export const formatMessageForLogger = (
	...args: string[]
): FormattedLogMessage => {
	if (args.length < 3) {
		return { message: args[0], data: null };
	}

	const fileName = args[0];
	const functionName = args[1];
	const message = args[2];

	if (args.length === 4) {
		const data = args[3];
		if (Object.keys(data).length !== 0) {
			return {
				message: `[${fileName}:${functionName}] ${message}`,
				data: data as unknown as Record<string, unknown>,
			};
		}
	}

	return { message: `[${fileName}:${functionName}] ${message}`, data: null };
};
