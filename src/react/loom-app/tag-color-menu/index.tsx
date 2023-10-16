import React from "react";

import { useAppSelector } from "src/redux/hooks";

import Menu from "src/react/shared/menu";
import ColorItem from "./components/color-item";
import Text from "src/react/shared/text";
import Divider from "src/react/shared/divider";
import Stack from "src/react/shared/stack";
import MenuItem from "src/react/shared/menu-item";
import Padding from "src/react/shared/padding";
import Input from "src/react/shared/input";

import { Color } from "src/shared/loom-state/types/loom-state";
import { LoomMenuCloseRequest } from "src/react/shared/menu-provider/types";
import { LoomMenuPosition } from "src/react/shared/menu/types";

import "./styles.css";

interface Props {
	id: string;
	isOpen: boolean;
	content: string;
	position: LoomMenuPosition;
	selectedColor: string;
	closeRequest: LoomMenuCloseRequest | null;
	onColorClick: (color: Color) => void;
	onDeleteClick: () => void;
	onTagContentChange: (value: string) => void;
	onClose: () => void;
}

export default function TagColorMenu({
	id,
	isOpen,
	position,
	selectedColor,
	content,
	closeRequest,
	onColorClick,
	onDeleteClick,
	onTagContentChange,
	onClose,
}: Props) {
	const { isDarkMode } = useAppSelector((state) => state.global);
	const [localValue, setLocalValue] = React.useState(content);

	React.useEffect(
		function saveOnCloseRequest() {
			if (closeRequest === null) return;
			if (content !== localValue) onTagContentChange(localValue);
			onClose();
		},
		[closeRequest, content, localValue, onTagContentChange, onClose]
	);

	return (
		<Menu id={id} isOpen={isOpen} position={position}>
			<div className="dataloom-tag-color-menu">
				<Stack spacing="sm">
					<Padding px="md" py="sm">
						<Input value={localValue} onChange={setLocalValue} />
					</Padding>
					<MenuItem
						lucideId="trash-2"
						name="Delete"
						onClick={onDeleteClick}
					/>
					<Divider />
					<Padding px="lg" py="sm">
						<Text value="Colors" />
					</Padding>
					<div className="dataloom-tag-color-menu__color-container">
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
				</Stack>
			</div>
		</Menu>
	);
}
