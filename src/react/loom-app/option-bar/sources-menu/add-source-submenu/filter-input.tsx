import CheckboxFilterSelect from "src/react/shared/checkbox-filter-select";
import DateFilterSelect from "src/react/shared/date-filter-select";
import Input from "src/react/shared/input";
import { ObsidianPropertyType } from "src/shared/frontmatter/types";
import { DateFilterOption } from "src/shared/loom-state/types/loom-state";

interface Props {
	filterTextId?: string;
	selectedPropertyType: ObsidianPropertyType | null;
	filterText: string;
	onFilterTextChange: (value: string) => void;
}

export default function FilterInput({
	filterTextId,
	selectedPropertyType,
	filterText,
	onFilterTextChange,
}: Props) {
	const showListInput =
		selectedPropertyType === ObsidianPropertyType.ALIASES ||
		selectedPropertyType === ObsidianPropertyType.TAGS ||
		selectedPropertyType === ObsidianPropertyType.MULTITEXT;
	const showDateInput =
		selectedPropertyType === ObsidianPropertyType.DATE ||
		selectedPropertyType === ObsidianPropertyType.DATETIME;
	return (
		<>
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
			{showDateInput && (
				<DateFilterSelect
					value={filterText as DateFilterOption}
					onChange={(value) => onFilterTextChange(value as string)}
				/>
			)}
			{selectedPropertyType === ObsidianPropertyType.CHECKBOX && (
				<CheckboxFilterSelect
					value={filterText === "true"}
					onChange={(value) => onFilterTextChange(value.toString())}
				/>
			)}
			{showListInput && (
				<Input
					id={filterTextId}
					autoFocus={false}
					value={filterText}
					onChange={(value) => onFilterTextChange(value)}
				/>
			)}
		</>
	);
}
