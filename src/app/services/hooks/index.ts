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

// type AppDataCallback = (obj: AppData) => void;

// export const useAppState = (
// 	initialState: AppData
// ): [AppData, AppDataCallback] => {
// 	const [state, setState] = useState<AppData>(initialState);
// 	return [
// 		state,
// 		useCallback<AppDataCallback>((obj) => {
// 			if (obj === null) {
// 				setState(initialState);
// 			} else {
// 				//Support nested properties
// 				//See: https://stackoverflow.com/questions/41588068/object-assign-override-nested-property
// 				setState((prevState) => _.merge({ ...prevState }, obj));
// 			}
// 		}, []),
// 	];
// };
