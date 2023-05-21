import { css } from "@emotion/react";
import { CellType, Tag } from "src/shared/types/types";
import Select from "react-select";
import {
	CHECKBOX_MARKDOWN_CHECKED,
	CHECKBOX_MARKDOWN_UNCHECKED,
} from "src/shared/table-state/constants";

import "./styles.css";

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
	return (
		<>
			{cellType !== CellType.CHECKBOX &&
				cellType !== CellType.TAG &&
				cellType !== CellType.MULTI_TAG && (
					<input
						value={text}
						type="text"
						css={css`
							width: 150px;
						`}
						onChange={(e) => onTextChange(id, e.target.value)}
					/>
				)}
			{cellType == CellType.CHECKBOX && (
				<select
					value={text}
					onChange={(e) => onTextChange(id, e.target.value)}
				>
					<option value="">Select an option</option>
					<option value={CHECKBOX_MARKDOWN_CHECKED}>Checked</option>
					<option value={CHECKBOX_MARKDOWN_UNCHECKED}>
						Unchecked
					</option>
				</select>
			)}
			{cellType == CellType.TAG && (
				<select
					value={tagIds.length !== 0 ? tagIds[0] : ""}
					onChange={(e) => onTagsChange(id, [e.target.value])}
				>
					<option value="">Select an option</option>
					{columnTags.map((tag) => (
						<option key={tag.id} value={tag.id}>
							{tag.markdown}
						</option>
					))}
				</select>
			)}
			{cellType == CellType.MULTI_TAG && (
				<Select
					className="react-select"
					styles={{
						placeholder: (baseStyles) => ({
							...baseStyles,
							fontSize: "var(--font-ui-small)",
						}),
						control: (base) => ({
							...base,
							// This line disable the blue border
							border: 0,
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
								backgroundColor: "var(--background-secondary)",
							},
						}),
						input: (base) => ({
							...base,
							fontSize: "var(--font-ui-small)",
						}),
					}}
					getOptionLabel={(tag) => tag.markdown}
					getOptionValue={(tag) => tag.id}
					options={columnTags}
					isClearable
					isMulti
					backspaceRemovesValue
					value={columnTags.filter((tag) => tagIds.includes(tag.id))}
					onChange={(value) =>
						onTagsChange(
							id,
							value?.map((tag) => tag.id)
						)
					}
				/>
			)}
		</>
	);
}
