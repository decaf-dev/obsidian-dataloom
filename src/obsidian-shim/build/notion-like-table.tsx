import MountProvider from "./mount-context";
import { TableState } from "src/shared/types";
import TableWrapper from "src/react/table-app";
import { WorkspaceLeaf } from "obsidian";
import { Store } from "@reduxjs/toolkit";

interface Props {
	appId: string;
	leaf: WorkspaceLeaf;
	isMarkdownView: boolean;
	store: Store;
	filePath: string;
	tableState: TableState;
	onSaveState: (appId: string, state: TableState) => void;
}

export default function NotionLikeTable({
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
			<TableWrapper
				store={store}
				tableState={tableState}
				onSaveState={onSaveState}
			/>
		</MountProvider>
	);
}
