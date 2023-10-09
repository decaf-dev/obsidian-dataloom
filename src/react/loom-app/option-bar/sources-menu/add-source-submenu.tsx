import React from "react";
import Button from "src/react/shared/button";
import Input from "src/react/shared/input";
import Padding from "src/react/shared/padding";
import Select from "src/react/shared/select";
import Stack from "src/react/shared/stack";
import Submenu from "src/react/shared/submenu";
import Text from "src/react/shared/text";
import { getDisplayNameForSource } from "src/shared/loom-state/type-display-names";
import { Source, SourceType } from "src/shared/loom-state/types/loom-state";
import { SourceAddHandler } from "../../app/hooks/use-source/types";
import { createFolderSource } from "src/shared/loom-state/loom-state-factory";

interface Props {
	sources: Source[];
	onAddSourceClick: SourceAddHandler;
	onBackClick: () => void;
}

interface Error {
	message: string;
	inputId: string;
}

const PATH_INPUT_ID = "path";
const TYPE_SELECT_ID = "type";

export default function AddSourceSubmenu({
	sources,
	onAddSourceClick,
	onBackClick,
}: Props) {
	const [type, setType] = React.useState<SourceType | null>(null);
	const [path, setPath] = React.useState("");
	const [error, setError] = React.useState<Error | null>(null);

	function handleAddClick() {
		if (type === null) {
			setError({
				message: "Please select a type",
				inputId: TYPE_SELECT_ID,
			});
			return;
		} else if (path === "") {
			setError({
				message: "Please enter a path",
				inputId: PATH_INPUT_ID,
			});
			return;
		} else if (alreadyHasSource(sources, type, path)) {
			setError({
				message: "Source already exists",
				inputId: PATH_INPUT_ID,
			});
			return;
		}

		let source: Source;
		if (type === SourceType.FOLDER) {
			source = createFolderSource(path);
		} else {
			setError({
				message: "Source not supported",
				inputId: TYPE_SELECT_ID,
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
							hasError={error?.inputId === TYPE_SELECT_ID}
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
					<Stack spacing="sm">
						<label htmlFor={PATH_INPUT_ID}>Path</label>
						<Input
							id={PATH_INPUT_ID}
							autoFocus={false}
							hasError={error?.inputId === PATH_INPUT_ID}
							value={path}
							onChange={(value) => setPath(value)}
						/>
					</Stack>
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
