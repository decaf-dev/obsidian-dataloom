import { App as ObsidianApp, TFile, WorkspaceLeaf } from "obsidian";

import { Provider } from "react-redux";
import { Store } from "@reduxjs/toolkit";

import LoomStateProvider from "./loom-state-provider";
import MountProvider from "./mount-provider";
import App from "./app";

import DragProvider from "src/shared/dragging/drag-context";
import MenuProvider from "src/react/loom-app/menu-provider";
import { LoomState } from "src/shared/loom-state/types";

interface Props {
	app: ObsidianApp;
	appId: string;
	mountLeaf: WorkspaceLeaf;
	isMarkdownView: boolean;
	loomFile: TFile;
	store: Store;
	loomState: LoomState;
	onSaveState: (appId: string, state: LoomState) => void;
}

export default function LoomApp({
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
							<App />
						</DragProvider>
					</MenuProvider>
				</LoomStateProvider>
			</Provider>
		</MountProvider>
	);
}
