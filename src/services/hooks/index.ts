import { useCallback, useEffect, useRef, useState } from "react";

export const useForceUpdate = (): [number, () => void] => {
	const [time, setTime] = useState(0);
	return [time, useCallback(() => setTime(Date.now()), [])];
};

export const useCompare = (value: any) => {
	const prevValue = usePrevious(value);
	//On mount the value will be undefined, so we don't want to return true
	if (prevValue === undefined) return false;
	return prevValue !== value;
};

const usePrevious = (value: any) => {
	const ref = useRef();
	useEffect(() => {
		ref.current = value;
	});
	return ref.current;
};

export const useDidMountEffect = (func: (...rest: any) => any, deps: any[]) => {
	const didMount = useRef(false);

	useEffect(() => {
		if (didMount.current) func();
		else didMount.current = true;
	}, deps);
};

export const useFocusInput = (isMenuVisible: boolean) => {
	const inputRef = useRef<any | null>(null);

	//The menu will render 2 times, once for the initial position and then again to shift the menu into view.
	//We only want to focus the input on the second render.
	useEffect(() => {
		if (isMenuVisible) focusInput();
	}, [isMenuVisible]);

	function focusInput() {
		if (inputRef.current) inputRef.current.focus();
	}

	return inputRef;
};
