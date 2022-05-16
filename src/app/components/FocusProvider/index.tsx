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
		console.log("HANDLE FOCUS");
		setFocus(true);
		plugin.focusTable(tableId, sourcePath);
	}

	function handleBlur() {
		console.log("HANDLE BLUR");
		setFocus(false);
		plugin.blurTable();
	}

	return (
		<div onFocus={() => handleFocus()} onBlur={() => handleBlur()}>
			<FocusContext.Provider value={isFocused}>
				{children}
			</FocusContext.Provider>
		</div>
	);
}
