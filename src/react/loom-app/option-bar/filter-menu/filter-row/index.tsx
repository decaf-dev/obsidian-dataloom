import Button from "src/react/shared/button";
import Icon from "src/react/shared/icon";
import Stack from "src/react/shared/stack";
import Switch from "src/react/shared/switch";
import Wrap from "src/react/shared/wrap";
import FilterColumnSelect from "../filter-column-select";

import {
	type Column,
	type FilterCondition,
	type FilterOperator as FilterOperatorType,
	TextFilterCondition,
} from "src/shared/loom-state/types/loom-state";
import FilterConditionSelect from "../filter-condition-select";

import FilterOperator from "../filter-operator";
import "./styles.css";

interface Props {
	index: number;
	id: string;
	columns: Column[];
	isEnabled: boolean;
	selectedColumnId: string;
	selectedOperator: FilterOperatorType;
	conditionOptions: FilterCondition[];
	selectedCondition: FilterCondition;
	inputNode?: React.ReactNode;
	useSpacer?: boolean;
	onToggle: (id: string) => void;
	onColumnChange: (id: string, columnId: string) => void;
	onConditionChange: (id: string, value: FilterCondition) => void;
	onOperatorChange: (id: string, value: FilterOperatorType) => void;
	onDeleteClick: (id: string) => void;
	children?: React.ReactNode;
}

export default function FilterRow({
	index,
	id,
	columns,
	useSpacer,
	isEnabled,
	selectedColumnId,
	selectedOperator,
	selectedCondition,
	conditionOptions,
	inputNode,
	onToggle,
	onColumnChange,
	onOperatorChange,
	onConditionChange,
	onDeleteClick,
}: Props) {
	return (
		<div className="dataloom-filter-row">
			<Wrap>
				{index !== 0 && (
					<FilterOperator
						id={id}
						value={selectedOperator}
						onChange={onOperatorChange}
					/>
				)}
				{useSpacer && (
					<div className="dataloom-filter-row__spacer"></div>
				)}

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
					onChange={onConditionChange}
				/>
				{selectedCondition !== TextFilterCondition.IS_EMPTY &&
					selectedCondition !== TextFilterCondition.IS_NOT_EMPTY && (
						<div className="dataloom-filter-row__input">
							{inputNode}
						</div>
					)}
				<Stack
					grow
					justify="flex-end"
					align="center"
					spacing="lg"
					isHorizontal
				>
					<Button
						icon={<Icon lucideId="trash-2" />}
						ariaLabel="Delete filter"
						onClick={() => onDeleteClick(id)}
					/>
					<Switch
						value={isEnabled}
						ariaLabel={
							isEnabled ? "Disable filter" : "Enable filter"
						}
						onToggle={() => onToggle(id)}
					/>
				</Stack>
			</Wrap>
		</div>
	);
}
