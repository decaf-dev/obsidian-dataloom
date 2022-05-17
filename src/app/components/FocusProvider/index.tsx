import NltPlugin from "main";
import React, { useState, useContext, useEffect, useCallback } from "react";

const FocusContext = React.createContext(false);

interface Props {
	children: React.ReactNode;
	plugin: NltPlugin;
	tableId: string;
	sourcePath: string;
}

export const useTableFocus = () => {
	return useContext(FocusContext);
};

export default function FocusProvider({
	children,
	plugin,
	tableId,
	sourcePath,
}: Props) {
	const [isFocused, setFocus] = useState(false);

	function handleFocus() {
		console.log("[FocusProvider] handleFocus()");
		setFocus(true);
		plugin.focusTable(tableId, sourcePath);
	}

	function handleBlur() {
		console.log("[FocusProvider] handleBlur()");
		setFocus(false);
		plugin.blurTable();
	}

	const divRef = useCallback((node) => {
		if (node) {
			if (plugin.focused) {
				if (
					plugin.focused.sourcePath === sourcePath &&
					plugin.focused.tableId === tableId
				) {
					setTimeout(() => {
						// node.focus();
						handleFocus();
					}, 1);
				}
			}
		}
	}, []);

	return (
		<div
			ref={divRef}
			onFocus={() => handleFocus()}
			onBlur={() => handleBlur()}
		>
			<FocusContext.Provider value={isFocused}>
				{children}
			</FocusContext.Provider>
		</div>
	);
}
