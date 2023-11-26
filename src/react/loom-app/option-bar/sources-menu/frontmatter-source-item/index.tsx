import Bubble from "src/react/shared/bubble";
import Button from "src/react/shared/button";
import Icon from "src/react/shared/icon";
import Stack from "src/react/shared/stack";
import Select from "src/react/shared/select";
import FilterInput from "../add-source-submenu/filter-input";
import SourceItem from "../source-item";

import { getIconIdForSourceType } from "src/react/shared/icon/utils";
import {
	DateFilterCondition,
	FilterCondition,
	NumberFilterCondition,
	SourceType,
	TextFilterCondition,
} from "src/shared/loom-state/types/loom-state";
import { getDisplayNameForFilterCondition } from "src/shared/loom-state/type-display-names";
import { ObsidianPropertyType } from "src/shared/frontmatter/types";
import Wrap from "src/react/shared/wrap";

interface Props {
	id: string;
	title: string;
	type: SourceType;
	selectedPropertyType: ObsidianPropertyType;
	selectedFilterCondition: FilterCondition | null;
	filterConditions: FilterCondition[];
	filterText: string;
	onDelete: (id: string) => void;
	onFilterConditionChange: (id: string, value: FilterCondition) => void;
	onFilterTextChange: (id: string, value: string) => void;
}

export default function FrontmatterSourceItem({
	filterConditions,
	filterText,
	id,
	title,
	selectedPropertyType,
	selectedFilterCondition,
	type,
	onDelete,
	onFilterConditionChange,
	onFilterTextChange,
}: Props) {
	const showFilterInput =
		selectedFilterCondition !== TextFilterCondition.IS_EMPTY &&
		selectedFilterCondition !== TextFilterCondition.IS_NOT_EMPTY &&
		selectedFilterCondition !== DateFilterCondition.IS_EMPTY &&
		selectedFilterCondition !== DateFilterCondition.IS_NOT_EMPTY &&
		selectedFilterCondition !== NumberFilterCondition.IS_NOT_EMPTY &&
		selectedFilterCondition !== NumberFilterCondition.IS_EMPTY;
	return (
		<SourceItem>
			<Wrap>
				<Stack isHorizontal spacing="sm">
					<Bubble
						icon={<Icon lucideId={getIconIdForSourceType(type)} />}
						variant="no-fill"
						value={title}
					/>
				</Stack>
				<Select
					value={selectedFilterCondition ?? ""}
					onChange={(value) =>
						onFilterConditionChange(
							id,
							(value as FilterCondition) || null
						)
					}
				>
					{Object.values(filterConditions).map((type) => {
						return (
							<option key={type} value={type}>
								{getDisplayNameForFilterCondition(type)}
							</option>
						);
					})}
				</Select>
				{showFilterInput && (
					<FilterInput
						selectedPropertyType={selectedPropertyType}
						filterText={filterText}
						onFilterTextChange={(value) =>
							onFilterTextChange(id, value)
						}
					/>
				)}
				<Button
					icon={<Icon lucideId="trash" />}
					ariaLabel="Delete source"
					onClick={() => onDelete(id)}
				/>
			</Wrap>
		</SourceItem>
	);
}
