import { createFilterRule } from "src/shared/loom-state/loom-state-factory";
import { FilterRule, LoomState } from "src/shared/loom-state/types";

export const addRule = (prevState: LoomState, columnId: string): LoomState => {
	const { model } = prevState;
	return {
		...prevState,
		model: {
			...model,
			filterRules: [...model.filterRules, createFilterRule(columnId)],
		},
	};
};

export const deleteRule = (prevState: LoomState, id: string): LoomState => {
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

export const updateRule = <K extends keyof FilterRule, V extends FilterRule[K]>(
	prevState: LoomState,
	id: string,
	key: K,
	value?: V
): LoomState => {
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
						[key]: isBoolean ? !rule[key] : value,
					};
				}
				return rule;
			}),
		},
	};
};
