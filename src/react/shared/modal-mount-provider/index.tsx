import { App } from "obsidian";

import React from "react";

interface ContextProps {
	obsidianApp: App;
	modalEl: HTMLElement;
}

const MountContext = React.createContext<ContextProps | null>(null);

export const useModalMount = () => {
	const value = React.useContext(MountContext);
	if (value === null) {
		throw new Error(
			"useModalMount() called without a <ModalMountProvider /> in the tree."
		);
	}

	return value;
};

interface Props extends ContextProps {
	children: React.ReactNode;
}

export default function ModalMountProvider({
	obsidianApp,
	modalEl,
	children,
}: Props) {
	return (
		<MountContext.Provider value={{ obsidianApp, modalEl }}>
			{children}
		</MountContext.Provider>
	);
}
