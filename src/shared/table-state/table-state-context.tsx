import { TableState } from "../types/types";
import TableStateCommand from "./table-state-command";
import { useUUID } from "../hooks";
import React from "react";
import { useLogger } from "../logger";
import _ from "lodash";
import {
	isMacRedo,
	isMacUndo,
	isWindowsRedo,
	isWindowsUndo,
} from "../keyboard-event";
import { useAppDispatch } from "src/redux/global/hooks";
import RowSortCommand from "../commands/row-sort-command";

interface Props {
	initialState: TableState;
	children: React.ReactNode;
	onSaveState: (value: TableState) => void;
}

const TableStateContext = React.createContext<{
	tableState: TableState;
	setTableState: React.Dispatch<React.SetStateAction<TableState>>;
	tableId: string;
	doCommand: (command: TableStateCommand) => void;
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
	const [tableId] = useUUID();
	const [history, setHistory] = React.useState<(TableStateCommand | null)[]>([
		null,
	]);
	const [position, setPosition] = React.useState(0);
	const logger = useLogger();
	const dispatch = useAppDispatch();

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
	}, [position, history, tableState, dispatch]);

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
	}, [position, history, tableState, dispatch]);

	//Handle hot key press
	React.useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (isWindowsRedo(e) || isMacRedo(e)) {
				e.preventDefault();
				redo();
			} else if (isWindowsUndo(e) || isMacUndo(e)) {
				e.preventDefault();
				undo();
			}
		}

		const throttleKeyDownEvent = _.throttle(handleKeyDown, 100);
		document.addEventListener("keydown", throttleKeyDownEvent);
		return () => {
			document.removeEventListener("keydown", throttleKeyDownEvent);
		};
	}, [redo, undo]);

	//Whenever the table state is updated save it to disk
	React.useEffect(() => {
		onSaveState(tableState);
	}, [tableState]);

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
		[position, history, tableState, dispatch]
	);

	return (
		<TableStateContext.Provider
			value={{ tableState, setTableState, doCommand, tableId }}
		>
			{children}
		</TableStateContext.Provider>
	);
}
