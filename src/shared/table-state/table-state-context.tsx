import { Dispatch, createContext, useContext, useId, useState } from "react";
import { TableState } from "../../data/types";

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
	const [tableId] = useId();

	return (
		<TableStateContext.Provider
			value={{ tableState, setTableState, tableId }}
		>
			{children}
		</TableStateContext.Provider>
	);
}
