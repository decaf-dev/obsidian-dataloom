import { App as ObsidianApp, TFile, WorkspaceLeaf } from "obsidian";

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
			</AppMountProvider>
		</ErrorBoundary>
	);
}
