import Stack from "src/react/shared/stack";

import { AddSourceError } from "./types";
import Select from "src/react/shared/select";
import { ObsidianPropertyType } from "src/shared/frontmatter/types";
import FrontmatterCache from "src/shared/frontmatter/frontmatter-cache";

interface Props {
	propertyKeySelectId: string;
	propertyTypeSelectId: string;
	selectedPropertyType: ObsidianPropertyType | null;
	selectedPropertyKey: string | null;
	error: AddSourceError | null;
	onPropertyKeyChange: (value: string | null) => void;
	onPropertyTypeChange: (value: ObsidianPropertyType | null) => void;
}

export default function FrontmatterSourceOptions({
	propertyTypeSelectId,
	propertyKeySelectId,
	selectedPropertyType,
	selectedPropertyKey,
	onPropertyKeyChange,
	onPropertyTypeChange,
}: Props) {
	let propertyTypes: string[] = [];
	if (selectedPropertyType !== null) {
		propertyTypes =
			FrontmatterCache.getInstance().getPropertyNames(
				selectedPropertyType
			);
	}

	return (
		<>
			<Stack spacing="sm">
				<label htmlFor={propertyTypeSelectId}>Property Type</label>
				<Select
					value={selectedPropertyType ?? ""}
					onChange={(value) =>
						onPropertyTypeChange(
							(value as ObsidianPropertyType) || null
						)
					}
				>
					<option value="">Select an option</option>
					{Object.values(ObsidianPropertyType).map((type) => {
						return (
							<option key={type} value={type}>
								{type}
							</option>
						);
					})}
				</Select>
			</Stack>
			<Stack spacing="sm">
				<label htmlFor={propertyKeySelectId}>Property Key</label>
				<Select
					isDisabled={selectedPropertyType === null}
					value={selectedPropertyKey ?? ""}
					onChange={(value) => onPropertyKeyChange(value || null)}
				>
					<option value="">Select an option</option>
					{Object.values(propertyTypes).map((type) => {
						return (
							<option key={type} value={type}>
								{type}
							</option>
						);
					})}
				</Select>
			</Stack>
		</>
	);
}
