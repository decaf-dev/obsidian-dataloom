import { LoomState } from "../types";
import LoomStateCommand from "./loom-state-command";
import React from "react";
import { useLogger } from "../logger";
import RowSortCommand from "../commands/row-sort-command";
import { useMountState } from "src/react/loom-app/mount-provider";

interface Props {
	initialState: LoomState;
	children: React.ReactNode;
	onSaveState: (appId: string, state: LoomState) => void;
}

const LoomStateContext = React.createContext<{
	searchText: string;
	isSearchBarVisible: boolean;
	resizingColumnId: string | null;
	LoomState: LoomState;
	setLoomState: React.Dispatch<React.SetStateAction<LoomState>>;
	toggleSearchBar: () => void;
	setResizingColumnId: React.Dispatch<React.SetStateAction<string | null>>;
	setSearchText: React.Dispatch<React.SetStateAction<string>>;
	doCommand: (command: LoomStateCommand) => void;
	commandUndo: () => void;
	commandRedo: () => void;
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
	const [LoomState, setLoomState] = React.useState(initialState);
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
	const { appId } = useMountState();

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

		onSaveState(appId, LoomState);
	}, [appId, LoomState, onSaveState]);

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
				let newState = command.undo(LoomState);
				if (command.shouldSortRows) {
					newState = new RowSortCommand().execute(newState);
				}
				setLoomState(newState);
			}
		}
	}, [position, history, LoomState, logger]);

	const redo = React.useCallback(() => {
		if (position < history.length - 1) {
			logger("handleRedoEvent");

			const currentPosition = position + 1;
			setPosition(currentPosition);

			const command = history[currentPosition];
			if (command !== null) {
				logger(command.constructor.name + ".redo");
				let newState = command.redo(LoomState);
				if (command.shouldSortRows) {
					newState = new RowSortCommand().execute(newState);
				}
				setLoomState(newState);
			}
		}
	}, [position, history, LoomState, logger]);

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
			let newState = command.execute(LoomState);
			if (command.shouldSortRows) {
				newState = new RowSortCommand().execute(newState);
			}
			setLoomState(newState);
		},
		[position, history, LoomState]
	);

	return (
		<LoomStateContext.Provider
			value={{
				LoomState,
				setLoomState,
				doCommand,
				commandRedo: redo,
				commandUndo: undo,
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
