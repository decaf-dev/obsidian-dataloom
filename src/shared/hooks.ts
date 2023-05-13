import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useMenuContext } from "./menu/menu-context";
import { isNumber } from "./validators";

export const useForceUpdate = (): [number, () => void] => {
	const [time, setTime] = React.useState(0);
	return [time, React.useCallback(() => setTime(Date.now()), [])];
};

export const useCompare = (value: any, runOnMount = false) => {
	const prevValue = usePrevious(value);
	//On mount the value will be undefined, so we don't want to return true
	if (prevValue === undefined) return runOnMount;
	return prevValue !== value;
};

const usePrevious = (value: any) => {
	const ref = React.useRef();
	React.useEffect(() => {
		ref.current = value;
	});
	return ref.current;
};

export const useDidMountEffect = (func: (...rest: any) => any, deps: any[]) => {
	const didMount = React.useRef(false);

	React.useEffect(() => {
		if (didMount.current) func();
		else didMount.current = true;
	}, deps);
};

export const useInputSelection = (
	inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>,
	value: string
) => {
	const [previousSelectionStart, setPreviousSelectionStart] = React.useState(
		value.length
	);

	const didValueChange = useCompare(value, true);
	React.useEffect(() => {
		function setSelection() {
			if (didValueChange) {
				if (inputRef.current) {
					inputRef.current.selectionStart = previousSelectionStart;
					inputRef.current.selectionEnd = previousSelectionStart;
				}
			}
		}
		if (inputRef.current) setSelection();
	}, [previousSelectionStart, value, didValueChange]);

	return { setPreviousSelectionStart };
};

export const useFocusMenuTextArea = (
	isMenuVisible: boolean,
	value: string,
	onChange: (value: string) => void
) =>
	useFocusMenuContent<HTMLTextAreaElement>(
		false,
		isMenuVisible,
		value,
		onChange
	);

export const useFocusMenuInput = (
	isMenuVisible: boolean,
	value: string,
	onChange: (value: string) => void,
	options?: { isNumeric: boolean }
) => {
	const { isNumeric = false } = options || {};
	return useFocusMenuContent<HTMLInputElement>(
		isNumeric,
		isMenuVisible,
		value,
		onChange
	);
};

const useFocusMenuContent = <T>(
	hasNumericInput: boolean,
	isMenuVisible: boolean,
	value: string,
	onChange: (value: string) => void
) => {
	const { menuKey } = useMenuContext();
	const inputRef = React.useRef<T | null>(null);

	//The menu will render 2 times, once for the initial position and then again to shift the menu into view.
	//We only want to focus the input on the second render.
	React.useEffect(() => {
		function focusInput() {
			if (!inputRef.current) return;
			if (inputRef.current instanceof HTMLElement) {
				inputRef.current.focus();
			}

			if (menuKey == null) return;
			if (hasNumericInput && !isNumber(menuKey)) return;
			onChange(value + menuKey);
		}
		if (isMenuVisible) focusInput();
	}, [isMenuVisible]);

	return inputRef;
};

export const useUUID = (): string => {
	const [uuid] = React.useState(uuidv4());
	return uuid;
};
