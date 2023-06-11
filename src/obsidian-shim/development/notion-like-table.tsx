import MountProvider from "./mount-context";
import { TableState } from "src/shared/types";
import TableWrapper from "src/react/table-app";
import { Store } from "@reduxjs/toolkit";

interface Props {
	appId: string;
	isMarkdownView: boolean;
	store: Store;
	tableState: TableState;
	onSaveState: (appId: string, state: TableState) => void;
}

export default function NotionLikeTable({
	appId,
	isMarkdownView,
	store,
	tableState,
	onSaveState,
}: Props) {
	return (
		<MountProvider appId={appId} isMarkdownView={isMarkdownView}>
			<TableWrapper
				store={store}
				tableState={tableState}
				onSaveState={onSaveState}
			/>
		</MountProvider>
	);
}
