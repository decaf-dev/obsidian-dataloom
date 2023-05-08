import { createFilterRule } from "src/data/table-state-factory";
import { FilterRule, TableState } from "src/data/types";

export const addRule = (
	prevState: TableState,
	columnId: string
): TableState => {
	const { model } = prevState;
	return {
		...prevState,
		model: {
			...model,
			filterRules: [...model.filterRules, createFilterRule(columnId)],
		},
	};
};

export const deleteRule = (prevState: TableState, id: string): TableState => {
	const { model } = prevState;
	const { filterRules } = model;

	return {
		...prevState,
		model: {
			...model,
			filterRules: filterRules.filter((rule) => rule.id !== id),
		},
	};
};

export const updateRule = (
	prevState: TableState,
	id: string,
	key: keyof FilterRule,
	value?: unknown
): TableState => {
	return {
		...prevState,
		model: {
			...prevState.model,
			filterRules: prevState.model.filterRules.map((rule) => {
				const isBoolean = typeof rule[key] === "boolean";

				//If we don't provide a value, we assume that the value is a boolean
				//and we will toggle it
				if (!isBoolean && value === undefined)
					throw new Error(
						"If the key type is not a boolean, a value must be provided"
					);

				if (rule.id == id) {
					return {
						...rule,
						[key as keyof FilterRule]: isBoolean
							? !rule[key]
							: value,
					};
				}
				return rule;
			}),
		},
	};
};
