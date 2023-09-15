import Menu from "src/react/shared/menu";
import Padding from "src/react/shared/padding";
import Stack from "src/react/shared/stack";
import Icon from "src/react/shared/icon";
import FilterRow from "./filter-row";
import Text from "src/react/shared/text";
import Button from "src/react/shared/button";

import ColumNotFoundError from "src/shared/error/column-not-found-error";
import {
	CellType,
	FilterCondition,
	TextFilter,
	CheckboxFilter,
	TagFilter,
	MultiTagFilter,
	Filter,
} from "src/shared/loom-state/types";
import { ColumnWithMarkdown } from "../types";
import { isSmallScreenSize } from "src/shared/render/utils";
import {
	LoomMenuCloseRequestType,
	Position,
} from "src/react/shared/menu/types";
import Input from "src/react/shared/input";
import Select from "src/react/shared/select";
import {
	CHECKBOX_MARKDOWN_CHECKED,
	CHECKBOX_MARKDOWN_UNCHECKED,
} from "src/shared/constants";
import MultiSelect from "src/react/shared/multi-select";

interface Props {
	id: string;
	triggerPosition: Position;
	isOpen: boolean;
	columns: ColumnWithMarkdown[];
	filters: Filter[];
	onAddClick: (columnId: string) => void;
	onToggle: (id: string) => void;
	onColumnChange: (id: string, columnId: string) => void;
	onConditionChange: (id: string, value: FilterCondition) => void;
	onTextChange: (id: string, value: string) => void;
	onDeleteClick: (id: string) => void;
	onTagsChange: (id: string, value: string[]) => void;
	onRequestClose: (type: LoomMenuCloseRequestType) => void;
	onClose: () => void;
}

export default function FilterMenu({
	id,
	triggerPosition,
	isOpen,
	columns,
	filters,
	onAddClick,
	onToggle,
	onColumnChange,
	onConditionChange,
	onTextChange,
	onDeleteClick,
	onTagsChange,
	onRequestClose,
	onClose,
}: Props) {
	return (
		<Menu
			id={id}
			isOpen={isOpen}
			triggerPosition={triggerPosition}
			openDirection="bottom-left"
			maxHeight={255}
			onRequestClose={onRequestClose}
			onClose={onClose}
		>
			<div
				className="dataloom-filter-menu"
				style={{
					width: isSmallScreenSize()
						? "calc(100vw - 30px)"
						: undefined,
				}}
			>
				<Padding p="md">
					<Stack spacing="lg">
						{filters.map((filter) => {
							const { id, type, isEnabled, condition, columnId } =
								filter;

							const column = columns.find(
								(column) => column.id === columnId
							);
							if (!column) throw new ColumNotFoundError(columnId);
							const { tags } = column;

							let inputNode: React.ReactNode;
							let conditionOptions: FilterCondition[] = [];
							switch (type) {
								case CellType.TEXT:
								case CellType.FILE:
									const { text } = filter as TextFilter;
									inputNode = (
										<Input
											value={text}
											onChange={(newValue) =>
												onTextChange(id, newValue)
											}
										/>
									);
									conditionOptions = [
										FilterCondition.IS,
										FilterCondition.IS_NOT,
										FilterCondition.CONTAINS,
										FilterCondition.DOES_NOT_CONTAIN,
										FilterCondition.STARTS_WITH,
										FilterCondition.ENDS_WITH,
										FilterCondition.IS_EMPTY,
										FilterCondition.IS_NOT_EMPTY,
									];
									break;
								case CellType.CHECKBOX: {
									const { text } = filter as CheckboxFilter;
									inputNode = (
										<Select
											value={text}
											onChange={(newValue) =>
												onTextChange(id, newValue)
											}
										>
											<option value="">
												Select an option
											</option>
											<option
												value={
													CHECKBOX_MARKDOWN_CHECKED
												}
											>
												Checked
											</option>
											<option
												value={
													CHECKBOX_MARKDOWN_UNCHECKED
												}
											>
												Unchecked
											</option>
										</Select>
									);
									conditionOptions = [
										FilterCondition.IS,
										FilterCondition.IS_NOT,
									];
									break;
								}
								case CellType.TAG: {
									const { tagId } = filter as TagFilter;
									inputNode = (
										<Select
											value={tagId}
											onChange={(newValue) =>
												onTagsChange(id, [newValue])
											}
										>
											<option value="">
												Select an option
											</option>
											{tags.map((tag) => (
												<option
													key={tag.id}
													value={tag.id}
												>
													{tag.markdown}
												</option>
											))}
										</Select>
									);
									conditionOptions = [
										FilterCondition.IS,
										FilterCondition.IS_NOT,
										FilterCondition.IS_EMPTY,
										FilterCondition.IS_NOT_EMPTY,
									];
									break;
								}
								case CellType.MULTI_TAG: {
									const { tagIds } = filter as MultiTagFilter;
									inputNode = (
										<MultiSelect
											value={tagIds}
											onChange={(value) =>
												onTagsChange(id, value)
											}
										>
											{tags.map((tag) => (
												<option
													key={tag.id}
													value={tag.id}
												>
													{tag.markdown}
												</option>
											))}
										</MultiSelect>
									);
									conditionOptions = [
										FilterCondition.CONTAINS,
										FilterCondition.DOES_NOT_CONTAIN,
										FilterCondition.IS_EMPTY,
										FilterCondition.IS_NOT_EMPTY,
									];
									break;
								}
								default:
									throw new Error("Column type not handled");
							}

							return (
								<FilterRow
									id={id}
									columns={columns}
									selectedColumnId={columnId}
									selectedCondition={condition}
									conditionOptions={conditionOptions}
									inputNode={inputNode}
									isEnabled={isEnabled}
									onColumnChange={onColumnChange}
									onToggle={onToggle}
									onDeleteClick={onDeleteClick}
									onConditionChange={onConditionChange}
								/>
							);
						})}
						<Stack isHorizontal>
							<Button
								icon={<Icon lucideId="plus" />}
								ariaLabel="Add filter"
								onClick={() => onAddClick(columns[0].id)}
							/>
							{filters.length === 0 && (
								<Text value="No filters to display" />
							)}
						</Stack>
					</Stack>
				</Padding>
			</div>
		</Menu>
	);
}
