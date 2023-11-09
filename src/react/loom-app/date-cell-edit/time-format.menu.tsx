import Menu from "src/react/shared/menu";
import MenuItem from "src/react/shared/menu-item";
import { LoomMenuPosition } from "src/react/shared/menu/types";

interface Props {
	id: string;
	isOpen: boolean;
	position: LoomMenuPosition;
	value: boolean;
	onChange: (value: boolean) => void;
}

export default function TimeFormatMenu({
	id,
	position,
	isOpen,
	value,
	onChange,
}: Props) {
	return (
		<Menu
			isOpen={isOpen}
			id={id}
			position={position}
			width={175}
			topOffset={10}
			leftOffset={75}
		>
			<div className="dataloom-time-format-menu">
				<MenuItem
					name="12 hour"
					isSelected={value}
					onClick={() => {
						onChange(true);
					}}
				/>
				<MenuItem
					name="24 hour"
					isSelected={!value}
					onClick={() => {
						onChange(false);
					}}
				/>
			</div>
		</Menu>
	);
}
