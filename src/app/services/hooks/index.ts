import React, { useCallback, useState } from "react";
import { App } from "obsidian";

export const useForceUpdate = () => {
	const [, setValue] = useState(0);
	return useCallback(() => setValue((value) => value + 1), []);
};

export const AppContext = React.createContext(undefined);
export const useApp = (): App | undefined => {
	return React.useContext(AppContext);
};
