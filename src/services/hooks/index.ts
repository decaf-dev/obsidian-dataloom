import { useCallback, useState, useEffect, useRef } from "react";

import { v4 as uuid } from "uuid";
import { numToPx } from "../string/conversion";

export const useForceUpdate = () => {
	const [, setValue] = useState(0);
	return useCallback(() => setValue((value) => value + 1), []);
};

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

/**
 * Throttles events.
 * Guarantees an execution of events every x milliseconds
 */
export const useThrottle = (eventTime: number, waitTime: number) => {
	const [shouldExecute, setExecution] = useState(false);

	useEffect(() => {
		let intervalId: NodeJS.Timer = null;
		function startTimer() {
			intervalId = setInterval(() => {
				if (Date.now() - eventTime < waitTime) return;
				clearInterval(intervalId);
				setExecution(true);
			}, 50);
		}
		if (eventTime !== 0) {
			setExecution(false);
			startTimer();
		}
		return () => clearInterval(intervalId);
	}, [eventTime]);

	return shouldExecute;
};

export const useSaveTime = () => {
	const [eventTime, setEventTime] = useState(0);
	const shouldExecute = useThrottle(eventTime, 150);
	const [saveTime, setSaveTime] = useState(0);
	const [shouldSaveModel, setShouldSaveModel] = useState(false);

	useEffect(() => {
		if (shouldExecute) setSaveTime(Date.now());
	}, [shouldExecute]);

	function saveData(didModelChange: boolean, throttle = false) {
		setShouldSaveModel(didModelChange);
		if (throttle) {
			setEventTime(Date.now());
		} else {
			setSaveTime(Date.now());
		}
	}
	return { saveTime, shouldSaveModel, saveData };
};

export const usePositionRef = (deps: any[] = []) => {
	const [position, setPosition] = useState({
		top: "0px",
		left: "0px",
		width: "0px",
		height: "0px",
	});

	const positionRef = useRef(null);

	useEffect(() => {
		const node = positionRef.current;
		const { top, left } = node.getBoundingClientRect();
		//We use offsetWidth, and offsetHeight instead of the width and height of the rectangle
		//because we want whole values to match what we set as the column width.
		//This will make sure that the rendered cell and the input cell are the same size
		const { offsetWidth, offsetHeight } = node;
		setPosition({
			top: numToPx(top),
			left: numToPx(left),
			width: numToPx(offsetWidth),
			height: numToPx(offsetHeight),
		});
	}, [...deps]);

	return { positionRef, position };
};
