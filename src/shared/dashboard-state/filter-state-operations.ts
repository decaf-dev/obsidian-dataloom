import { createFilterRule } from "src/data/table-state-factory";
import { FilterRule, DashboardState } from "src/shared/types";

export const addRule = (
	prevState: DashboardState,
	columnId: string
): DashboardState => {
	const { model } = prevState;
	return {
		...prevState,
		model: {
			...model,
			filterRules: [...model.filterRules, createFilterRule(columnId)],
		},
	};
};

export const deleteRule = (
	prevState: DashboardState,
	id: string
): DashboardState => {
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
	prevState: DashboardState,
	id: string,
	key: keyof FilterRule,
	value?: unknown
): DashboardState => {
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

				if (rule.id === id) {
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
