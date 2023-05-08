import { css } from "@emotion/react";
import { CellType, Tag } from "src/data/types";
import {
	CHECKBOX_MARKDOWN_CHECKED,
	CHECKBOX_MARKDOWN_UNCHECKED,
} from "src/shared/table-state/constants";

interface Props {
	id: string;
	value: string;
	cellType: CellType;
	columnTags: Tag[];
	onChange: (id: string, value: string) => void;
}

export default function FilterTextInput({
	id,
	value,
	columnTags,
	cellType,
	onChange,
}: Props) {
	return (
		<>
			{cellType !== CellType.CHECKBOX &&
				cellType !== CellType.TAG &&
				cellType !== CellType.MULTI_TAG && (
					<input
						value={value}
						type="text"
						css={css`
							width: 150px;
						`}
						onChange={(e) => onChange(id, e.target.value)}
					/>
				)}
			{cellType == CellType.CHECKBOX && (
				<select
					value={value}
					onChange={(e) => onChange(id, e.target.value)}
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
					value={value}
					onChange={(e) => onChange(id, e.target.value)}
				>
					<option value="">Select an option</option>
					{columnTags.map((tag) => (
						<option key={tag.id} value={tag.markdown}>
							{tag.markdown}
						</option>
					))}
				</select>
			)}
		</>
	);
}
