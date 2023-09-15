import { SetStateAction } from "react";
import {
	CellType,
	FilterCondition,
	LoomState,
	TextFilter,
} from "src/shared/loom-state/types";
import { useLogger } from "src/shared/logger";
import {
	addRule,
	deleteRule,
	updateRule,
} from "src/shared/loom-state/filter-utils";
import { filterByFilters } from "../filter-by-filters";
import { useLoomState } from "../../loom-state-provider";
import RuleTypeUpdateCommand from "src/shared/loom-state/commands/rule-type-update-command";

export const useFilter = (
	onChange: React.Dispatch<SetStateAction<LoomState>>
) => {
	const logger = useLogger();
	const { doCommand } = useLoomState();

	function handleFilterColumnChange(id: string, columnId: string) {
		logger("handleFilterColumnChange", { id, columnId });
		onChange((prevState) =>
			updateRule(prevState, id, "columnId", columnId)
		);
	}

	function handleFilterConditionChange(
		id: string,
		condition: FilterCondition
	) {
		logger("handleFilterConditionChange", {
			id,
			condition,
		});
		onChange((prevState) =>
			updateRule(prevState, id, "condition", condition)
		);
	}

	function handleFilterTextChange(id: string, text: string) {
		logger("handleFilterTextChange", { id, text });
		onChange((prevState) => updateRule(prevState, id, "text", text));
	}

	function handleFilterToggle(id: string) {
		logger("handleFilterToggle", { id });
		onChange((prevState) => updateRule(prevState, id, "isEnabled"));
	}

	function handleFilterAddClick(columnId: string) {
		logger("handleFilterAddClick", { columnId });
		onChange((prevState) => addRule(prevState, columnId));
	}

	function handleFilterDeleteClick(id: string) {
		logger("handleFilterDeleteClick", {
			id,
		});
		onChange((prevState) => deleteRule(prevState, id));
	}

	function handleFilterTagsChange(id: string, tagIds: string[]) {
		logger("handleFilterTagsChange", {
			id,
			tagIds,
		});

		doCommand(
			new RuleTypeUpdateCommand<TextFilter>(
				id,
				"",
				CellType.TEXT,
				"text",
				""
			)
		);
		//onChange((prevState) => updateRule(prevState, id, "tagIds", tagIds));
	}

	return {
		onFilterAddClick: handleFilterAddClick,
		onFilterColumnChange: handleFilterColumnChange,
		onFilterDeleteClick: handleFilterDeleteClick,
		onFilterConditionChange: handleFilterConditionChange,
		onFilterTextChange: handleFilterTextChange,
		onFilterToggle: handleFilterToggle,
		onFilterTagsChange: handleFilterTagsChange,
		filterByFilters,
	};
};
