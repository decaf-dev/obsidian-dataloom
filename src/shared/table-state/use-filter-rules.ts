import { SetStateAction } from "react";
import { FilterType, TableState } from "src/shared/types/types";
import { useLogger } from "../logger";
import { addRule, deleteRule, updateRule } from "./filter-state-operations";
import { filterBodyRowsByRules } from "./filter-by-rules";

export const useFilterRules = (
	onChange: React.Dispatch<SetStateAction<TableState>>
) => {
	const logFunc = useLogger();

	function handleRuleColumnChange(id: string, columnId: string) {
		logFunc("handleRuleColumnChange", { id, columnId });
		onChange((prevState) =>
			updateRule(prevState, id, "columnId", columnId)
		);
	}

	function handleRuleFilterTypeChange(id: string, type: FilterType) {
		logFunc("handleRuleFilterTypeChange", {
			id,
			type,
		});
		onChange((prevState) => updateRule(prevState, id, "type", type));
	}

	function handleRuleTextChange(id: string, text: string) {
		logFunc("handleRuleTextChange", { id, text });
		onChange((prevState) => updateRule(prevState, id, "text", text));
	}

	function handleRuleToggle(id: string) {
		logFunc("handleRuleToggle", { id });
		onChange((prevState) => updateRule(prevState, id, "isEnabled"));
	}

	function handleRuleAddClick(columnId: string) {
		logFunc("handleRuleAddClick", { columnId });
		onChange((prevState) => addRule(prevState, columnId));
	}

	function handleRuleDeleteClick(id: string) {
		logFunc("handleRuleDeleteClick", {
			id,
		});
		onChange((prevState) => deleteRule(prevState, id));
	}

	function handleRuleTagsChange(id: string, tagIds: string[]) {
		logFunc("handleRuleTagsChange", {
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
