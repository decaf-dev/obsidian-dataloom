import { WorkspaceLeaf } from "obsidian";
import React from "react";

interface ContextProps {
	isEmbedded: boolean;
	appId: string;
	filePath: string;
	leaf: WorkspaceLeaf;
}

const MountContext = React.createContext<ContextProps | null>(null);

export const useMountState = () => {
	const value = React.useContext(MountContext);
	if (value === null) {
		throw new Error(
			"useMountState() called without a <MountProvider /> in the tree."
		);
	}

	return value;
};

interface Props extends ContextProps {
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
