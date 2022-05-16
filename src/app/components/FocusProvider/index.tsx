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
		setFocus(true);
		plugin.focusTable(tableId, sourcePath);
	}

	function handleBlur() {
		setFocus(false);
		plugin.blurTable();
	}

	return (
		<div
			onFocusCapture={() => handleFocus()}
			onBlurCapture={() => handleBlur()}
		>
			<FocusContext.Provider value={isFocused}>
				{children}
			</FocusContext.Provider>
		</div>
	);
}
