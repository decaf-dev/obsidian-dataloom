import Stack from "src/react/shared/stack";
import {
	type FilterCondition,
	type Source,
	SourceType,
} from "src/shared/loom-state/types/loom-state";

import Button from "src/react/shared/button";
import Icon from "src/react/shared/icon";
import { getFilterConditionsForPropertyType } from "../add-source-submenu/utils";
import FolderSourceItem from "../folder-source-item";
import FrontmatterSourceItem from "../frontmatter-source-item";
import "./styles.css";

interface Props {
	sources: Source[];
	onSourceAdd: () => void;
	onSourceDelete: (id: string) => void;
	onSourceFilterConditionChange: (id: string, value: FilterCondition) => void;
	onSourceFilterTextChange: (id: string, value: string) => void;
}

export default function BaseContent({
	sources,
	onSourceAdd,
	onSourceDelete,
	onSourceFilterConditionChange,
	onSourceFilterTextChange,
}: Props) {
	return (
		<Stack spacing="md">
			<Stack spacing="md">
				{sources.map((source) => {
					const { id, type } = source;

					if (type === SourceType.FOLDER) {
						const { path } = source;
						return (
							<FolderSourceItem
								key={id}
								id={id}
								content={path}
								type={type}
								onDelete={onSourceDelete}
							/>
						);
					} else if (type === SourceType.FRONTMATTER) {
						const {
							filterCondition,
							filterText,
							propertyType,
							propertyKey,
						} = source;
						const filterConditions =
							getFilterConditionsForPropertyType(propertyType);
						return (
							<FrontmatterSourceItem
								key={id}
								id={id}
								title={propertyKey}
								type={type}
								onDelete={onSourceDelete}
								selectedFilterCondition={filterCondition}
								filterConditions={filterConditions}
								filterText={filterText}
								selectedPropertyType={propertyType}
								onFilterConditionChange={
									onSourceFilterConditionChange
								}
								onFilterTextChange={onSourceFilterTextChange}
							/>
						);
					} else {
						throw new Error("Unhandled source type");
					}
				})}
			</Stack>
			<Button
				icon={<Icon lucideId="plus"></Icon>}
				onClick={() => onSourceAdd()}
				ariaLabel="Add source"
			/>
		</Stack>
	);
}
