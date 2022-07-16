import { useCallback, useState, useEffect, useRef } from "react";

import { v4 as uuid } from "uuid";

export const useForceUpdate = () => {
	const [, setValue] = useState(0);
	return useCallback(() => setValue((value) => value + 1), []);
};

export const useMenuId = (): string => {
	const [menuId] = useState(uuid());
	return menuId;
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

export const useTextareaRef = (isOpen: boolean, value: string) => {
	const lengthHasChanged = useCompare(value.length);
	return useCallback(
		(node) => {
			if (node) {
				if (isOpen && !lengthHasChanged) {
					node.selectionStart = value.length;
					node.selectionEnd = value.length;
					if (node instanceof HTMLElement) {
						setTimeout(() => {
							node.focus();
						}, 1);
					}
				}
			}
		},
		[isOpen, value.length]
	);
};
export const useDidMountEffect = (func: (...rest: any) => any, deps: any[]) => {
	const didMount = useRef(false);

	useEffect(() => {
		if (didMount.current) func();
		else didMount.current = true;
	}, deps);
};

export const useContentResizeTime = () => {
	const [resizeTime, setResizeTime] = useState(0);

	useEffect(() => {
		function handleResize() {
			setResizeTime(Date.now());
		}

		setTimeout(() => {
			const el = document.getElementsByClassName("view-content")[0];
			if (el) {
				new ResizeObserver(handleResize).observe(el);
				handleResize();
			}
		}, 1);
	}, []);
	return resizeTime;
};

export const usePositionRef = (deps: any[] = []) => {
	const [position, setPosition] = useState({
		top: 0,
		left: 0,
		width: 0,
		height: 0,
	});
	const resizeTime = useContentResizeTime();
	const positionRef = useCallback(
		(node) => {
			if (node instanceof HTMLElement) {
				const { top, left, width, height } =
					node.getBoundingClientRect();
				setPosition({
					top,
					left,
					width,
					height,
				});
			}
		},
		[resizeTime, ...deps]
	);
	return { positionRef, position };
};

export const useDisableScroll = (isOpen: boolean): void => {
	const scroll = useRef({
		top: 0,
		left: 0,
	});

	const el = document.getElementsByClassName("NLT__app")[0];

	function handleScroll() {
		if (el) {
			const { top, left } = scroll.current;
			el.scrollTo(left, top);
		}
	}
	useEffect(() => {
		if (el instanceof HTMLElement) {
			if (isOpen) {
				scroll.current = {
					top: el.scrollTop,
					left: el.scrollLeft,
				};
				el.addEventListener("scroll", handleScroll);
			} else {
				el.removeEventListener("scroll", handleScroll);
			}
		}

		return () => {
			if (el) {
				el.removeEventListener("scroll", handleScroll);
			}
		};
	}, [isOpen]);
};
