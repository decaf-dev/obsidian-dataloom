import { SetStateAction } from "react";
import { FilterType, LoomState } from "src/shared/loom-state/types";
import { useLogger } from "src/shared/logger";
import {
	addRule,
	deleteRule,
	updateRule,
} from "src/shared/loom-state/filter-utils";
import { filterBodyRowsByRules } from "../filter-by-rules";

export const useFilterRules = (
	onChange: React.Dispatch<SetStateAction<LoomState>>
) => {
	const logger = useLogger();

	function handleRuleColumnChange(id: string, columnId: string) {
		logger("handleRuleColumnChange", { id, columnId });
		onChange((prevState) =>
			updateRule(prevState, id, "columnId", columnId)
		);
	}

	function handleRuleFilterTypeChange(id: string, type: FilterType) {
		logger("handleRuleFilterTypeChange", {
			id,
			type,
		});
		onChange((prevState) => updateRule(prevState, id, "type", type));
	}

	function handleRuleTextChange(id: string, text: string) {
		logger("handleRuleTextChange", { id, text });
		onChange((prevState) => updateRule(prevState, id, "text", text));
	}

	function handleRuleToggle(id: string) {
		logger("handleRuleToggle", { id });
		onChange((prevState) => updateRule(prevState, id, "isEnabled"));
	}

	function handleRuleAddClick(columnId: string) {
		logger("handleRuleAddClick", { columnId });
		onChange((prevState) => addRule(prevState, columnId));
	}

	function handleRuleDeleteClick(id: string) {
		logger("handleRuleDeleteClick", {
			id,
		});
		onChange((prevState) => deleteRule(prevState, id));
	}

	function handleRuleTagsChange(id: string, tagIds: string[]) {
		logger("handleRuleTagsChange", {
			id,
			tagIds,
		});
		onChange((prevState) => updateRule(prevState, id, "tagIds", tagIds));
	}

	return {
		handleRuleAddClick,
		handleRuleColumnChange,
		handleRuleDeleteClick,
		handleRuleFilterTypeChange,
		handleRuleTextChange,
		handleRuleToggle,
		handleRuleTagsChange,
		filterBodyRowsByRules,
	};
};
