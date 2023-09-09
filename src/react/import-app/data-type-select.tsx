import { DataType } from "src/react/import-app/types";
import Stack from "src/react/shared/stack";

interface Props {
	value: DataType;
	onChange: (value: DataType) => void;
}

export default function DataTypeSelect({ value, onChange }: Props) {
	return (
		<div className="dataloom-data-type-select">
			<Stack>
				<select
					value={value}
					onChange={(e) => onChange(e.target.value as DataType)}
				>
					{Object.values(DataType).map((type) => (
						<option key={type} value={type}>
							{type}
						</option>
					))}
				</select>
			</Stack>
		</div>
	);
}
