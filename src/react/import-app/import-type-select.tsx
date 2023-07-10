import { ImportType } from "src/react/import-app/types";
import { getDisplayNameForImportType } from "src/react/import-app/utils";
import Stack from "src/react/shared/stack";

interface Props {
	value: ImportType;
	onChange: (value: ImportType) => void;
}

export default function ImportTypeSelect({ value, onChange }: Props) {
	return (
		<Stack>
			<label htmlFor="import-type-select">Import Type</label>
			<select
				id="import-type-select"
				value={value}
				onChange={(e) =>
					onChange(parseInt(e.target.value) as ImportType)
				}
			>
				<option value="-1">Select an option</option>
				{Object.values(ImportType)
					.filter((type) => !isNaN(Number(type)))
					.map((type) => (
						<option key={type} value={type.toString()}>
							{getDisplayNameForImportType(type as ImportType)}
						</option>
					))}
			</select>
		</Stack>
	);
}
