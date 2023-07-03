import { WorkspaceLeaf } from "obsidian";

import { Provider } from "react-redux";
import { Store } from "@reduxjs/toolkit";

import DragProvider from "src/shared/dragging/drag-context";
import MenuProvider from "src/shared/menu/menu-context";
import DashboardStateProvider from "src/shared/dashboard-state/dashboard-state-context";
import { DashboardState } from "src/shared/types";
import MountProvider from "./mount-provider";
import App from "./app";

interface Props {
	appId: string;
	leaf: WorkspaceLeaf;
	isMarkdownView: boolean;
	filePath: string;
	store: Store;
	dashboardState: DashboardState;
	onSaveState: (appId: string, state: DashboardState) => void;
}

export default function DashboardApp({
	appId,
	leaf,
	isMarkdownView,
	store,
	filePath,
	dashboardState,
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
				<DashboardStateProvider
					initialState={dashboardState}
					onSaveState={onSaveState}
				>
					<MenuProvider>
						<DragProvider>
							<App />
						</DragProvider>
					</MenuProvider>
				</DashboardStateProvider>
			</Provider>
		</MountProvider>
	);
}
