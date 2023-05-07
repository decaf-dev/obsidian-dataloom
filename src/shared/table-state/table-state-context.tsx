import { Dispatch, createContext, useContext, useState } from "react";
import { TableState } from "../../data/types";

interface Props {
	initialState: TableState;
	children: React.ReactNode;
}

const TableStateContext = createContext<
	[TableState, Dispatch<React.SetStateAction<TableState>>] | null
>(null);

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

	return (
		<TableStateContext.Provider value={[tableState, setTableState]}>
			{children}
		</TableStateContext.Provider>
	);
}
