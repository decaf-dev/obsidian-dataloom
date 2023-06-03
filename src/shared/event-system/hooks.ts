import React from "react";

import { eventSystem } from "./event-system";
import { useMountContext } from "../view-context";
import { NLTView } from "src/obsidian/nlt-view";
import { isEventForThisApp } from "./utils";

export const useEventSystem = () => {
	const { appId, leaf } = useMountContext();

	React.useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (isEventForThisApp(appId)) {
				console.log("dispatching event");
				eventSystem.dispatchEvent("keydown", e);
			}
		}
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [appId]);

	React.useEffect(() => {
		function handleClick(e: KeyboardEvent) {
			if (isEventForThisApp(appId)) eventSystem.dispatchEvent("click", e);
		}

		//The markdown view has its click handler set on the embedded link
		//We don't handle events multiple times
		if (leaf.view instanceof NLTView)
			document.addEventListener("click", handleClick);

		return () => {
			if (leaf.view instanceof NLTView)
				document.removeEventListener("click", handleClick);
		};
	}, [leaf, appId]);
};
