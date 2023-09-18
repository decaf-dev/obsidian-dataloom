import { SetStateAction } from "react";
import {
	CellType,
	Filter,
	LoomState,
} from "src/shared/loom-state/types/loom-state";
import { useLogger } from "src/shared/logger";
import { addFilter, deleteFilter } from "src/shared/loom-state/filter-utils";
import { filterByFilters } from "../filter-by-filters";
import { useLoomState } from "../../loom-state-provider";
import FilterUpdateCommand from "src/shared/loom-state/commands/filter-update-command";

export const useFilter = (
	onChange: React.Dispatch<SetStateAction<LoomState>>
) => {
	const logger = useLogger();
	const { doCommand } = useLoomState();

	function handleFilterUpdate(
		id: string,
		data: Partial<Filter>,
		isPartial?: boolean
	) {
		logger("handleFilterUpdate", { id, data });
		doCommand(new FilterUpdateCommand<Filter>(id, data, isPartial));
	}

	function handleFilterAdd(columnId: string, cellType: CellType) {
		logger("handleFilterAdd", { columnId, cellType });
		onChange((prevState) => addFilter(prevState, columnId, cellType));
	}

	function handleFilterDelete(id: string) {
		logger("handleFilterDelete", { id });
		onChange((prevState) => deleteFilter(prevState, id));
	}

	return {
		onFilterAdd: handleFilterAdd,
		onFilterUpdate: handleFilterUpdate,
		onFilterDelete: handleFilterDelete,
		filterByFilters,
	};
};
