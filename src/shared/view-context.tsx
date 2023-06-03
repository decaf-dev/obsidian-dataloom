import { WorkspaceLeaf } from "obsidian";
import React from "react";

const MountContext = React.createContext<{
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
	filePath: string;
	leaf: WorkspaceLeaf;
	children: React.ReactNode;
}

export default function MountProvider({
	appId,
	filePath,
	leaf,
	children,
}: Props) {
	return (
		<MountContext.Provider value={{ appId, filePath, leaf }}>
			{children}
		</MountContext.Provider>
	);
}
