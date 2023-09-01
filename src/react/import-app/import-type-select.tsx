import { DataType } from "src/react/import-app/types";
import { getDisplayNameForDataType } from "src/react/import-app/utils";
import Stack from "src/react/shared/stack";

interface Props {
	value: DataType;
	onChange: (value: DataType) => void;
}

export default function DataTypeSelect({ value, onChange }: Props) {
	return (
		<Stack>
			<select
				value={value}
				onChange={(e) => onChange(parseInt(e.target.value) as DataType)}
			>
				{Object.values(DataType)
					.filter((type) => !isNaN(Number(type)))
					.map((type) => (
						<option key={type} value={type.toString()}>
							{getDisplayNameForDataType(type as DataType)}
						</option>
					))}
			</select>
		</Stack>
	);
}
