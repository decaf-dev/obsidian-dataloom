import { useAppSelector } from "src/redux/global/hooks";

export const useLogger = () => {
	const { shouldDebug } = useAppSelector((state) => state.global);

	function logFunctionCall(funcName: string, args = {}) {
		if (shouldDebug) {
			console.log(funcName);
			if (Object.keys(args).length !== 0) console.log(args);
		}
	}

	return logFunctionCall;
};
