import Menu from "src/react/shared/Menu";
import ColorItem from "./components/ColorItem";
import Text from "src/react/shared/Text";

import { IconType } from "src/services/icon/types";
import { useAppSelector } from "src/services/redux/hooks";

import Divider from "../../../shared/Divider";
import Stack from "../../../shared/Stack";
import MenuItem from "../../../shared/MenuItem";

import "./styles.css";
import { Color } from "src/shared/types";
import Padding from "src/react/shared/Padding";

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
				<Stack spacing="sm" isVertical>
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
						iconType={IconType.DELETE}
						name="Delete"
						onClick={onDeleteClick}
					/>
				</Stack>
			</div>
		</Menu>
	);
}
