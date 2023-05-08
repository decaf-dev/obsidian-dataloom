import Menu from "src/react/shared/menu";
import Padding from "src/react/shared/padding";
import Stack from "src/react/shared/stack";
import { ColumnFilter } from "../types";
import Icon from "src/react/shared/icon";
import { IconType } from "src/react/shared/icon/types";
import { Button } from "src/react/shared/button";
import FilterRow from "./filter-row";
import { FilterRule, FilterType, Tag } from "src/data/types";
import { ColumnIdError } from "src/shared/table-state/error";

interface Props {
	id: string;
	top: number;
	left: number;
	isOpen: boolean;
	columns: ColumnFilter[];
	filterRules: FilterRule[];
	tags: Tag[];
	onAddClick: (columnId: string) => void;
	onToggle: (id: string) => void;
	onColumnChange: (id: string, columnId: string) => void;
	onFilterTypeChange: (id: string, value: FilterType) => void;
	onTextChange: (id: string, value: string) => void;
	onDeleteClick: (id: string) => void;
}

export default function FilterMenu({
	id,
	top,
	left,
	isOpen,
	columns,
	filterRules,
	tags,
	onAddClick,
	onToggle,
	onColumnChange,
	onFilterTypeChange,
	onTextChange,
	onDeleteClick,
}: Props) {
	return (
		<Menu isOpen={isOpen} id={id} top={top} left={left}>
			<div className="NLT__filter-menu">
				<Padding p="md">
					<Stack spacing="md" isVertical>
						{filterRules.map((rule) => {
							const { id, text, columnId, isEnabled, type } =
								rule;
							const column = columns.find(
								(column) => column.id == columnId
							);
							if (!column) throw new ColumnIdError(columnId);
							const { cellType } = column;
							const columnTags = tags.filter(
								(tag) => tag.columnId === columnId
							);
							return (
								<FilterRow
									key={id}
									id={id}
									columns={columns}
									text={text}
									columnTags={columnTags}
									cellType={cellType}
									filterType={type}
									columnId={columnId}
									isEnabled={isEnabled}
									onTextChange={onTextChange}
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
						onClick={() => onAddClick(columns[0].id)}
					/>
				</Padding>
			</div>
		</Menu>
	);
}
