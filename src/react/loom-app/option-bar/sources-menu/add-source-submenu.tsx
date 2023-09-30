import React from "react";
import Button from "src/react/shared/button";
import Input from "src/react/shared/input";
import Padding from "src/react/shared/padding";
import Select from "src/react/shared/select";
import Stack from "src/react/shared/stack";
import Submenu from "src/react/shared/submenu";
import Text from "src/react/shared/text";
import { getDisplayNameForSource } from "src/shared/loom-state/type-display-names";
import { SourceType } from "src/shared/loom-state/types/loom-state";
import { SourceAddHandler } from "../../app/hooks/use-source/types";

interface Props {
	onAddSourceClick: SourceAddHandler;
	onBackClick: () => void;
}

interface Error {
	message: string;
	inputId: string;
}

const NAME_INPUT_ID = "name";
const TYPE_SELECT_ID = "type";

export default function AddSourceSubmenu({
	onAddSourceClick,
	onBackClick,
}: Props) {
	const [type, setType] = React.useState<SourceType | null>(null);
	const [name, setName] = React.useState("");
	const [error, setError] = React.useState<Error | null>(null);

	function handleAddClick() {
		if (type === null) {
			setError({
				message: "Please select a type",
				inputId: TYPE_SELECT_ID,
			});
			return;
		}
		onAddSourceClick(type, name);
	}

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
