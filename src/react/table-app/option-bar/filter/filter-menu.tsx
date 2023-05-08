import Menu from "src/react/shared/menu";
import Padding from "src/react/shared/padding";
import Stack from "src/react/shared/stack";
import { ColumnData } from "../types";
import Icon from "src/react/shared/icon";
import { IconType } from "src/react/shared/icon/types";
import { Button } from "src/react/shared/button";
import FilterRow from "./filter-row";
import { FilterRule, FilterType } from "src/data/types";
import { ColumnIdError } from "src/shared/table-state/error";

interface Props {
	id: string;
	top: number;
	left: number;
	isOpen: boolean;
	columns: ColumnData[];
	filterRules: FilterRule[];
	onAddClick: () => void;
	onToggle: (id: string) => void;
	onColumnChange: (id: string, columnId: string) => void;
	onFilterTypeChange: (id: string, value: FilterType) => void;
	onValueChange: (id: string, value: string) => void;
	onDeleteClick: (id: string) => void;
}

export default function FilterMenu({
	id,
	top,
	left,
	isOpen,
	columns,
	filterRules,
	onAddClick,
	onToggle,
	onColumnChange,
	onFilterTypeChange,
	onValueChange,
	onDeleteClick,
}: Props) {
	return (
		<Menu isOpen={isOpen} id={id} top={top} left={left}>
			<div className="NLT__filter-menu">
				<Padding p="md">
					<Stack spacing="md" isVertical>
						{filterRules.map((rule) => {
							const { id, value, columnId, isEnabled, type } =
								rule;
							const column = columns.find(
								(column) => column.id == columnId
							);
							if (!column) throw new ColumnIdError(columnId);
							const { cellType } = column;
							return (
								<FilterRow
									key={id}
									id={id}
									columns={columns}
									value={value}
									cellType={cellType}
									filterType={type}
									columnId={columnId}
									isEnabled={isEnabled}
									onValueChange={onValueChange}
									onColumnChange={onColumnChange}
									onFilterTypeChange={onFilterTypeChange}
									onToggle={onToggle}
									onDeleteClick={onDeleteClick}
								/>
							);
						})}
					</Stack>
					<Button
						icon={<Icon type={IconType.ADD} />}
						ariaLabel="Add filter rule"
						onClick={() => onAddClick()}
					/>
				</Padding>
			</div>
		</Menu>
	);
}
