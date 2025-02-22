import { App as ObsidianApp, TFile, WorkspaceLeaf } from "obsidian";

import { type Store } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

import App from "./app";
import AppMountProvider from "./app-mount-provider";
import LoomStateProvider from "./loom-state-provider";

import DragProvider from "src/shared/dragging/drag-context";
import { type LoomState } from "src/shared/loom-state/types/loom-state";
import ErrorBoundary from "../shared/error-boundary";
import MenuProvider from "../shared/menu-provider";

interface Props {
	app: ObsidianApp;
	reactAppId: string;
	mountLeaf: WorkspaceLeaf;
	isMarkdownView: boolean;
	loomFile: TFile;
	store: Store;
	loomState: LoomState;
	onSaveState: (
		appId: string,
		state: LoomState,
		shouldSaveFrontmatter: boolean
	) => void;
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
		<ErrorBoundary>
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
		</ErrorBoundary>
	);
}
