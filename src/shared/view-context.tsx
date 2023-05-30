import React from "react";

import { NLTView } from "src/obsidian/nlt-view";

const ViewContext = React.createContext<NLTView | null>(null);

export const useViewContext = () => {
	const value = React.useContext(ViewContext);
	if (value === null) {
		throw new Error(
			"useViewContext() called without a <DragProvider /> in the tree."
		);
	}

	return value;
};

interface Props {
	view: NLTView;
	children: React.ReactNode;
}

export default function ViewProvider({ view, children }: Props) {
	return <ViewContext.Provider value={view}>{children}</ViewContext.Provider>;
}
