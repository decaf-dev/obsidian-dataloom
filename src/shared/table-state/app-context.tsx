import { App } from "obsidian";
import React from "react";

const AppContext = React.createContext<App | null>(null);

export const useApp = () => {
	const value = React.useContext(AppContext);
	if (value === null) {
		throw new Error(
			"useApp() called without a <AppProvider /> in the tree."
		);
	}

	return value;
};

interface Props {
	children: React.ReactNode;
	app: App;
}

export default function AppProvider({ children, app }: Props) {
	return <AppContext.Provider value={app}>{children}</AppContext.Provider>;
}
