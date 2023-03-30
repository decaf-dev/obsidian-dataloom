import { useState, useEffect, useRef } from "react";

import { v4 as uuid } from "uuid";

export const useId = (): string => {
	const [id] = useState(uuid());
	return id;
};

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

export const usePositionRef = (deps: any[] = []) => {
	const ref = useRef<any | null>(null);
	const [position, setPosition] = useState({
		top: 0,
		left: 0,
		width: 0,
		height: 0,
	});

	useEffect(() => {
		const node = ref.current as HTMLElement;
		if (node) {
			const { top, left } = node.getBoundingClientRect();
			//We use offsetWidth, and offsetHeight instead of the width and height of the rectangle
			//because we want whole values to match what we set as the column width.
			//This will make sure that the rendered cell and the input cell are the same size
			const { offsetWidth, offsetHeight } = node;
			setPosition({
				top,
				left,
				width: offsetWidth,
				height: offsetHeight,
			});
		}
	}, [...deps]);

	return { ref, position };
};
