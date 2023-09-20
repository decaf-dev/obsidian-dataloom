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
	FileFilter,
	FilterOperator,
	TextFilterCondition,
} from "src/shared/loom-state/types/loom-state";
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
import {
	createCheckboxFilter,
	createFileFilter,
	createMultiTagFilter,
	createTagFilter,
	createTextFilter,
} from "src/shared/loom-state/loom-state-factory";

interface Props {
	id: string;
	triggerPosition: Position;
	isOpen: boolean;
	columns: ColumnWithMarkdown[];
	filters: Filter[];
	onAddClick: (columnId: string, cellType: CellType) => void;
	onUpdate: (id: string, data: Partial<Filter>, isPartial?: boolean) => void;
	onDeleteClick: (id: string) => void;
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
	onUpdate,
	onDeleteClick,
	onRequestClose,
	onClose,
}: Props) {
	function onColumnChange(id: string, columnId: string) {
		const filter = filters.find((filter) => filter.id === id);
		if (!filter) throw new Error("Filter not found");
		const { condition, isEnabled } = filter;

		const column = columns.find((column) => column.id === columnId);
		if (!column) throw new ColumNotFoundError(columnId);
		const { type } = column;

		let newFilter: Filter | null = null;
		if (type === CellType.TEXT) {
			newFilter = createTextFilter(columnId, {
				condition,
				isEnabled,
			});
		} else if (type === CellType.FILE) {
			newFilter = createFileFilter(columnId, {
				condition,
				isEnabled,
			});
		} else if (type === CellType.CHECKBOX) {
			let newCondition: FilterCondition = condition;
			if (
				condition !== TextFilterCondition.IS &&
				condition !== TextFilterCondition.IS_NOT
			) {
				newCondition = TextFilterCondition.IS;
			}
			newFilter = createCheckboxFilter(columnId, {
				condition: newCondition as
					| TextFilterCondition.IS
					| TextFilterCondition.IS_NOT,
				isEnabled,
			});
		} else if (type === CellType.TAG) {
			let newCondition: FilterCondition = condition;
			if (
				condition !== TextFilterCondition.IS &&
				condition !== TextFilterCondition.IS_NOT &&
				condition !== TextFilterCondition.IS_EMPTY &&
				condition !== TextFilterCondition.IS_NOT_EMPTY
			) {
				newCondition = TextFilterCondition.IS;
			}
			newFilter = createTagFilter(columnId, {
				condition: newCondition as
					| TextFilterCondition.IS
					| TextFilterCondition.IS_NOT
					| TextFilterCondition.IS_EMPTY
					| TextFilterCondition.IS_NOT_EMPTY,
				isEnabled,
			});
		} else if (type === CellType.MULTI_TAG) {
			let newCondition: FilterCondition = condition;
			if (
				condition !== TextFilterCondition.CONTAINS &&
				condition !== TextFilterCondition.DOES_NOT_CONTAIN &&
				condition !== TextFilterCondition.IS_EMPTY &&
				condition !== TextFilterCondition.IS_NOT_EMPTY
			) {
				newCondition = TextFilterCondition.CONTAINS;
			}
			newFilter = createMultiTagFilter(columnId, {
				condition: newCondition as
					| TextFilterCondition.CONTAINS
					| TextFilterCondition.DOES_NOT_CONTAIN
					| TextFilterCondition.IS_EMPTY
					| TextFilterCondition.IS_NOT_EMPTY,
				isEnabled,
			});
		} else {
			throw new Error("Column type not handled");
		}
		onUpdate(id, newFilter, false);
	}

	function onOperatorChange(id: string, operator: FilterOperator) {
		onUpdate(id, { operator });
	}

	function onConditionChange(id: string, condition: FilterCondition) {
		onUpdate(id, { condition });
	}

	function onTextChange(id: string, text: string) {
		onUpdate(id, { text });
	}

	function onTagChange(id: string, tagId: string) {
		onUpdate(id, { tagId });
	}

	function onTagsChange(id: string, tagIds: string[]) {
		onUpdate(id, { tagIds });
	}

	function onToggle(id: string) {
		const filter = filters.find((filter) => filter.id === id);
		if (!filter) throw new Error("Filter not found");
		onUpdate(id, { isEnabled: !filter.isEnabled });
	}

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
						{filters.map((filter, i) => {
							const {
								id,
								type,
								isEnabled,
								condition,
								columnId,
								operator,
							} = filter;

							const column = columns.find(
								(column) => column.id === columnId
							);
							if (!column) throw new ColumNotFoundError(columnId);
							const { tags } = column;

							let inputNode: React.ReactNode;
							let conditionOptions: FilterCondition[] = [];
							switch (type) {
								case CellType.TEXT: {
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
										TextFilterCondition.IS,
										TextFilterCondition.IS_NOT,
										TextFilterCondition.CONTAINS,
										TextFilterCondition.DOES_NOT_CONTAIN,
										TextFilterCondition.STARTS_WITH,
										TextFilterCondition.ENDS_WITH,
										TextFilterCondition.IS_EMPTY,
										TextFilterCondition.IS_NOT_EMPTY,
									];
									break;
								}
								case CellType.FILE: {
									const { text } = filter as FileFilter;
									inputNode = (
										<Input
											value={text}
											onChange={(newValue) =>
												onTextChange(id, newValue)
											}
										/>
									);
									conditionOptions = [
										TextFilterCondition.IS,
										TextFilterCondition.IS_NOT,
										TextFilterCondition.CONTAINS,
										TextFilterCondition.DOES_NOT_CONTAIN,
										TextFilterCondition.STARTS_WITH,
										TextFilterCondition.ENDS_WITH,
										TextFilterCondition.IS_EMPTY,
										TextFilterCondition.IS_NOT_EMPTY,
									];
									break;
								}
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
										TextFilterCondition.IS,
										TextFilterCondition.IS_NOT,
									];
									break;
								}
								case CellType.TAG: {
									const { tagId } = filter as TagFilter;
									inputNode = (
										<Select
											value={tagId}
											onChange={(newValue) =>
												onTagChange(id, newValue)
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
										TextFilterCondition.IS,
										TextFilterCondition.IS_NOT,
										TextFilterCondition.IS_EMPTY,
										TextFilterCondition.IS_NOT_EMPTY,
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
										TextFilterCondition.CONTAINS,
										TextFilterCondition.DOES_NOT_CONTAIN,
										TextFilterCondition.IS_EMPTY,
										TextFilterCondition.IS_NOT_EMPTY,
									];
									break;
								}
								default:
									throw new Error("Column type not handled");
							}

							return (
								<FilterRow
									index={i}
									key={id}
									id={id}
									columns={columns}
									selectedColumnId={columnId}
									selectedCondition={condition}
									selectedOperator={operator}
									conditionOptions={conditionOptions}
									inputNode={inputNode}
									isEnabled={isEnabled}
									onColumnChange={onColumnChange}
									onOperatorChange={onOperatorChange}
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
								onClick={() =>
									onAddClick(columns[0].id, columns[0].type)
								}
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
