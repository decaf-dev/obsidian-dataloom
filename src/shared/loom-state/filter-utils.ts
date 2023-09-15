import { createFilter } from "src/shared/loom-state/loom-state-factory";
import { Filter, LoomState } from "src/shared/loom-state/types";

export const addRule = (prevState: LoomState, columnId: string): LoomState => {
	const { model } = prevState;
	return {
		...prevState,
		model: {
			...model,
			filters: [...model.filters, createFilter(columnId)],
		},
	};
};

export const deleteRule = (prevState: LoomState, id: string): LoomState => {
	const { model } = prevState;
	const { filters } = model;

	return {
		...prevState,
		model: {
			...model,
			filters: filters.filter((filter) => filter.id !== id),
		},
	};
};

export const updateRule = <K extends keyof Filter, V extends Filter[K]>(
	prevState: LoomState,
	id: string,
	key: K,
	value?: V
): LoomState => {
	return {
		...prevState,
		model: {
			...prevState.model,
			filters: prevState.model.filters.map((filter) => {
				const isBoolean = typeof filter[key] === "boolean";

				//If we don't provide a value, we assume that the value is a boolean
				//and we will toggle it
				if (!isBoolean && value === undefined)
					throw new Error(
						"If the key type is not a boolean, a value must be provided"
					);

				if (filter.id === id) {
					return {
						...filter,
						[key]: isBoolean ? !filter[key] : value,
					};
				}
				return filter;
			}),
		},
	};
};
