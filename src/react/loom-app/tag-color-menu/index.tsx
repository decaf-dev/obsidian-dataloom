import Menu from "src/react/shared/menu";
import ColorItem from "./components/color-item";
import Text from "src/react/shared/text";

import { useAppSelector } from "src/redux/hooks";

import Divider from "../../shared/divider";
import Stack from "../../shared/stack";
import MenuItem from "../../shared/menu-item";

import { Color } from "src/shared/loom-state/types";
import Padding from "src/react/shared/padding";

import "./styles.css";
import {
	LoomMenuCloseRequestType,
	Position,
} from "src/react/shared/menu/types";

interface Props {
	menuId: string;
	isOpen: boolean;
	triggerPosition: Position;
	selectedColor: string;
	onColorClick: (color: Color) => void;
	onDeleteClick: () => void;
	onRequestClose: (type: LoomMenuCloseRequestType) => void;
	onClose: () => void;
}

export default function TagColorMenu({
	menuId,
	isOpen,
	triggerPosition,
	selectedColor,
	onColorClick,
	onDeleteClick,
	onRequestClose,
	onClose,
}: Props) {
	const { isDarkMode } = useAppSelector((state) => state.global);

	return (
		<Menu
			id={menuId}
			isOpen={isOpen}
			triggerPosition={triggerPosition}
			onRequestClose={onRequestClose}
			onClose={onClose}
		>
			<div className="dataloom-tag-color-menu">
				<Stack spacing="sm">
					<Padding px="lg" py="sm">
						<Text value="Color" />
					</Padding>
					<div>
						{Object.values(Color).map((color) => (
							<ColorItem
								isDarkMode={isDarkMode}
								key={color}
								color={color}
								onColorClick={onColorClick}
								isSelected={selectedColor === color}
							/>
						))}
					</div>
					<Divider />
					<MenuItem
						lucideId="trash-2"
						name="Delete"
						onClick={onDeleteClick}
					/>
				</Stack>
			</div>
		</Menu>
	);
}
