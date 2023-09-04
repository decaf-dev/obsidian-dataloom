import React from "react";

import { LoomState } from "src/shared/loom-state/types";
import LoomStateCommand from "src/shared/loom-state/loom-state-command";
import { useLogger } from "src/shared/logger";
import RowSortCommand from "src/shared/loom-state/commands/row-sort-command";
import { useAppMount } from "src/react/loom-app/app-mount-provider";
import { EVENT_APP_REFRESH } from "src/shared/events";

interface Props {
	initialState: LoomState;
	children: React.ReactNode;
	onSaveState: (appId: string, state: LoomState) => void;
}

const LoomStateContext = React.createContext<{
	searchText: string;
	isSearchBarVisible: boolean;
	resizingColumnId: string | null;
	loomState: LoomState;
	setLoomState: React.Dispatch<React.SetStateAction<LoomState>>;
	toggleSearchBar: () => void;
	setResizingColumnId: React.Dispatch<React.SetStateAction<string | null>>;
	setSearchText: React.Dispatch<React.SetStateAction<string>>;
	doCommand: (command: LoomStateCommand) => void;
	onUndo: () => void;
	onRedo: () => void;
} | null>(null);

export const useLoomState = () => {
	const value = React.useContext(LoomStateContext);
	if (value === null) {
		throw new Error(
			"useLoomState() called without a <LoomStateProvider /> in the tree."
		);
	}

	return value;
};

export default function LoomStateProvider({
	initialState,
	onSaveState,
	children,
}: Props) {
	const [loomState, setLoomState] = React.useState(initialState);
	const [searchText, setSearchText] = React.useState("");
	const [isSearchBarVisible, setSearchBarVisible] = React.useState(false);
	const [resizingColumnId, setResizingColumnId] = React.useState<
		string | null
	>(null);

	const [history, setHistory] = React.useState<(LoomStateCommand | null)[]>([
		null,
	]);
	const [position, setPosition] = React.useState(0);
	const refreshTime = React.useRef(0);

	const logger = useLogger();
	const { reactAppId, loomFile, app } = useAppMount();

	// React.useEffect(() => {
	// 	const jsonSizeInBytes = new TextEncoder().encode(
	// 		JSON.stringify(history)
	// 	).length;
	// 	console.log(`Size of data: ${jsonSizeInBytes / 1024} kb`);
	// 	console.log(`Size of data: ${jsonSizeInBytes / (1024 * 1024)} mb`);
	// }, [history]);

	//Whenever the table state is updated save it to disk
	const isMountedRef = React.useRef(false);
	React.useEffect(() => {
		if (!isMountedRef.current) {
			isMountedRef.current = true;
			return;
		}

		//If the refresh time is not 0, then we know that the state was updated by a refresh event
		//and we don't want to save it to disk, as it was already saved by the app instance that
		//sent the refresh event
		if (refreshTime.current !== 0) {
			refreshTime.current = 0;
			return;
		}

		onSaveState(reactAppId, loomState);
	}, [reactAppId, loomState, onSaveState]);

	React.useEffect(() => {
		function handleRefreshEvent(
			filePath: string,
			sourceAppId: string,
			state: LoomState
		) {
			if (reactAppId !== sourceAppId && filePath === loomFile.path) {
				refreshTime.current = Date.now();
				setLoomState(state);
			}
		}

		app.workspace.on(
			// @ts-expect-error: not a native Obsidian event
			EVENT_APP_REFRESH,
			handleRefreshEvent
		);
		return () => app.workspace.off(EVENT_APP_REFRESH, handleRefreshEvent);
	}, [reactAppId, loomFile, app]);

	function handleToggleSearchBar() {
		setSearchBarVisible((prevState) => !prevState);
	}

	const undo = React.useCallback(() => {
		if (position > 0) {
			logger("handleUndoEvent");

			const currentPosition = position - 1;
			setPosition(currentPosition);

			const command = history[position];
			if (command !== null) {
				logger(command.constructor.name + ".undo");
				let newState = command.undo(loomState);
				if (command.shouldSortRows) {
					newState = new RowSortCommand().execute(newState);
				}
				setLoomState(newState);
			}
		}
	}, [position, history, loomState, logger]);

	const redo = React.useCallback(() => {
		if (position < history.length - 1) {
			logger("handleRedoEvent");

			const currentPosition = position + 1;
			setPosition(currentPosition);

			const command = history[currentPosition];
			if (command !== null) {
				logger(command.constructor.name + ".redo");
				let newState = command.redo(loomState);
				if (command.shouldSortRows) {
					newState = new RowSortCommand().execute(newState);
				}
				setLoomState(newState);
			}
		}
	}, [position, history, loomState, logger]);

	const doCommand = React.useCallback(
		(command: LoomStateCommand) => {
			setHistory((prevState) => {
				//If the position is not at the end of the history, then we want to remove all the commands after the current position
				if (position < history.length - 1) {
					const newState = prevState.slice(0, position + 1);
					return [...newState, command];
				} else {
					return [...prevState, command];
				}
			});
			setPosition((prevState) => prevState + 1);

			//Execute command
			let newState = command.execute(loomState);
			if (command.shouldSortRows) {
				newState = new RowSortCommand().execute(newState);
			}
			setLoomState(newState);
		},
		[position, history, loomState]
	);

	return (
		<LoomStateContext.Provider
			value={{
				loomState,
				setLoomState,
				doCommand,
				onRedo: redo,
				onUndo: undo,
				isSearchBarVisible,
				searchText,
				resizingColumnId,
				setResizingColumnId,
				toggleSearchBar: handleToggleSearchBar,
				setSearchText,
			}}
		>
			{children}
		</LoomStateContext.Provider>
	);
}
