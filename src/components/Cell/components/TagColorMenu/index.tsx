import Menu from "src/components/Menu";
import ColorItem from "./components/ColorItem";
import Text from "src/components/Text";

import { IconType } from "src/services/icon/types";
import { useAppSelector } from "src/services/redux/hooks";

import Divider from "../../../Divider";
import Stack from "../../../Stack";
import MenuItem from "../../../MenuItem";

import "./styles.css";
import { Color } from "src/services/color/types";

interface Props {
	menuId: string;
	isOpen: boolean;
	top: number;
	left: number;
	selectedColor: string;
	onColorClick: (color: Color) => void;
	onDeleteClick: () => void;
}

export default function TagColorMenu({
	menuId,
	isOpen,
	top,
	left,
	selectedColor,
	onColorClick,
	onDeleteClick,
}: Props) {
	const { isDarkMode } = useAppSelector((state) => state.global);

	return (
		<Menu id={menuId} isOpen={isOpen} top={top} left={left}>
			<div className="NLT__tag-color-menu">
				<Stack spacing="md" isVertical>
					<Text value="Color" />
					<Stack spacing="sm" isVertical>
						{Object.values(Color).map((color) => (
							<ColorItem
								isDarkMode={isDarkMode}
								key={color}
								color={color}
								onColorClick={onColorClick}
								isSelected={selectedColor === color}
							/>
						))}
					</Stack>
					<Divider />
					<MenuItem
						iconType={IconType.DELETE}
						name="Delete"
						onClick={onDeleteClick}
					/>
				</Stack>
			</div>
		</Menu>
	);
}
