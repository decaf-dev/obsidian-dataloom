import { useEffect, useRef } from "react";

export const useCompare = (value: any) => {
	const prevValue = usePrevious(value);
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
