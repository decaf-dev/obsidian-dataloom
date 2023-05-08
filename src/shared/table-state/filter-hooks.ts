import { SetStateAction } from "react";
import { FilterType, TableState } from "src/data/types";
import { useLogger } from "../logger";
import { addRule, deleteRule, updateRule } from "./filter-rules";

export const useFilterRules = (
	onChange: React.Dispatch<SetStateAction<TableState>>
) => {
	const logFunc = useLogger();

	function handleRuleColumnChange(id: string, columnId: string) {
		logFunc("handleRuleDeleteClick", { id, columnId });
		onChange((prevState) =>
			updateRule(prevState, id, "columnId", columnId)
		);
	}

	function handleRuleFilterTypeChange(id: string, type: FilterType) {
		logFunc("handleRuleDeleteClick", {
			id,
			type,
		});
		onChange((prevState) => updateRule(prevState, id, "type", type));
	}

	function handleRuleTextChange(id: string, text: string) {
		logFunc("handleRuleDeleteClick", { id, text });
		onChange((prevState) => updateRule(prevState, id, "text", text));
	}

	function handleRuleToggle(id: string) {
		logFunc("handleRuleDeleteClick", { id });
		onChange((prevState) => updateRule(prevState, id, "isEnabled"));
	}

	function handleRuleAddClick(columnId: string) {
		logFunc("handleRuleDeleteClick", { columnId });
		onChange((prevState) => addRule(prevState, columnId));
	}

	function handleRuleDeleteClick(id: string) {
		logFunc("handleRuleDeleteClick", {
			id,
		});
		onChange((prevState) => deleteRule(prevState, id));
	}

	return {
		handleRuleAddClick,
		handleRuleColumnChange,
		handleRuleDeleteClick,
		handleRuleFilterTypeChange,
		handleRuleTextChange,
		handleRuleToggle,
	};
};
