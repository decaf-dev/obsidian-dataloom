import React from "react";
import { useAppSelector } from "src/redux/global/hooks";

export const log =
	(shouldDebug: boolean) =>
	(message: string, args = {}) => {
		if (shouldDebug) {
			console.log(message);
			if (Object.keys(args).length !== 0) console.log(args);
		}
	};

export const useLogger = () => {
	const { shouldDebug } = useAppSelector((state) => state.global);

	const logger = React.useCallback(
		(message: string, args?: Record<string, any>) =>
			log(shouldDebug)(message, args),
		[shouldDebug]
	);

	return logger;
};
