import { Dispatch, createContext, useContext, useState } from "react";
import { TableState } from "./types";
import { useUUID } from "../hooks";

interface Props {
	initialState: TableState;
	children: React.ReactNode;
}

const TableStateContext = createContext<{
	tableState: TableState;
	setTableState: Dispatch<React.SetStateAction<TableState>>;
	tableId: string;
} | null>(null);

export const useTableState = () => {
	const value = useContext(TableStateContext);
	if (value === null) {
		throw new Error(
			"useTableState() called without a <ThemeProvider /> in the tree."
		);
	}

	return value;
};

export default function TableStateProvider({ initialState, children }: Props) {
	const [tableState, setTableState] = useState(initialState);
	const [tableId] = useUUID();

	return (
		<TableStateContext.Provider
			value={{ tableState, setTableState, tableId }}
		>
			{children}
		</TableStateContext.Provider>
	);
}
