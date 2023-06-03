import { WorkspaceLeaf } from "obsidian";
import React from "react";

const MountContext = React.createContext<{
	isEmbedded: string;
	appId: string;
	filePath: string;
	leaf: WorkspaceLeaf;
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
	appId: string;
	isEmbedded: string;
	filePath: string;
	leaf: WorkspaceLeaf;
	children: React.ReactNode;
}

export default function MountProvider({
	appId,
	isEmbedded,
	filePath,
	leaf,
	children,
}: Props) {
	return (
		<MountContext.Provider value={{ isEmbedded, appId, filePath, leaf }}>
			{children}
		</MountContext.Provider>
	);
}
