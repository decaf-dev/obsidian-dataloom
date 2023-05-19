import { useRef } from "react";
import { setResizingColumnId } from "src/redux/global/global-slice";
import { useAppDispatch } from "src/redux/global/hooks";

export const useColumnResize = (
	columnId: string,
	onMove: (dist: number) => void
) => {
	//The x position of the mouse when it is pressed down
	//This should be the same for both mouse and touch events
	const mouseDownX = useRef(0);

	const dispatch = useAppDispatch();

	function handleMouseMove(e: MouseEvent) {
		const dist = e.pageX - mouseDownX.current;
		onMove(dist);
	}

	function handleTouchMove(e: TouchEvent) {
		const dist = e.touches[0].pageX - mouseDownX.current;
		onMove(dist);
	}

	function handleMouseUp() {
		document.removeEventListener("mousemove", handleMouseMove);
		document.removeEventListener("mouseup", handleMouseUp);

		//Prevents the column menu from opening when the user releases the mouse
		setTimeout(() => {
			dispatch(setResizingColumnId(null));
		}, 100);
	}

	function handleTouchEnd() {
		document.removeEventListener("touchmove", handleTouchMove);
		document.removeEventListener("touchend", handleTouchEnd);

		//Prevents the column menu from opening when the user releases the mouse
		setTimeout(() => {
			dispatch(setResizingColumnId(null));
		}, 100);
	}

	function handleTouchStart(e: React.TouchEvent) {
		//If we double click, then don't resize
		if (e.detail >= 2) return;

		//Mouse event
		e.preventDefault();

		//Add event listeners
		document.addEventListener("touchmove", handleTouchMove);
		document.addEventListener("touchend", handleTouchEnd);

		//Set the current mouse position, this will be used to calculate the distance
		//the touch has moved
		mouseDownX.current = e.touches[0].pageX;
		dispatch(setResizingColumnId(columnId));
	}

	function handleMouseDown(e: React.MouseEvent) {
		//If we double click, then don't resize
		if (e.detail >= 2) return;

		//Prevent drag and drop
		e.preventDefault();

		//Add event listeners
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);

		//Set the current mouse position, this will be used to calculate the distance
		//the mouse has moved
		mouseDownX.current = e.pageX;
		dispatch(setResizingColumnId(columnId));
	}

	return { handleMouseDown, handleTouchStart };
};
