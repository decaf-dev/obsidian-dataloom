import React from "react";
import Button from "src/react/shared/button";
import Input from "src/react/shared/input";
import Padding from "src/react/shared/padding";
import Select from "src/react/shared/select";
import Stack from "src/react/shared/stack";
import Submenu from "src/react/shared/submenu";
import Text from "src/react/shared/text";
import { getDisplayNameForSource } from "src/shared/loom-state/type-display-names";
import {
	CellType,
	Column,
	SourceType,
} from "src/shared/loom-state/types/loom-state";
import { SourceAddHandler } from "../../app/hooks/use-source/types";

interface Props {
	columns: Column[];
	onAddSourceClick: SourceAddHandler;
	onBackClick: () => void;
}

interface Error {
	message: string;
	inputId: string;
}

const NAME_INPUT_ID = "name";
const TYPE_SELECT_ID = "type";
const FILE_SELECT_ID = "file";

export default function AddSourceSubmenu({
	columns,
	onAddSourceClick,
	onBackClick,
}: Props) {
	const [type, setType] = React.useState<SourceType | null>(null);
	const [name, setName] = React.useState("");
	const [fileColumnId, setFileColumnId] = React.useState<string | null>(null);
	const [error, setError] = React.useState<Error | null>(null);

	function handleAddClick(requiresFileColumn: boolean) {
		if (type === null) {
			setError({
				message: "Please select a type",
				inputId: TYPE_SELECT_ID,
			});
			return;
		} else if (fileColumnId === null) {
			if (requiresFileColumn) {
				setError({
					message: "Please select a file column",
					inputId: FILE_SELECT_ID,
				});
				return;
			}
		}
		console.log(fileColumnId);
		onAddSourceClick(type, name, fileColumnId);
	}

	const fileColumns = columns.filter(
		(column) => column.type === CellType.FILE
	);

	return (
		<Submenu title="Add source" onBackClick={onBackClick}>
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
							{Object.values(SourceType).map((type) => {
								return (
									<option key={type} value={type}>
										{getDisplayNameForSource(type)}
									</option>
								);
							})}
						</Select>
					</Stack>
					<Stack spacing="sm">
						<label htmlFor={NAME_INPUT_ID}>Name</label>
						<Input
							id={NAME_INPUT_ID}
							autoFocus={false}
							hasError={error?.inputId === NAME_INPUT_ID}
							value={name}
							onChange={(value) => setName(value)}
						/>
					</Stack>
					{fileColumns.length > 0 && (
						<Stack spacing="sm">
							<label htmlFor={FILE_SELECT_ID}>File column</label>
							<Select
								id={FILE_SELECT_ID}
								value={fileColumnId ?? ""}
								hasError={error?.inputId === FILE_SELECT_ID}
								onChange={(value) =>
									setFileColumnId(value || null)
								}
							>
								<option value="">Select an option</option>
								{fileColumns.map((column) => {
									const { id, content } = column;
									return (
										<option key={id} value={id}>
											{content}
										</option>
									);
								})}
							</Select>
						</Stack>
					)}
					{error?.message && (
						<Text value={error.message} variant="error" />
					)}
					<Button
						variant="default"
						onClick={() => handleAddClick(fileColumns.length > 0)}
					>
						Add
					</Button>
				</Stack>
			</Padding>
		</Submenu>
	);
}
