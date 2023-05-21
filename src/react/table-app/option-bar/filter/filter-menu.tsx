import Menu from "src/react/shared/menu";
import Padding from "src/react/shared/padding";
import Stack from "src/react/shared/stack";
import { ColumnFilter } from "../types";
import Icon from "src/react/shared/icon";
import { Button } from "src/react/shared/button";
import FilterRow from "./filter-row";
import { FilterRule, FilterType, Tag } from "src/shared/types/types";
import { ColumnIdError } from "src/shared/table-state/table-error";
import Text from "src/react/shared/text";

interface Props {
	id: string;
	top: number;
	left: number;
	isOpen: boolean;
	isReady: boolean;
	columns: ColumnFilter[];
	filterRules: FilterRule[];
	tags: Tag[];
	onAddClick: (columnId: string) => void;
	onToggle: (id: string) => void;
	onColumnChange: (id: string, columnId: string) => void;
	onFilterTypeChange: (id: string, value: FilterType) => void;
	onTextChange: (id: string, value: string) => void;
	onDeleteClick: (id: string) => void;
	onTagsChange: (id: string, value: string[]) => void;
}

export default function FilterMenu({
	id,
	top,
	left,
	isOpen,
	isReady,
	columns,
	filterRules,
	tags,
	onAddClick,
	onToggle,
	onColumnChange,
	onFilterTypeChange,
	onTextChange,
	onDeleteClick,
	onTagsChange,
}: Props) {
	return (
		<Menu
			isOpen={isOpen}
			isReady={isReady}
			id={id}
			top={top}
			left={left}
			width={575}
		>
			<div className="NLT__filter-menu">
				<Padding p="md">
					<Stack spacing="md" isVertical>
						{filterRules.map((rule) => {
							const {
								id,
								text,
								columnId,
								isEnabled,
								type,
								tagIds,
							} = rule;
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
									tagIds={tagIds}
									filterType={type}
									columnId={columnId}
									isEnabled={isEnabled}
									onTextChange={onTextChange}
									onColumnChange={onColumnChange}
									onFilterTypeChange={onFilterTypeChange}
									onToggle={onToggle}
									onDeleteClick={onDeleteClick}
									onTagsChange={onTagsChange}
								/>
							);
						})}
						<Stack>
							<Button
								icon={<Icon lucideId="plus" />}
								ariaLabel="Add filter rule"
								onClick={() => onAddClick(columns[0].id)}
							/>
							{filterRules.length == 0 && (
								<Text value="No rules to display" />
							)}
						</Stack>
					</Stack>
				</Padding>
			</div>
		</Menu>
	);
}
