import NltPlugin from "main";
import { MarkdownSectionInformation } from "obsidian";
import React, { useState, useContext, useCallback, useEffect } from "react";
import { DEBUG } from "src/constants";
import { logFunc } from "src/services/debug";
import { findCurrentViewType } from "src/services/external/loadUtils";

const FocusContext = React.createContext(false);

export const useTableFocus = () => {
	return useContext(FocusContext);
};

const COMPONENT_NAME = "FocusProvider";

interface Props {
	children: React.ReactNode;
	plugin: NltPlugin;
	blockId: string;
	sectionInfo: MarkdownSectionInformation;
	sourcePath: string;
	el: HTMLElement;
}

export default function FocusProvider({
	children,
	plugin,
	sectionInfo,
	blockId,
	sourcePath,
	el,
}: Props) {
	const [isFocused, setFocus] = useState(false);

	function handleFocus() {
		if (DEBUG.FOCUS_PROVIDER) logFunc(COMPONENT_NAME, "handleFocus");
		setFocus(true);
		plugin.focusTable({
			blockId,
			sectionInfo,
			sourcePath,
			viewType: findCurrentViewType(el),
		});
	}

	function handleBlur() {
		if (DEBUG.FOCUS_PROVIDER) logFunc(COMPONENT_NAME, "handleBlur");
		setFocus(false);
		plugin.blurTable();
	}

	const divRef = useCallback((node) => {
		if (node) {
			if (plugin.focused) {
				if (
					plugin.focused.sourcePath === sourcePath &&
					plugin.focused.blockId === blockId
				) {
					setTimeout(() => {
						handleFocus();
					}, 1);
				}
			}
		}
	}, []);

	useEffect(() => {
		function handleMouseUp(e: MouseEvent) {
			//TODO only check if the page is active
			//Set an id for the table
			if (e.target instanceof Element) {
				let el = e.target;
				let isFocused = false;

				while (el) {
					if (el.className === "view-content") break;
					//We need to check the type because the an svg
					//element has a className of SVGAnimatedString
					//See: https://stackoverflow.com/a/37949156
					if (typeof el.className === "string") {
						if (el.className.includes("NLT")) {
							isFocused = true;
							break;
						}
					}
					el = el.parentElement;
				}
				if (isFocused) {
					handleFocus();
				} else {
					handleBlur();
				}
			}
		}
		window.addEventListener("mouseup", handleMouseUp);
		return () => window.removeEventListener("mouseup", handleMouseUp);
	}, []);

	return (
		<div ref={divRef}>
			<FocusContext.Provider value={isFocused}>
				{children}
			</FocusContext.Provider>
		</div>
	);
}
