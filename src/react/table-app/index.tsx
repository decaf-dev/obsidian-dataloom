import { TFile, WorkspaceLeaf } from "obsidian";

import { Provider } from "react-redux";
import { Store } from "@reduxjs/toolkit";

import DragProvider from "src/shared/dragging/drag-context";
import MenuProvider from "src/shared/menu/menu-context";
import TableStateProvider from "src/shared/table-state/dashboard-state-context";
import { TableState } from "src/shared/types";
import MountProvider from "./mount-provider";
import App from "./app";

interface Props {
	appId: string;
	mountLeaf: WorkspaceLeaf;
	isMarkdownView: boolean;
	tableFile: TFile;
	store: Store;
	tableState: TableState;
	onSaveState: (appId: string, state: TableState) => void;
}

export default function DashboardApp({
	appId,
	mountLeaf,
	isMarkdownView,
	store,
	tableFile,
	tableState,
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
				<TableStateProvider
					initialState={tableState}
					onSaveState={onSaveState}
				>
					<MenuProvider>
						<DragProvider>
							<App />
						</DragProvider>
					</MenuProvider>
				</TableStateProvider>
			</Provider>
		</MountProvider>
	);
}
