import { TableState } from "./types";
import TableStateCommand from "./table-state-command";
import { useDidMountEffect, useUUID } from "../hooks";
import React from "react";
import { WorkspaceLeaf } from "obsidian";
import { useLogger } from "../logger";
import _ from "lodash";
import {
	isMacRedo,
	isMacUndo,
	isWindowsRedo,
	isWindowsUndo,
} from "../keyboardEvent";

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

	const undo = React.useCallback(() => {
		if (position > 0) {
			logger("handleUndoEvent");

			const currentPosition = position - 1;
			setPosition(currentPosition);

			const command = history[position];
			if (command !== null) {
				const newState = command.undo(tableState);
				setTableState(newState);
			}
		}
	}, [position, history, tableState]);

	const redo = React.useCallback(() => {
		if (position < history.length - 1) {
			logger("handleRedoEvent");

			const currentPosition = position + 1;
			setPosition(currentPosition);

			const command = history[currentPosition];
			if (command !== null) {
				let newState;
				if (command.redo === undefined) {
					newState = command.execute(tableState);
				} else {
					newState = command.redo(tableState);
				}
				setTableState(newState);
			}
		}
	}, [position, history, tableState]);

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

	//Once we have mounted
	//Whenever the table state is updated save it to disk
	useDidMountEffect(() => {
		onSaveState(tableState);
	}, [tableState]);

	function doCommand(command: TableStateCommand) {
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
		const newState = command.execute(tableState);
		setTableState(newState);
	}

	return (
		<TableStateContext.Provider
			value={{ tableState, setTableState, doCommand, tableId }}
		>
			{children}
		</TableStateContext.Provider>
	);
}
