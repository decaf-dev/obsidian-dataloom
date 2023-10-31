import Stack from "../stack";
import Text from "../text";
import { MultiSelectOption } from "./types";
import Menu from "../menu";
import { LoomMenuPosition } from "../menu/types";

interface Props {
	id: string;
	isOpen: boolean;
	position: LoomMenuPosition;
	options: MultiSelectOption[];
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
	// const [inputValue, setInputValue] = React.useState("");

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

	// const filteredValues = options.filter((option) =>
	// 	option.name.toLowerCase().includes(inputValue.toLocaleLowerCase())
	// );
	return (
		<Menu id={id} isOpen={isOpen} position={position} topOffset={35}>
			<div className="dataloom-multi-select-menu">
				<Stack spacing="md">
					{/* <Input value={inputValue} onChange={setInputValue} /> */}
					<div className="dataloom-multi-select__options">
						{options.map((option) => {
							const { id, component } = option;
							const isChecked = selectedOptionIds.includes(id);
							return (
								<Stack
									key={id}
									isHorizontal
									className="dataloom-multi-select__option dataloom-focusable dataloom-selectable"
									width="100%"
									onClick={() => handleOptionClick(id)}
								>
									<input
										className="task-list-item-checkbox"
										type="checkbox"
										checked={isChecked}
										onChange={() => {}}
									/>
									{component}
								</Stack>
							);
						})}
						{options.length === 0 && (
							<Text value="No options to select" />
						)}
					</div>
				</Stack>
			</div>
		</Menu>
	);
}
