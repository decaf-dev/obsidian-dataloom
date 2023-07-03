import { WorkspaceLeaf } from "obsidian";

import { Provider } from "react-redux";
import { Store } from "@reduxjs/toolkit";

import DragProvider from "src/shared/dragging/drag-context";
import MenuProvider from "src/shared/menu/menu-context";
import TableStateProvider from "src/shared/table-state/table-state-context";
import { TableState } from "src/shared/types";
import MountProvider from "./mount-provider";
import App from "./app";

interface Props {
	appId: string;
	leaf: WorkspaceLeaf;
	isMarkdownView: boolean;
	filePath: string;
	store: Store;
	tableState: TableState;
	onSaveState: (appId: string, state: TableState) => void;
}

export default function DashboardsApp({
	appId,
	leaf,
	isMarkdownView,
	store,
	filePath,
	tableState,
	onSaveState,
}: Props) {
	return (
		<MountProvider
			leaf={leaf}
			appId={appId}
			isMarkdownView={isMarkdownView}
			filePath={filePath}
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
