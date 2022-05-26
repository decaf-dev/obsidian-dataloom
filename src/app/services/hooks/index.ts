import { useCallback, useState, useEffect } from "react";

export const useForceUpdate = () => {
	const [, setValue] = useState(0);
	return useCallback(() => setValue((value) => value + 1), []);
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
