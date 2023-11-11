import React from "react";

import { LoomState } from "src/shared/loom-state/types/loom-state";
import LoomStateCommand from "src/shared/loom-state/commands/loom-state-command";
import { useLogger } from "src/shared/logger";
import RowSortCommand from "src/shared/loom-state/commands/row-sort-command";
import { useAppMount } from "src/react/loom-app/app-mount-provider";
import EventManager from "src/shared/event/event-manager";

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
	setLoomState: React.Dispatch<
		React.SetStateAction<{
			state: LoomState;
			shouldSaveToDisk: boolean;
			time: number;
		}>
	>;
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
	const [loomState, setLoomState] = React.useState({
		state: initialState,
		shouldSaveToDisk: false,
		time: 0,
	});

	// const [loomState, setLoomState] = React.useState(initialState);
	const [searchText, setSearchText] = React.useState("");
	const [isSearchBarVisible, setSearchBarVisible] = React.useState(false);
	const [resizingColumnId, setResizingColumnId] = React.useState<
		string | null
	>(null);

	const [history, setHistory] = React.useState<(LoomStateCommand | null)[]>([
		null,
	]);
	const [position, setPosition] = React.useState(0);

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

		const { shouldSaveToDisk, state } = loomState;
		if (shouldSaveToDisk) {
			logger("LoomStateProvider saving state to disk!");
			onSaveState(reactAppId, state);
		}
	}, [logger, reactAppId, loomState, onSaveState]);

	React.useEffect(() => {
		function handleRefreshEvent(
			filePath: string,
			sourceAppId: string,
			state: LoomState
		) {
			if (reactAppId !== sourceAppId && filePath === loomFile.path) {
				setLoomState({
					state,
					shouldSaveToDisk: false,
					time: Date.now(),
				});
			}
		}

		EventManager.getInstance().on("app-refresh", handleRefreshEvent);
		return () =>
			EventManager.getInstance().off("app-refresh", handleRefreshEvent);
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
				let newState = command.undo(loomState.state);
				if (command.shouldSortRows) {
					newState = new RowSortCommand().execute(newState);
				}
				setLoomState({
					state: newState,
					shouldSaveToDisk: true,
					time: Date.now(),
				});
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
				let newState = command.redo(loomState.state);
				if (command.shouldSortRows) {
					newState = new RowSortCommand().execute(newState);
				}
				setLoomState({
					state: newState,
					shouldSaveToDisk: true,
					time: Date.now(),
				});
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
			let newState = command.execute(loomState.state);
			if (command.shouldSortRows) {
				newState = new RowSortCommand().execute(newState);
			}
			setLoomState({
				state: newState,
				shouldSaveToDisk: true,
				time: Date.now(),
			});
		},
		[position, history, loomState]
	);

	return (
		<LoomStateContext.Provider
			value={{
				loomState: loomState.state,
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
