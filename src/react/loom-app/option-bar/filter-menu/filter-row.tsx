import Icon from "src/react/shared/icon";
import Button from "src/react/shared/button";
import Switch from "src/react/shared/switch";
import Wrap from "src/react/shared/wrap";
import Stack from "src/react/shared/stack";
import FilterColumnSelect from "./filter-column-select";

import { FilterCondition } from "src/shared/loom-state/types";
import { ColumnWithMarkdown } from "../types";
import FilterConditionSelect from "./filter-condition-select";

interface Props {
	id: string;
	columns: ColumnWithMarkdown[];
	isEnabled: boolean;
	selectedColumnId: string;
	conditionOptions: FilterCondition[];
	selectedCondition: FilterCondition;
	inputNode?: React.ReactNode;
	onRuleToggle: (id: string) => void;
	onColumnChange: (id: string, columnId: string) => void;
	onFilterConditionChange: (id: string, value: FilterCondition) => void;
	onRuleDeleteClick: (id: string) => void;
	children?: React.ReactNode;
}

export default function FilterRow({
	id,
	columns,
	isEnabled,
	selectedColumnId,
	selectedCondition,
	conditionOptions,
	inputNode,
	onRuleToggle,
	onColumnChange,
	onFilterConditionChange,
	onRuleDeleteClick,
}: Props) {
	return (
		<Wrap>
			<FilterColumnSelect
				id={id}
				columns={columns}
				value={selectedColumnId}
				onChange={onColumnChange}
			/>
			<FilterConditionSelect
				id={id}
				options={conditionOptions}
				value={selectedCondition}
				onChange={onFilterConditionChange}
			/>
			{inputNode}
			<Stack
				grow
				justify="flex-end"
				align="center"
				spacing="lg"
				isHorizontal
			>
				<Button
					icon={<Icon lucideId="trash-2" />}
					ariaLabel="Delete filter rule"
					onClick={() => onRuleDeleteClick(id)}
				/>
				<Switch
					value={isEnabled}
					ariaLabel={
						isEnabled ? "Disable filter rule" : "Enable filter rule"
					}
					onToggle={() => onRuleToggle(id)}
				/>
			</Stack>
		</Wrap>
	);
}
