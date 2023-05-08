import { SetStateAction } from "react";
import { FunctionType, TableState } from "src/shared/table-state/types";
import { useLogger } from "../logger";
import {
	cellUpdateBody,
	cellUpdateFooter,
	cellUpdateHeader,
} from "./cell-state-operations";

export const useCell = (
	onChange: React.Dispatch<SetStateAction<TableState>>
) => {
	const logFunc = useLogger();

	function handleHeaderCellContentChange(cellId: string, value: string) {
		logFunc("handleCellContentChange", {
			cellId,
			markdown: value,
		});

		onChange((prevState) =>
			cellUpdateHeader(prevState, cellId, "markdown", value)
		);
	}

	function handleBodyCellContentChange(
		cellId: string,
		rowId: string,
		value: string
	) {
		logFunc("handleCellContentChange", {
			cellId,
			rowId,
			markdown: value,
		});

		onChange((prevState) =>
			cellUpdateBody(prevState, cellId, rowId, "markdown", value)
		);
	}

	function handleCellDateTimeChange(
		cellId: string,
		rowId: string,
		value: number | null
	) {
		logFunc("handleCellContentChange", {
			cellId,
			rowId,
			dateTime: value,
		});

		onChange((prevState) =>
			cellUpdateBody(prevState, cellId, rowId, "dateTime", value)
		);
	}

	function handleFunctionTypeChange(
		cellId: string,
		functionType: FunctionType
	) {
		logFunc("handleFunctionTypeChange", {
			cellId,
			functionType,
		});

		onChange((prevState) =>
			cellUpdateFooter(prevState, cellId, "functionType", functionType)
		);
	}

	return {
		handleHeaderCellContentChange,
		handleBodyCellContentChange,
		handleCellDateTimeChange,
		handleFunctionTypeChange,
	};
};
