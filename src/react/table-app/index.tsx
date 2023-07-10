import { TFile, WorkspaceLeaf } from "obsidian";

import { Provider } from "react-redux";
import { Store } from "@reduxjs/toolkit";

import DragProvider from "src/shared/dragging/drag-context";
import MenuProvider from "src/shared/menu/menu-context";
import LoomStateProvider from "src/shared/loom-state/loom-state-context";
import { LoomState } from "src/shared/types";
import MountProvider from "./mount-provider";
import App from "./app";

interface Props {
	appId: string;
	mountLeaf: WorkspaceLeaf;
	isMarkdownView: boolean;
	tableFile: TFile;
	store: Store;
	LoomState: LoomState;
	onSaveState: (appId: string, state: LoomState) => void;
}

export default function TableApp({
	appId,
	mountLeaf,
	isMarkdownView,
	store,
	tableFile,
	LoomState,
	onSaveState,
}: Props) {
	return (
		<MountProvider
			mountLeaf={mountLeaf}
			appId={appId}
			isMarkdownView={isMarkdownView}
			tableFile={tableFile}
		>
			<Provider store={store}>
				<LoomStateProvider
					initialState={LoomState}
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
