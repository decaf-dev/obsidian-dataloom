import { DataSource } from "src/react/import-app/types";
import { getDisplayNameForDataSource } from "src/react/import-app/utils";
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
				onChange={(e) =>
					onChange(parseInt(e.target.value) as DataSource)
				}
			>
				{Object.values(DataSource)
					.filter((val) => !isNaN(Number(val)))
					.map((val) => (
						<option key={val} value={val.toString()}>
							{getDisplayNameForDataSource(val as DataSource)}
						</option>
					))}
			</select>
		</Stack>
	);
}
