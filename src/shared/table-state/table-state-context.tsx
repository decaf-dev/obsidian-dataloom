import { TableState } from "../types";
import TableStateCommand from "./table-state-command";
import React from "react";
import { useLogger } from "../logger";
import RowSortCommand from "../commands/row-sort-command";
import { useMountState } from "src/obsidian-shim/development/mount-context";

interface Props {
	initialState: TableState;
	children: React.ReactNode;
	onSaveState: (appId: string, state: TableState) => void;
}

const TableStateContext = React.createContext<{
	searchText: string;
	isSearchBarVisible: boolean;
	resizingColumnId: string | null;
	tableState: TableState;
	setTableState: React.Dispatch<React.SetStateAction<TableState>>;
	toggleSearchBar: () => void;
	setResizingColumnId: React.Dispatch<React.SetStateAction<string | null>>;
	setSearchText: React.Dispatch<React.SetStateAction<string>>;
	doCommand: (command: TableStateCommand) => void;
	commandUndo: () => void;
	commandRedo: () => void;
} | null>(null);

export const useTableState = () => {
	const value = React.useContext(TableStateContext);
	if (value === null) {
		throw new Error(
			"useTableState() called without a <TableStateProvider /> in the tree."
		);
	}

	return value;
};

export default function TableStateProvider({
	initialState,
	onSaveState,
	children,
}: Props) {
	const [tableState, setTableState] = React.useState(initialState);
	const [searchText, setSearchText] = React.useState("");
	const [isSearchBarVisible, setSearchBarVisible] = React.useState(false);
	const [resizingColumnId, setResizingColumnId] = React.useState<
		string | null
	>(null);

	const [history, setHistory] = React.useState<(TableStateCommand | null)[]>([
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

		onSaveState(appId, tableState);
	}, [appId, tableState, onSaveState]);

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
				let newState = command.undo(tableState);
				if (command.shouldSortRows) {
					newState = new RowSortCommand().execute(newState);
				}
				setTableState(newState);
			}
		}
	}, [position, history, tableState, logger]);

	const redo = React.useCallback(() => {
		if (position < history.length - 1) {
			logger("handleRedoEvent");

			const currentPosition = position + 1;
			setPosition(currentPosition);

			const command = history[currentPosition];
			if (command !== null) {
				logger(command.constructor.name + ".redo");
				let newState = command.redo(tableState);
				if (command.shouldSortRows) {
					newState = new RowSortCommand().execute(newState);
				}
				setTableState(newState);
			}
		}
	}, [position, history, tableState, logger]);

	const doCommand = React.useCallback(
		(command: TableStateCommand) => {
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
			let newState = command.execute(tableState);
			if (command.shouldSortRows) {
				newState = new RowSortCommand().execute(newState);
			}
			setTableState(newState);
		},
		[position, history, tableState]
	);

	return (
		<TableStateContext.Provider
			value={{
				tableState,
				setTableState,
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
		</TableStateContext.Provider>
	);
}
