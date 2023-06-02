import React from "react";

import { eventSystem } from "./event-system";
import { useMountContext } from "../view-context";
import { isEventForThisLeaf } from "../renderUtils";

export const useEventSystem = () => {
	const { view } = useMountContext();

	React.useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (isEventForThisLeaf(view.leaf))
				eventSystem.dispatchEvent("keydown", e);
		}

		function handleClick(e: KeyboardEvent) {
			if (isEventForThisLeaf(view.leaf))
				eventSystem.dispatchEvent("click", e);
		}

		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("click", handleClick);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.addEventListener("click", handleClick);
		};
	}, [view]);
};
