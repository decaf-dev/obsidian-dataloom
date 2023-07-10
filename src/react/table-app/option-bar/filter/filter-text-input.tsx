import { css } from "@emotion/react";
import { CellType, Tag } from "src/shared/types";
import Select from "react-select";
import {
	CHECKBOX_MARKDOWN_CHECKED,
	CHECKBOX_MARKDOWN_UNCHECKED,
} from "src/shared/table-state/constants";

import "./styles.css";
import { baseInputStyle, selectStyle } from "src/react/table-app/shared-styles";

interface Props {
	id: string;
	text: string;
	cellType: CellType;
	columnTags: Tag[];
	tagIds: string[];
	onTextChange: (id: string, value: string) => void;
	onTagsChange: (id: string, value: string[]) => void;
}

export default function FilterTextInput({
	id,
	text,
	tagIds,
	columnTags,
	cellType,
	onTextChange,
	onTagsChange,
}: Props) {
	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") {
			e.stopPropagation();
		}
	}

	return (
		<>
			{cellType !== CellType.CHECKBOX &&
				cellType !== CellType.TAG &&
				cellType !== CellType.MULTI_TAG && (
					<input
						className="DataLoom__focusable"
						css={css`
							${baseInputStyle}
							width: 150px !important;
						`}
						value={text}
						type="text"
						onChange={(e) => onTextChange(id, e.target.value)}
					/>
				)}
			{cellType === CellType.CHECKBOX && (
				<select
					tabIndex={0}
					className="DataLoom__focusable"
					css={css`
						${selectStyle}
					`}
					value={text}
					onChange={(e) => onTextChange(id, e.target.value)}
					onKeyDown={handleKeyDown}
				>
					<option value="">Select an option</option>
					<option value={CHECKBOX_MARKDOWN_CHECKED}>Checked</option>
					<option value={CHECKBOX_MARKDOWN_UNCHECKED}>
						Unchecked
					</option>
				</select>
			)}
			{(cellType === CellType.TAG || cellType === CellType.MULTI_TAG) && (
				<Select
					className="react-select DataLoom__focusable"
					styles={{
						placeholder: (baseStyles) => ({
							...baseStyles,
							fontSize: "var(--font-ui-small)",
						}),
						control: (base) => ({
							...base,
							// This line disable the blue border
							border: 0,
							backgroundColor: "var(--interactive-normal)",
							boxShadow: "var(--input-shadow)",
							borderRadius: "var(--input-radius)",
							"&:focus-within": {
								boxShadow:
									"0 0 0px 3px var(--background-modifier-border-focus)",
							},
							"&:hover": {
								boxShadow: "var(--input-shadow-hover)",
								backgroundColor: "var(--interactive-hover)",
							},
						}),
						option: (base, state) => ({
							...base,
							fontSize: "var(--font-ui-small)",
							backgroundColor: state.isSelected
								? "var(--background-secondary)"
								: "var(--background-primary)",
							"&:hover": {
								backgroundColor: "var(--interactive-hover)",
							},
						}),
						input: (base) => ({
							...base,
							color: "var(--text-on-accent)",
							fontSize: "var(--font-ui-small)",
						}),
						menu: (base) => ({
							...base,
							backgroundColor: "var(--background-primary)",
						}),
						menuList: (base) => ({
							...base,
							backgroundColor: "var(--background-primary)",
							height: "50px",
							overflowY: "scroll",
						}),
						singleValue: (base) => ({
							...base,
							borderRadius: "8px",
							color: "var(--text-on-accent)",
							backgroundColor: "var(--color-accent)",
							fontSize: "var(--font-ui-smaller)",
							padding: "3px",
							paddingLeft: "6px",
						}),
						multiValue: (base) => ({
							...base,
							backgroundColor: "var(--color-accent)",
							borderRadius: "8px",
						}),
						multiValueLabel: (base) => ({
							...base,
							fontSize: "var(--font-ui-smaller)",
							color: "var(--text-on-accent)",
						}),
						multiValueRemove: (base) => ({
							...base,
							"&:hover": {
								backgroundColor:
									"var(--background-modifier-hover)",
								color: "var(--text-on-accent)",
							},
						}),
					}}
					getOptionLabel={(tag) => tag.markdown}
					getOptionValue={(tag) => tag.id}
					options={columnTags}
					isClearable={false}
					isMulti={cellType === CellType.MULTI_TAG}
					backspaceRemovesValue
					value={columnTags.filter((tag) => tagIds.includes(tag.id))}
					onChange={(value) => {
						if (cellType === CellType.MULTI_TAG) {
							onTagsChange(
								id,
								//@ts-expect-error value is not typed
								value?.map((tag) => tag.id)
							);
						} else {
							onTagsChange(
								id,
								//@ts-expect-error value is not typed
								[value?.id]
							);
						}
					}}
				/>
			)}
		</>
	);
}
