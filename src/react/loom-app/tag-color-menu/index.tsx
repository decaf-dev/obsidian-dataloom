import React from "react";

import Divider from "src/react/shared/divider";
import Input from "src/react/shared/input";
import Menu from "src/react/shared/menu";
import MenuItem from "src/react/shared/menu-item";
import Padding from "src/react/shared/padding";
import Stack from "src/react/shared/stack";
import Text from "src/react/shared/text";
import ColorItem from "./components/color-item";

import type { LoomMenuCloseRequest } from "src/react/shared/menu-provider/types";
import type { LoomMenuPosition } from "src/react/shared/menu/types";
import { Color } from "src/shared/loom-state/types/loom-state";

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
		<Menu
			id={id}
			isOpen={isOpen}
			position={position}
			topOffset={-75}
			leftOffset={-50}
		>
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
								isDarkMode={false}
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
