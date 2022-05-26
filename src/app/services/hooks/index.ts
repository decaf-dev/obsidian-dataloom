import { useCallback, useState, useEffect, useRef } from "react";

export const useForceUpdate = () => {
	const [, setValue] = useState(0);
	return useCallback(() => setValue((value) => value + 1), []);
};

export const useDisableScroll = (isOpen: boolean) => {
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

export const useScrollTime = () => {
	const [scrollTime, setScrollTime] = useState(0);

	useEffect(() => {
		function handleScroll() {
			setScrollTime(Date.now());
		}

		let el: any = null;

		setTimeout(() => {
			el = document.getElementsByClassName("NLT__app")[0];
			if (el) {
				el.addEventListener("scroll", handleScroll);
			}
		}, 1);

		return () => {
			if (el) {
				el.removeEventListener("scroll", handleScroll);
			}
		};
	}, []);
	console.log(scrollTime);
	return scrollTime;
};

export const useResizeTime = () => {
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
