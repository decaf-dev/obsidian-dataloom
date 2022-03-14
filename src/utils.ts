import * as React from "react";

export const getFrontMatter = () => {
	return "---\nnotion-table: basic\n---";
};

export const AppContext = React.createContext(undefined);

export const useApp = (): App | undefined => {
	return React.useContext(AppContext);
};
