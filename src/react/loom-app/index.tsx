import { App, TFile, WorkspaceLeaf } from "obsidian";

import { Provider } from "react-redux";
import { Store } from "@reduxjs/toolkit";

import DragProvider from "src/shared/dragging/drag-context";
import MenuProvider from "src/shared/menu/menu-context";
import LoomStateProvider from "src/shared/loom-state/loom-state-context";
import { LoomState } from "src/shared/types";
import MountProvider from "./mount-provider";
import LoomApp from "./loom-app";

interface Props {
	app: App;
	appId: string;
	mountLeaf: WorkspaceLeaf;
	isMarkdownView: boolean;
	loomFile: TFile;
	store: Store;
	loomState: LoomState;
	onSaveState: (appId: string, state: LoomState) => void;
}

export default function LoomAppWrapper({
	app,
	appId,
	mountLeaf,
	isMarkdownView,
	store,
	loomFile,
	loomState,
	onSaveState,
}: Props) {
	return (
		<MountProvider
			app={app}
			mountLeaf={mountLeaf}
			appId={appId}
			isMarkdownView={isMarkdownView}
			loomFile={loomFile}
		>
			<Provider store={store}>
				<LoomStateProvider
					initialState={loomState}
					onSaveState={onSaveState}
				>
					<MenuProvider>
						<DragProvider>
							<LoomApp />
						</DragProvider>
					</MenuProvider>
				</LoomStateProvider>
			</Provider>
		</MountProvider>
	);
}
