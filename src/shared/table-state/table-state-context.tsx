import { TableState } from "./types";
import TableStateCommand from "./table-state-command";
import { useDidMountEffect, useUUID } from "../hooks";
import React from "react";
import { WorkspaceLeaf } from "obsidian";
import { EVENT_REDO, EVENT_UNDO } from "../events";
import { useLogger } from "../logger";

interface Props {
	initialState: TableState;
	viewLeaf: WorkspaceLeaf;
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
	viewLeaf,
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
				const newState = command.execute(tableState);
				setTableState(newState);
			}
		}
	}, [position, history, tableState]);

	//Handle hot key press
	React.useEffect(() => {
		function handleUndoEvent(leaf: WorkspaceLeaf) {
			if (leaf === viewLeaf) {
				undo();
			}
		}

		function handleRedoEvent(leaf: WorkspaceLeaf) {
			if (leaf === viewLeaf) {
				redo();
			}
		}

		//@ts-expect-error missing overload
		app.workspace.on(EVENT_UNDO, handleUndoEvent);
		//@ts-expect-error missing overload
		app.workspace.on(EVENT_REDO, handleRedoEvent);

		return () => {
			app.workspace.off(EVENT_UNDO, handleUndoEvent);
			app.workspace.off(EVENT_REDO, handleRedoEvent);
		};
	}, [redo, undo]);

	//Once we have mounted
	//Whenever the table state is updated save it to disk
	useDidMountEffect(() => {
		onSaveState(tableState);
	}, [tableState]);

	function doCommand(command: TableStateCommand) {
		if (position < history.length - 1) {
			setHistory((prevState) => prevState.slice(0, position + 1));
		}

		setHistory((prevState) => [...prevState, command]);
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
