import { MarkdownView } from "obsidian";
import React from "react";
import { NLTView } from "src/obsidian/nlt-view";

const MountContext = React.createContext<{
	fileName: string;
	view: NLTView | MarkdownView;
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
	view: NLTView | MarkdownView;
	children: React.ReactNode;
}

export default function MountProvider({ fileName, view, children }: Props) {
	return (
		<MountContext.Provider value={{ fileName, view }}>
			{children}
		</MountContext.Provider>
	);
}
