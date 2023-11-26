import Stack from "src/react/shared/stack";

import { AddSourceError } from "./types";
import Select from "src/react/shared/select";
import { ObsidianPropertyType } from "src/shared/frontmatter/types";
import FrontmatterCache from "src/shared/frontmatter/frontmatter-cache";
import {
	DateFilterOption,
	FilterCondition,
	TextFilterCondition,
} from "src/shared/loom-state/types/loom-state";
import { getDisplayNameForFilterCondition } from "src/shared/loom-state/type-display-names";
import Input from "src/react/shared/input";
import { getFilterConditionsFromPropertyType } from "./utils";
import DateFilterSelect from "src/react/shared/date-filter-select";
import CheckboxFilterSelect from "src/react/shared/checkbox-filter-select";

interface Props {
	propertyKeySelectId: string;
	propertyTypeSelectId: string;
	filterConditionId: string;
	filterTextId: string;
	selectedPropertyType: ObsidianPropertyType | null;
	selectedPropertyKey: string | null;
	selectedFilterCondition: TextFilterCondition | null;
	filterText: string;
	error: AddSourceError | null;
	onPropertyKeyChange: (value: string | null) => void;
	onPropertyTypeChange: (value: ObsidianPropertyType | null) => void;
	onFilterConditionChange: (value: TextFilterCondition | null) => void;
	onFilterTextChange: (value: string) => void;
}

export default function FrontmatterSourceOptions({
	propertyTypeSelectId,
	propertyKeySelectId,
	filterTextId,
	filterConditionId,
	selectedPropertyType,
	selectedPropertyKey,
	selectedFilterCondition,
	filterText,
	onPropertyKeyChange,
	onPropertyTypeChange,
	onFilterConditionChange,
	onFilterTextChange,
}: Props) {
	let propertyTypes: string[] = [];
	if (selectedPropertyType !== null) {
		propertyTypes =
			FrontmatterCache.getInstance().getPropertyNames(
				selectedPropertyType
			);
	}

	let filterConditions: FilterCondition[] = [];
	if (selectedPropertyType !== null) {
		filterConditions =
			getFilterConditionsFromPropertyType(selectedPropertyType);
	}
	return (
		<>
			<Stack spacing="sm">
				<label htmlFor={propertyTypeSelectId}>Property Type</label>
				<Select
					value={selectedPropertyType ?? ""}
					onChange={(value) =>
						onPropertyTypeChange(
							(value as ObsidianPropertyType) || null
						)
					}
				>
					<option value="">Select an option</option>
					{Object.values(ObsidianPropertyType).map((type) => {
						return (
							<option key={type} value={type}>
								{type}
							</option>
						);
					})}
				</Select>
			</Stack>
			<Stack spacing="sm">
				<label htmlFor={propertyKeySelectId}>Property Key</label>
				<Select
					isDisabled={selectedPropertyType === null}
					value={selectedPropertyKey ?? ""}
					onChange={(value) => onPropertyKeyChange(value || null)}
				>
					<option value="">Select an option</option>
					{Object.values(propertyTypes).map((type) => {
						return (
							<option key={type} value={type}>
								{type}
							</option>
						);
					})}
				</Select>
			</Stack>
			<Stack spacing="sm">
				<label htmlFor={filterConditionId}>Filter condition</label>
				<Select
					isDisabled={selectedPropertyKey === null}
					value={selectedFilterCondition ?? ""}
					onChange={(value) =>
						onFilterConditionChange(
							(value as TextFilterCondition) || null
						)
					}
				>
					<option value="">Select an option</option>
					{Object.values(filterConditions).map((type) => {
						return (
							<option key={type} value={type}>
								{getDisplayNameForFilterCondition(type)}
							</option>
						);
					})}
				</Select>
			</Stack>
			<Stack spacing="sm">
				<label htmlFor={filterTextId}>Filter text</label>
				{selectedPropertyType === ObsidianPropertyType.TEXT && (
					<Input
						id={filterTextId}
						autoFocus={false}
						value={filterText}
						onChange={(value) => onFilterTextChange(value)}
					/>
				)}
				{selectedPropertyType === ObsidianPropertyType.NUMBER && (
					<Input
						id={filterTextId}
						isNumeric
						autoFocus={false}
						value={filterText}
						onChange={(value) => onFilterTextChange(value)}
					/>
				)}
				{selectedPropertyType === ObsidianPropertyType.DATE ||
					(selectedPropertyType === ObsidianPropertyType.DATETIME && (
						<DateFilterSelect
							value={filterText as DateFilterOption}
							onChange={(value) =>
								onFilterTextChange(value as string)
							}
						/>
					))}
				{selectedPropertyType === ObsidianPropertyType.CHECKBOX && (
					<CheckboxFilterSelect
						value={filterText === "true"}
						onChange={(value) =>
							onFilterTextChange(value.toString())
						}
					/>
				)}
				{selectedPropertyType === ObsidianPropertyType.ALIASES ||
					selectedPropertyType === ObsidianPropertyType.TAGS ||
					(selectedPropertyType ===
						ObsidianPropertyType.MULTITEXT && (
						<Input
							id={filterTextId}
							placeholder="Enter a comma-separated list of values"
							autoFocus={false}
							value={filterText}
							onChange={(value) => onFilterTextChange(value)}
						/>
					))}
			</Stack>
		</>
	);
}
