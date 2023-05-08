import { CellType, FilterType } from "src/shared/table-state/types";

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
	if (
		cellType !== CellType.CHECKBOX &&
		cellType !== CellType.TAG &&
		cellType !== CellType.MULTI_TAG &&
		cellType !== CellType.TEXT
	) {
		throw new Error("Cell type not yet supported");
	}
	return (
		<select
			value={value}
			onChange={(e) => onChange(id, e.target.value as FilterType)}
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
			{cellType === CellType.TEXT && (
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
