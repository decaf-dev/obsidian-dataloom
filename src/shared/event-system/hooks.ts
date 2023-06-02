import React from "react";

import { eventSystem } from "./event-system";
import { useMountContext } from "../view-context";
import { isEventForThisLeaf } from "../renderUtils";
import { NLTView } from "src/obsidian/nlt-view";

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

		//The markdown view has its click handler set on the embedded link
		if (view instanceof NLTView)
			document.addEventListener("click", handleClick);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);

			//The markdown view has its click handler set on the embedded link
			if (view instanceof NLTView)
				document.removeEventListener("click", handleClick);
		};
	}, [view]);
};
