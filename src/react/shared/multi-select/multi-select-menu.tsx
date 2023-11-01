import Stack from "../stack";
import Text from "../text";
import Menu from "../menu";
import { LoomMenuPosition } from "../menu/types";
import MultiSelectOption from "./multi-select-option";
import { MultiSelectOptionType } from "./types";
import Input from "../input";
import React from "react";
import Padding from "../padding";

interface Props {
	id: string;
	isOpen: boolean;
	position: LoomMenuPosition;
	options: MultiSelectOptionType[];
	selectedOptionIds: string[];
	onChange: (keys: string[]) => void;
}

export default function MultiSelectMenu({
	id,
	isOpen,
	position,
	options,
	selectedOptionIds,
	onChange,
}: Props) {
	const [inputValue, setInputValue] = React.useState("");

	React.useEffect(() => {
		if (!isOpen) {
			setInputValue("");
		}
	}, [isOpen]);

	function handleOptionClick(id: string) {
		const isSelected = selectedOptionIds.includes(id);
		if (isSelected) {
			const filteredOptionIds = selectedOptionIds.filter(
				(selected) => selected !== id
			);
			onChange(filteredOptionIds);
		} else {
			onChange([...selectedOptionIds, id]);
		}
	}

	const filteredOptions = options.filter((option) =>
		option.name.toLowerCase().includes(inputValue.toLocaleLowerCase())
	);
	return (
		<Menu id={id} isOpen={isOpen} position={position} topOffset={35}>
			<div className="dataloom-multi-select-menu">
				<Stack spacing="md">
					<Padding px="md" pt="sm">
						<Input
							value={inputValue}
							placeholder="Type to filter..."
							onChange={setInputValue}
						/>
					</Padding>
					<div className="dataloom-multi-select__options">
						{filteredOptions.map((option) => {
							const { id, component } = option;
							const isChecked = selectedOptionIds.includes(id);
							return (
								<MultiSelectOption
									key={id}
									id={id}
									isChecked={isChecked}
									component={component}
									handleOptionClick={handleOptionClick}
								/>
							);
						})}
						{options.length === 0 && (
							<Padding px="md" pb="sm">
								<Text value="No options to select" />
							</Padding>
						)}
					</div>
				</Stack>
			</div>
		</Menu>
	);
}
