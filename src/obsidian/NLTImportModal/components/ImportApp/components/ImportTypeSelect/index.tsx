import Stack from "src/components/Stack";
import { ImportType } from "src/obsidian/NLTImportModal/components/ImportApp/types";
import { getDisplayNameForImportType } from "src/obsidian/NLTImportModal/components/ImportApp/services/utils";

interface Props {
	value: ImportType;
	onChange: (value: ImportType) => void;
}

export default function ImportTypeSelect({ value, onChange }: Props) {
	return (
		<Stack isVertical>
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
