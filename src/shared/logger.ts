import React from "react";
import { useAppSelector } from "src/redux/global/hooks";

export const useLogger = () => {
	const { shouldDebug } = useAppSelector((state) => state.global);

	const log = React.useCallback(
		(funcName: string, args = {}) => {
			if (shouldDebug) {
				console.log(funcName);
				if (Object.keys(args).length !== 0) console.log(args);
			}
		},
		[shouldDebug]
	);

	return log;
};
