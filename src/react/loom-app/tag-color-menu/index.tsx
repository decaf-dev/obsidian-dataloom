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
	LoomMenuCloseRequest,
	LoomMenuCloseRequestType,
	Position,
} from "src/react/shared/menu/types";
import Input from "src/react/shared/input";
import React from "react";

interface Props {
	id: string;
	isOpen: boolean;
	markdown: string;
	triggerPosition: Position;
	selectedColor: string;
	closeRequest: LoomMenuCloseRequest | null;
	onColorClick: (color: Color) => void;
	onDeleteClick: () => void;
	onRequestClose: (type: LoomMenuCloseRequestType) => void;
	onTagNameChange: (value: string) => void;
	onClose: () => void;
}

export default function TagColorMenu({
	id,
	isOpen,
	triggerPosition,
	selectedColor,
	markdown,
	closeRequest,
	onColorClick,
	onDeleteClick,
	onRequestClose,
	onTagNameChange,
	onClose,
}: Props) {
	const { isDarkMode } = useAppSelector((state) => state.global);
	const [localValue, setLocalValue] = React.useState(markdown);

	React.useEffect(
		function saveOnCloseRequest() {
			if (closeRequest === null) return;
			if (markdown !== localValue) onTagNameChange(localValue);
			onClose();
		},
		[closeRequest, markdown, localValue, onTagNameChange, onClose]
	);

	return (
		<Menu
			id={id}
			isOpen={isOpen}
			triggerPosition={triggerPosition}
			onRequestClose={onRequestClose}
			onClose={onClose}
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
