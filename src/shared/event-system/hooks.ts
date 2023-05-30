import React from "react";
import { eventSystem } from "./event-system";

export const useEventSystem = () => {
	React.useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			eventSystem.dispatchEvent("keydown", e);
		}

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);
};
