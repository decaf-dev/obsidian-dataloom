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
import { createFolderSource } from "src/shared/loom-state/loom-state-factory";
import FolderSourceOptions from "./folder-source-options";
import { AddSourceError } from "./types";

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
	const [shouldIncludeSubfolders, setIncludeSubfolders] =
		React.useState(true);
	const [error, setError] = React.useState<AddSourceError | null>(null);

	const typeSelectId = React.useId();
	const pathInputId = React.useId();
	const includeSubfoldersInputId = React.useId();

	function handleAddClick() {
		if (type === null) {
			setError({
				message: "Please select a type",
				inputId: typeSelectId,
			});
			return;
		} else if (path === "") {
			setError({
				message: "Please enter a path",
				inputId: pathInputId,
			});
			return;
		} else if (alreadyHasSource(sources, type, path)) {
			setError({
				message: "Source already exists",
				inputId: pathInputId,
			});
			return;
		}

		let source: Source;
		if (type === SourceType.FOLDER) {
			source = createFolderSource(path, shouldIncludeSubfolders);
		} else {
			setError({
				message: "Source not supported",
				inputId: pathInputId,
			});
			return;
		}
		onAddSourceClick(source);
	}

	function alreadyHasSource(
		sources: Source[],
		type: SourceType,
		path: string
	) {
		//TODO fix for tag source
		if (type === SourceType.FOLDER) {
			return sources.find(
				(source) => source.type === type && source.path === path
			);
		} else if (type === SourceType.TAG) {
			return sources.find(
				(source) => source.type === type && source.name === path
			);
		}
		throw new Error("Source type not handled");
	}

	//TODO create individual component for tag sources

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
							{Object.values(SourceType)
								.filter((type) => type !== SourceType.TAG) //TODO remove when tag sources are implemented
								.map((type) => {
									return (
										<option key={type} value={type}>
											{getDisplayNameForSource(type)}
										</option>
									);
								})}
						</Select>
					</Stack>
					<FolderSourceOptions
						pathInputId={pathInputId}
						includeSubfoldersInputId={includeSubfoldersInputId}
						error={error}
						shouldIncludeSubfolders={shouldIncludeSubfolders}
						path={path}
						onIncludeSubfoldersToggle={setIncludeSubfolders}
						onPathChange={(value) => setPath(value)}
					/>
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
