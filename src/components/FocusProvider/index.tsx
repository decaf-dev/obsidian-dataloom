import NltPlugin from "../../main";
import React, { useState, useContext, useEffect } from "react";
import { DEBUG } from "src/constants";
import { logFunc } from "src/services/debug";
import { MarkdownViewModeType } from "obsidian";
import { getUniqueTableId } from "src/services/table/utils";

const FocusContext = React.createContext(false);

export const useTableFocus = () => {
	return useContext(FocusContext);
};

const COMPONENT_NAME = "FocusProvider";

interface Props {
	children: React.ReactNode;
	plugin: NltPlugin;
	tableId: string;
	viewMode: MarkdownViewModeType;
}

export default function FocusProvider({
	children,
	plugin,
	tableId,
	viewMode,
}: Props) {
	const [isFocused, setFocus] = useState(false);

	function handleFocus() {
		if (DEBUG.FOCUS_PROVIDER) logFunc(COMPONENT_NAME, "handleFocus");
		setFocus(true);
		plugin.focusTable({
			tableId,
			viewMode,
		});
	}

	function handleBlur() {
		if (DEBUG.FOCUS_PROVIDER) logFunc(COMPONENT_NAME, "handleBlur");
		setFocus(false);
		plugin.blurTable();
	}

	function checkForFocus(e: MouseEvent): boolean {
		if (e.target instanceof HTMLElement) {
			let el = e.target;
			while (el) {
				if (el.className === "NLT__app") {
					if (el.id === getUniqueTableId(tableId, viewMode)) {
						return true;
					}
					break;
				}
				el = el.parentElement;
			}
		}
		return false;
	}

	useEffect(() => {
		function handleMouseUp(e: MouseEvent) {
			if (plugin.focused?.tableId === tableId) {
				if (!checkForFocus(e)) handleBlur();
			} else {
				if (checkForFocus(e)) handleFocus();
			}
		}
		window.addEventListener("mouseup", handleMouseUp);
		return () => window.removeEventListener("mouseup", handleMouseUp);
	}, []);

	return (
		<div>
			<FocusContext.Provider value={isFocused}>
				{children}
			</FocusContext.Provider>
		</div>
	);
}
