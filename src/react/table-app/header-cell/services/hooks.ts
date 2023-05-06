import { useRef } from "react";
import { setResizingColumnId } from "src/redux/global/global-slice";
import { useAppDispatch } from "src/redux/global/hooks";

export const useResizeColumn = (
	columnId: string,
	onWidthChange: (dist: number) => void
) => {
	const mouseDownX = useRef(0);
	const dispatch = useAppDispatch();

	function handleMouseMove(e: MouseEvent) {
		const dist = e.pageX - mouseDownX.current;
		onWidthChange(dist);
	}

	function handleMouseUp() {
		window.removeEventListener("mousemove", handleMouseMove);
		window.removeEventListener("mouseup", handleMouseUp);

		setTimeout(() => {
			dispatch(setResizingColumnId(null));
		}, 100);
	}

	function handleMouseDown(e: React.MouseEvent) {
		//If we double click, then don't resize
		if (e.detail >= 2) return;

		//Prevent drag and drop
		e.preventDefault();

		//Add event listeners
		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);

		mouseDownX.current = e.pageX;
		dispatch(setResizingColumnId(columnId));
	}

	return { handleMouseDown };
};
