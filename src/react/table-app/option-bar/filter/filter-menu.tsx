import Menu from "src/react/shared/menu";
import Padding from "src/react/shared/padding";
import Stack from "src/react/shared/stack";
import Icon from "src/react/shared/icon";
import FilterRow from "./filter-row";
import Text from "src/react/shared/text";
import { Button } from "src/react/shared/button";

import { FilterRule, FilterType } from "src/shared/types/types";
import { ColumNotFoundError } from "src/shared/table-state/table-error";
import { ColumnWithMarkdown } from "../types";
import React, { useRef } from "react";
import { useCompare, usePrevious } from "src/shared/hooks";

interface Props {
	id: string;
	top: number;
	left: number;
	isOpen: boolean;
	isReady: boolean;
	columns: ColumnWithMarkdown[];
	filterRules: FilterRule[];
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
	onAddClick,
	onToggle,
	onColumnChange,
	onFilterTypeChange,
	onTextChange,
	onDeleteClick,
	onTagsChange,
}: Props) {
	const menuRef = useRef<HTMLDivElement>(null);

	const previousLength = usePrevious(filterRules.length);
	React.useEffect(() => {
		if (previousLength !== undefined) {
			if (previousLength < filterRules.length) {
				if (menuRef.current) {
					//Scroll to the bottom if we're adding a new rule
					menuRef.current.scrollTop = menuRef.current.scrollHeight;
				}
			}
		}
	}, [previousLength]);

	return (
		<Menu
			isOpen={isOpen}
			isReady={isReady}
			id={id}
			top={top}
			left={left}
			maxHeight={255}
			ref={menuRef}
		>
			<div className="NLT__filter-menu">
				<Padding p="md">
					<Stack spacing="lg" isVertical>
						{filterRules.map((rule) => {
							const {
								id,
								text,
								columnId,
								isEnabled,
								type: filterType,
								tagIds,
							} = rule;

							const column = columns.find(
								(column) => column.id == columnId
							);
							if (!column) throw new ColumNotFoundError(columnId);
							const { tags, type: cellType } = column;

							return (
								<FilterRow
									key={id}
									id={id}
									columns={columns}
									text={text}
									columnTags={tags}
									cellType={cellType}
									tagIds={tagIds}
									filterType={filterType}
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
