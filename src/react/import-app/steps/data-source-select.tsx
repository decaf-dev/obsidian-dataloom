import { DataSource } from "src/react/import-app/types";
import Stack from "src/react/shared/stack";

interface Props {
	value: DataSource;
	onChange: (value: DataSource) => void;
}

export default function DataSourceSelect({ value, onChange }: Props) {
	return (
		<Stack>
			<select
				value={value}
				onChange={(e) => onChange(e.target.value as DataSource)}
			>
				{Object.values(DataSource).map((val) => (
					<option key={val} value={val}>
						{val}
					</option>
				))}
			</select>
		</Stack>
	);
}
