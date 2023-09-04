import { App, TFile, WorkspaceLeaf } from "obsidian";

import React from "react";

interface ContextProps {
	app: App;
	mountLeaf: WorkspaceLeaf;
	appId: string;
	loomFile: TFile;
	isMarkdownView: boolean;
}

const MountContext = React.createContext<ContextProps | null>(null);

export const useAppMount = () => {
	const value = React.useContext(MountContext);
	if (value === null) {
		throw new Error(
			"useAppMount() called without a <AppMountProvider /> in the tree."
		);
	}

	return value;
};

interface Props extends ContextProps {
	children: React.ReactNode;
}

export default function AppMountProvider({
	app,
	appId,
	mountLeaf,
	loomFile,
	isMarkdownView,
	children,
}: Props) {
	return (
		<MountContext.Provider
			value={{ app, appId, mountLeaf, loomFile, isMarkdownView }}
		>
			{children}
		</MountContext.Provider>
	);
}
