import React from "react";

import { eventSystem } from "./event-system";
import { useMountContext } from "../view-context";
import { isEventForThisLeaf } from "../renderUtils";
import { NLTView } from "src/obsidian/nlt-view";

export const useEventSystem = () => {
	const { leaf } = useMountContext();

	React.useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (isEventForThisLeaf(leaf))
				eventSystem.dispatchEvent("keydown", e);
		}
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [leaf]);

	React.useEffect(() => {
		function handleClick(e: KeyboardEvent) {
			if (isEventForThisLeaf(leaf)) eventSystem.dispatchEvent("click", e);
		}

		//The markdown view has its click handler set on the embedded link
		//We don't handle events multiple times
		if (leaf.view instanceof NLTView)
			document.addEventListener("click", handleClick);

		return () => {
			if (leaf.view instanceof NLTView)
				document.removeEventListener("click", handleClick);
		};
	}, [leaf]);
};
