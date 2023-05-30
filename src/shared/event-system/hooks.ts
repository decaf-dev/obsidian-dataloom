import React from "react";
import { eventSystem } from "./event-system";
import { NLTView } from "src/obsidian/nlt-view";
import { useViewContext } from "../view-context";

export const useEventSystem = () => {
	const view = useViewContext();
	React.useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			const activeView = app.workspace.getActiveViewOfType(NLTView);
			if (!activeView) return;

			if (activeView.leaf === view.leaf) {
				eventSystem.dispatchEvent("keydown", e);
			}
		}

		function handleClick(e: KeyboardEvent) {
			const activeView = app.workspace.getActiveViewOfType(NLTView);
			if (!activeView) return;

			if (activeView.leaf === view.leaf) {
				eventSystem.dispatchEvent("click", e);
			}
		}

		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("click", handleClick);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.addEventListener("click", handleClick);
		};
	}, [view]);
};
