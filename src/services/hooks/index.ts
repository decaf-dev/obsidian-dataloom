import { useCallback, useEffect, useRef, useState } from "react";

export const useForceUpdate = () => {
	const [, setTime] = useState(0);
	return useCallback(() => setTime(Date.now()), []);
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
