import { ObsidianPropertyType } from "src/shared/frontmatter/types";
import {
	DateFilterCondition,
	NumberFilterCondition,
	TextFilterCondition,
} from "src/shared/loom-state/types/loom-state";

export const getFilterConditionsForPropertyType = (
	type: ObsidianPropertyType
) => {
	switch (type) {
		case ObsidianPropertyType.TEXT:
			return [
				TextFilterCondition.IS,
				TextFilterCondition.IS_NOT,
				TextFilterCondition.STARTS_WITH,
				TextFilterCondition.ENDS_WITH,
				TextFilterCondition.CONTAINS,
				TextFilterCondition.DOES_NOT_CONTAIN,
				TextFilterCondition.IS_EMPTY,
				TextFilterCondition.IS_NOT_EMPTY,
			];
		case ObsidianPropertyType.NUMBER:
			return [
				NumberFilterCondition.IS_EQUAL,
				NumberFilterCondition.IS_NOT_EQUAL,
				NumberFilterCondition.IS_GREATER,
				NumberFilterCondition.IS_LESS,
				NumberFilterCondition.IS_GREATER_OR_EQUAL,
				NumberFilterCondition.IS_LESS_OR_EQUAL,
				NumberFilterCondition.IS_EMPTY,
				NumberFilterCondition.IS_NOT_EMPTY,
			];
		case ObsidianPropertyType.DATE:
		case ObsidianPropertyType.DATETIME:
			return [
				DateFilterCondition.IS,
				DateFilterCondition.IS_BEFORE,
				DateFilterCondition.IS_AFTER,
				DateFilterCondition.IS_EMPTY,
				DateFilterCondition.IS_NOT_EMPTY,
			];
		case ObsidianPropertyType.ALIASES:
		case ObsidianPropertyType.TAGS:
		case ObsidianPropertyType.MULTITEXT:
			return [
				TextFilterCondition.CONTAINS,
				TextFilterCondition.DOES_NOT_CONTAIN,
				TextFilterCondition.IS_EMPTY,
				TextFilterCondition.IS_NOT_EMPTY,
			];
		case ObsidianPropertyType.CHECKBOX:
			return [TextFilterCondition.IS, TextFilterCondition.IS_NOT];
		default:
			return [];
	}
};
