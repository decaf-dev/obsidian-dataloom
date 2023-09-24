import { Filter } from "src/shared/loom-state/types/loom-state";
import { useLogger } from "src/shared/logger";
import { filterByFilters } from "../filter-by-filters";
import { useLoomState } from "../../loom-state-provider";
import FilterUpdateCommand from "src/shared/loom-state/commands/filter-update-command";
import FilterAddCommand from "src/shared/loom-state/commands/filter-add-command";
import FilterDeleteCommand from "src/shared/loom-state/commands/filter-delete-command";

export const useFilter = () => {
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

	function handleFilterAdd() {
		logger("handleFilterAdd");
		doCommand(new FilterAddCommand());
	}

	function handleFilterDelete(id: string) {
		logger("handleFilterDelete", { id });
		doCommand(new FilterDeleteCommand(id));
	}

	return {
		onFilterAdd: handleFilterAdd,
		onFilterUpdate: handleFilterUpdate,
		onFilterDelete: handleFilterDelete,
		filterByFilters,
	};
};
