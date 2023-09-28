import React from "react";
import Button from "src/react/shared/button";
import Input from "src/react/shared/input";
import Padding from "src/react/shared/padding";
import Select from "src/react/shared/select";
import Stack from "src/react/shared/stack";
import Submenu from "src/react/shared/submenu";
import { getDisplayNameForSource } from "src/shared/loom-state/type-display-names";
import { SourceType } from "src/shared/loom-state/types/loom-state";

interface Props {
	onAddSourceClick: (type: SourceType, name: string) => void;
	onBackClick: () => void;
}

export default function AddSourceSubmenu({
	onAddSourceClick,
	onBackClick,
}: Props) {
	const [type, setType] = React.useState<SourceType | null>(null);
	const [name, setName] = React.useState("");

	function handleAddClick() {
		if (type !== null) {
			onAddSourceClick(type, name);
		}
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
						<label htmlFor="name">Name</label>
						<Input
							id="name"
							autoFocus={false}
							value={name}
							onChange={(value) => setName(value)}
						/>
					</Stack>
					<Button variant="default" onClick={handleAddClick}>
						Add
					</Button>
				</Stack>
			</Padding>
		</Submenu>
	);
}
