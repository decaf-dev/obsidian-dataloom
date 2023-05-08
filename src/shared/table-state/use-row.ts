import { SetStateAction } from "react";
import { TableState } from "src/shared/table-state/types";
import { useLogger } from "../logger";

export const useRow = (
	onChange: React.Dispatch<SetStateAction<TableState>>
) => {
	const logFunc = useLogger();

	return {};
};
