import React, { useCallback, useState } from "react";

import { App } from "obsidian";
import { CELL_COLOR } from "../../constants";

export const useForceUpdate = () => {
	const [, setValue] = useState(0);
	return useCallback(() => setValue((value) => value + 1), []);
};

export const AppContext = React.createContext(undefined);

export const useApp = (): App | undefined => {
	return React.useContext(AppContext);
};

export const randomColor = (): string => {
	const index = Math.floor(Math.random() * Object.keys(CELL_COLOR).length);
	return Object.values(CELL_COLOR)[index];
};
