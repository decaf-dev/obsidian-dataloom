import { App as ObsidianApp, TFile, WorkspaceLeaf } from "obsidian";

import { Provider } from "react-redux";
import { Store } from "@reduxjs/toolkit";

import LoomStateProvider from "./loom-state-provider";
import AppMountProvider from "./app-mount-provider";
import App from "./app";

import DragProvider from "src/shared/dragging/drag-context";
import { LoomState } from "src/shared/loom-state/types";
import MenuProvider from "../shared/menu-provider";

interface Props {
	app: ObsidianApp;
	reactAppId: string;
	mountLeaf: WorkspaceLeaf;
	isMarkdownView: boolean;
	loomFile: TFile;
	store: Store;
	loomState: LoomState;
	onSaveState: (appId: string, state: LoomState) => void;
}

export default function LoomApp({
	app,
	reactAppId,
	mountLeaf,
	isMarkdownView,
	store,
	loomFile,
	loomState,
	onSaveState,
}: Props) {
	return (
		<AppMountProvider
			app={app}
			mountLeaf={mountLeaf}
			reactAppId={reactAppId}
			isMarkdownView={isMarkdownView}
			loomFile={loomFile}
		>
			<Provider store={store}>
				<LoomStateProvider
					initialState={loomState}
					onSaveState={onSaveState}
				>
					<DragProvider>
						<MenuProvider>
							<App />
						</MenuProvider>
					</DragProvider>
				</LoomStateProvider>
			</Provider>
		</AppMountProvider>
	);
}
