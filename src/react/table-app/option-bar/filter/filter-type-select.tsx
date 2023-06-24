import { css } from "@emotion/react";
import { selectStyle } from "src/react/table-app/shared-styles";
import { CellType, FilterType } from "src/shared/types";

interface Props {
	id: string;
	cellType: string;
	value: FilterType;
	onChange: (id: string, value: FilterType) => void;
}

export default function FilterRowDropdown({
	id,
	cellType,
	value,
	onChange,
}: Props) {
	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") {
			e.stopPropagation();
		}
	}

	return (
		<select
			tabIndex={0}
			className="Dashboards__focusable"
			css={css`
				${selectStyle}
			`}
			value={value}
			onChange={(e) => onChange(id, e.target.value as FilterType)}
			onKeyDown={handleKeyDown}
		>
			{cellType === CellType.CHECKBOX && (
				<>
					<option value={FilterType.IS}>Is</option>
					<option value={FilterType.IS_NOT}>Is not</option>
				</>
			)}
			{cellType === CellType.TAG && (
				<>
					<option value={FilterType.IS}>Is</option>
					<option value={FilterType.IS_NOT}>Is not</option>
					<option value={FilterType.IS_EMPTY}>Is empty</option>
					<option value={FilterType.IS_NOT_EMPTY}>
						Is not empty
					</option>
				</>
			)}
			{cellType === CellType.MULTI_TAG && (
				<>
					<option value={FilterType.CONTAINS}>Contains</option>
					<option value={FilterType.DOES_NOT_CONTAIN}>
						Does not contain
					</option>
					<option value={FilterType.IS_EMPTY}>Is empty</option>
					<option value={FilterType.IS_NOT_EMPTY}>
						Is not empty
					</option>
				</>
			)}
			{(cellType === CellType.TEXT || cellType === CellType.FILE) && (
				<>
					<option value={FilterType.IS}>Is</option>
					<option value={FilterType.IS_NOT}>Is not</option>
					<option value={FilterType.CONTAINS}>Contains</option>
					<option value={FilterType.DOES_NOT_CONTAIN}>
						Does not contain
					</option>
					<option value={FilterType.STARTS_WITH}>Starts with</option>
					<option value={FilterType.ENDS_WITH}>Ends with</option>
					<option value={FilterType.IS_EMPTY}>Is empty</option>
					<option value={FilterType.IS_NOT_EMPTY}>
						Is not empty
					</option>
				</>
			)}
		</select>
	);
}
