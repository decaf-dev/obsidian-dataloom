import React from "react";
import { v4 as uuidv4 } from "uuid";

export const useForceUpdate = (): [number, () => void] => {
	const [time, setTime] = React.useState(0);
	return [time, React.useCallback(() => setTime(Date.now()), [])];
};

export const useCompare = <T>(value: T, runOnMount = true) => {
	const prevValue = usePrevious(value);
	//On mount the value will be undefined, so we don't want to return true
	if (prevValue === undefined) return runOnMount;
	return prevValue !== value;
};

export const usePrevious = <T>(value: T) => {
	const ref = React.useRef<T>();
	React.useEffect(() => {
		ref.current = value;
	});
	return ref.current;
};

export const useInputSelection = (
	inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>,
	value: string
) => {
	React.useEffect(() => {
		function setSelection() {
			if (inputRef.current) {
				inputRef.current.selectionStart = value.length;
				inputRef.current.selectionEnd = value.length;
			}
		}

		setSelection();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inputRef]);
};

export const useUUID = (): string => {
	const [uuid] = React.useState(uuidv4());
	return uuid;
};
