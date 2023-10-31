import Stack from "../stack";

interface Props {
	id: string;
	isChecked: boolean;
	component: React.ReactNode;
	handleOptionClick: (id: string) => void;
}

export default function MultiSelectOption({
	id,
	isChecked,
	component,
	handleOptionClick,
}: Props) {
	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") {
			e.stopPropagation();
			handleOptionClick(id);
		}
	}

	return (
		<div
			className="dataloom-multi-select__option dataloom-focusable dataloom-selectable"
			tabIndex={0}
			onKeyDown={handleKeyDown}
			onClick={() => handleOptionClick(id)}
		>
			<Stack isHorizontal width="100%">
				<input
					className="task-list-item-checkbox"
					type="checkbox"
					checked={isChecked}
					onChange={() => {}}
				/>
				{component}
			</Stack>
		</div>
	);
}
