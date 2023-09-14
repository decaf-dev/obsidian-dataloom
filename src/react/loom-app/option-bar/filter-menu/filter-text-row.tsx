import { FilterCondition } from "src/shared/loom-state/types";
import FilterRow from "./filter-row";
import Input from "src/react/shared/input";
import { ColumnWithMarkdown } from "../types";

interface Props {
	id: string;
	columns: ColumnWithMarkdown[];
	selectedColumnId: string;
	selectedCondition: FilterCondition;
	isEnabled: boolean;
	text: string;
	onRuleToggle: (id: string) => void;
	onColumnChange: (id: string, columnId: string) => void;
	onFilterConditionChange: (id: string, value: FilterCondition) => void;
	onRuleDeleteClick: (id: string) => void;
	onTextChange: (id: string, value: string) => void;
}

const CONDITION_OPTIONS = [
	FilterCondition.IS,
	FilterCondition.IS_NOT,
	FilterCondition.CONTAINS,
	FilterCondition.DOES_NOT_CONTAIN,
	FilterCondition.STARTS_WITH,
	FilterCondition.ENDS_WITH,
	FilterCondition.IS_EMPTY,
	FilterCondition.IS_NOT_EMPTY,
];

export default function FilterTextRow({
	id,
	columns,
	selectedColumnId,
	selectedCondition,
	text,
	isEnabled,
	onRuleToggle,
	onColumnChange,
	onFilterConditionChange,
	onRuleDeleteClick,
	onTextChange,
}: Props) {
	return (
		<FilterRow
			id={id}
			columns={columns}
			selectedColumnId={selectedColumnId}
			selectedCondition={selectedCondition}
			conditionOptions={CONDITION_OPTIONS}
			textInput={
				<Input
					value={text}
					onChange={(newValue) => onTextChange(id, newValue)}
				/>
			}
			isEnabled={isEnabled}
			onColumnChange={onColumnChange}
			onRuleToggle={onRuleToggle}
			onRuleDeleteClick={onRuleDeleteClick}
			onFilterConditionChange={onFilterConditionChange}
		/>
	);
}
