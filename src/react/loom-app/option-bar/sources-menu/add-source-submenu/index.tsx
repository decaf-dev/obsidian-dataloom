import React from "react";

import Button from "src/react/shared/button";
import Padding from "src/react/shared/padding";
import Select from "src/react/shared/select";
import Stack from "src/react/shared/stack";
import Submenu from "src/react/shared/submenu";
import Text from "src/react/shared/text";
import { getDisplayNameForSource } from "src/shared/loom-state/type-display-names";
import { Source, SourceType } from "src/shared/loom-state/types/loom-state";
import { SourceAddHandler } from "../../../app/hooks/use-source/types";
import {
	createFolderSource,
	createFrontmatterSource,
} from "src/shared/loom-state/loom-state-factory";
import FolderSourceOptions from "./folder-source-options";
import { AddSourceError } from "./types";
import { normalizePath } from "obsidian";
import FrontmatterSourceOptions from "./frontmatter-source-options";
import { ObsidianPropertyType } from "src/shared/frontmatter/types";

interface Props {
	sources: Source[];
	onAddSourceClick: SourceAddHandler;
	onBackClick: () => void;
}

export default function AddSourceSubmenu({
	sources,
	onAddSourceClick,
	onBackClick,
}: Props) {
	const [type, setType] = React.useState<SourceType | null>(null);
	const [path, setPath] = React.useState("");
	const [includeSubfolders, setIncludeSubfolders] = React.useState(true);
	const [error, setError] = React.useState<AddSourceError | null>(null);

	//Frontmatter
	const [propertyType, setPropertyType] =
		React.useState<ObsidianPropertyType | null>(null);
	const [propertyKey, setPropertyKey] = React.useState<string | null>(null);

	const typeSelectId = React.useId();
	const pathInputId = React.useId();
	const includeSubfoldersInputId = React.useId();
	const propertyKeySelectId = React.useId();
	const propertyTypeSelectId = React.useId();

	function handleAddClick() {
		//Make sure that the path doesn't have a trailing slash
		const formattedPath = normalizePath(path);

		if (type === null) {
			setError({
				message: "Please select a type",
				inputId: typeSelectId,
			});
			return;
		} else if (type === SourceType.FOLDER) {
			if (path === "") {
				setError({
					message: "Please enter a path",
					inputId: pathInputId,
				});
				return;
			} else if (
				alreadyHasSource(sources, type, { path: formattedPath })
			) {
				setError({
					message: "A source with this path already exists",
					inputId: pathInputId,
				});
				return;
			}
		} else if (type === SourceType.FRONTMATTER) {
			if (propertyType === null) {
				setError({
					message: "Please select a property type",
					inputId: propertyTypeSelectId,
				});
				return;
			} else if (propertyKey === null) {
				setError({
					message: "Please select a property key",
					inputId: propertyKeySelectId,
				});
				return;
			} else if (alreadyHasSource(sources, type, { key: propertyKey })) {
				setError({
					message: "A source with this key already exists",
					inputId: propertyKeySelectId,
				});
				return;
			}
		}

		let source: Source | null = null;
		if (type === SourceType.FOLDER) {
			source = createFolderSource(formattedPath, includeSubfolders);
		} else if (type === SourceType.FRONTMATTER) {
			if (propertyType === null || propertyKey === null) {
				throw new Error("Property type or key is null");
			}
			source = createFrontmatterSource(propertyType, propertyKey);
		} else {
			throw new Error("Source type not handled");
		}
		onAddSourceClick(source);
	}

	function alreadyHasSource(
		sources: Source[],
		type: SourceType,
		options?: {
			path?: string;
			key?: string;
		}
	) {
		const { path, key } = options ?? {};
		if (type === SourceType.FOLDER) {
			return sources.find(
				(source) => source.type === type && source.path === path
			);
		} else if (type === SourceType.FRONTMATTER) {
			return sources.find(
				(source) => source.type === type && source.propertyKey === key
			);
		}
		throw new Error("Source type not handled");
	}

	return (
		<Submenu
			title="Add source"
			showBackButton={sources.length > 0}
			onBackClick={onBackClick}
		>
			<Padding py="md">
				<Stack spacing="lg">
					<Stack spacing="sm">
						<label htmlFor="type">Type</label>
						<Select
							id="type"
							value={type ?? ""}
							hasError={error?.inputId === typeSelectId}
							onChange={(value) =>
								setType((value as SourceType) || null)
							}
						>
							<option value="">Select an option</option>
							{Object.values(SourceType).map((type) => {
								return (
									<option key={type} value={type}>
										{getDisplayNameForSource(type)}
									</option>
								);
							})}
						</Select>
					</Stack>
					{type === SourceType.FOLDER && (
						<FolderSourceOptions
							pathInputId={pathInputId}
							includeSubfoldersInputId={includeSubfoldersInputId}
							error={error}
							includeSubfolders={includeSubfolders}
							path={path}
							onIncludeSubfoldersToggle={setIncludeSubfolders}
							onPathChange={(value) => setPath(value)}
						/>
					)}
					{type === SourceType.FRONTMATTER && (
						<FrontmatterSourceOptions
							propertyKeySelectId={propertyKeySelectId}
							propertyTypeSelectId={propertyTypeSelectId}
							error={error}
							selectedPropertyType={propertyType}
							selectedPropertyKey={propertyKey}
							onPropertyKeyChange={setPropertyKey}
							onPropertyTypeChange={setPropertyType}
						/>
					)}
					{error?.message && (
						<Text value={error.message} variant="error" />
					)}
					<Button variant="default" onClick={() => handleAddClick()}>
						Add
					</Button>
				</Stack>
			</Padding>
		</Submenu>
	);
}
