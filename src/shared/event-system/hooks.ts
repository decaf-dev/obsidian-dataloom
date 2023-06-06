import React from "react";

import { nltEventSystem } from "./event-system";
import { useMountContext } from "../view-context";
import { isEventForThisApp } from "./utils";

export const useEventSystem = () => {
	const { appId } = useMountContext();

	React.useEffect(() => {
		function handleMouseUp(e: MouseEvent) {
			if (isEventForThisApp(appId))
				nltEventSystem.dispatchEvent("mouseup", e);
		}
		function handleMouseDown(e: MouseEvent) {
			if (isEventForThisApp(appId))
				nltEventSystem.dispatchEvent("mousedown", e);
		}

		function handleKeyDown(e: KeyboardEvent) {
			if (isEventForThisApp(appId))
				nltEventSystem.dispatchEvent("keydown", e);
		}

		function handleClick(e: KeyboardEvent) {
			if (isEventForThisApp(appId, true))
				nltEventSystem.dispatchEvent("click", e);
		}

		function handleSelectionChange(e: MouseEvent) {
			if (isEventForThisApp(appId))
				nltEventSystem.dispatchEvent("selectionchange", e);
		}

		document.addEventListener("click", handleClick);
		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("mousedown", handleMouseDown);
		document.addEventListener("mouseup", handleMouseUp);
		document.addEventListener("selectionchange", handleSelectionChange);

		return () => {
			document.removeEventListener("click", handleClick);
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("mousedown", handleMouseDown);
			document.removeEventListener("mouseup", handleMouseUp);
			document.removeEventListener(
				"selectionchange",
				handleSelectionChange
			);
		};
	}, [appId]);
};
