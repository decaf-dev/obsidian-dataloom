import { MarkdownView, WorkspaceLeaf } from "obsidian";
import React from "react";
import { NLTView } from "src/obsidian/nlt-view";
import { useUUID } from "./hooks";

const MountContext = React.createContext<{
	fileName: string;
	leaf: WorkspaceLeaf;
	appId: string;
} | null>(null);

export const useMountContext = () => {
	const value = React.useContext(MountContext);
	if (value === null) {
		throw new Error(
			"useMountContext() called without a <MountProvider /> in the tree."
		);
	}

	return value;
};

interface Props {
	fileName: string;
	leaf: WorkspaceLeaf;
	children: React.ReactNode;
}

export default function MountProvider({ fileName, leaf, children }: Props) {
	const appId = useUUID();
	return (
		<MountContext.Provider value={{ fileName, leaf, appId }}>
			{children}
		</MountContext.Provider>
	);
}
