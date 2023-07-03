import { WorkspaceLeaf } from "obsidian";
import React from "react";

interface ContextProps {
	leaf: WorkspaceLeaf;
	appId: string;
	filePath: string;
	isMarkdownView: boolean;
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
	leaf,
	filePath,
	isMarkdownView,
	children,
}: Props) {
	return (
		<MountContext.Provider
			value={{ appId, leaf, filePath, isMarkdownView }}
		>
			{children}
		</MountContext.Provider>
	);
}
