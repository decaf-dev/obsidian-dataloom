import React, { useState, useEffect, useRef } from "react";

import IconButton from "../IconButton";
import Menu from "../Menu";

// import DragIndicator from "@mui/icons-material/DragIndicator";
import MoreVert from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import { useApp, useForceUpdate } from "../../services/utils";

import IconText from "../IconText";

import "./styles.css";

interface Props {
	onDeleteClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function DragMenu({ onDeleteClick }: Props) {
	const initialClickedButton = {
		top: 0,
		left: 0,
		width: 0,
		height: 0,
	};
	const [clickedButton, setClickedButton] = useState(initialClickedButton);

	const buttonRef = useRef<HTMLInputElement>();
	const forceUpdate = useForceUpdate();
	const { workspace } = useApp() || {};

	function handleOutsideClick() {
		setClickedButton(initialClickedButton);
	}

	function handleDragClick() {
		if (clickedButton.height > 0) return;

		if (buttonRef.current) {
			let fileExplorerWidth = 0;
			let ribbonWidth = 0;

			//Check if defined, it will be undefined if we're developing using react-scripts
			//and not rendering in Obsidian
			if (workspace) {
				const el = workspace.containerEl;
				const ribbon = el.getElementsByClassName(
					"workspace-ribbon"
				)[0] as HTMLElement;
				const fileExplorer = el.getElementsByClassName(
					"workspace-split"
				)[0] as HTMLElement;

				fileExplorerWidth = fileExplorer.offsetWidth;
				ribbonWidth = ribbon.offsetWidth;
			}

			const { x, y, width, height } =
				buttonRef.current.getBoundingClientRect();

			setClickedButton({
				left: x - fileExplorerWidth - ribbonWidth - 22,
				top: y,
				width,
				height,
			});
			forceUpdate();
		}
	}

	useEffect(() => {
		if (clickedButton.height > 0) forceUpdate();
	}, [clickedButton.height]);

	return (
		<div className="NLT__td NLT__hidden-column">
			<IconButton
				icon={<MoreVert />}
				ref={buttonRef}
				onClick={handleDragClick}
			/>
			<Menu
				hide={clickedButton.height === 0}
				style={{
					top: clickedButton.top,
					left: clickedButton.left + clickedButton.width,
				}}
				content={
					<div className="NLT__drag-menu-container">
						<IconText
							icon={
								<DeleteIcon className="NLT__icon--md NLT__margin-right" />
							}
							iconText="Delete"
							onClick={onDeleteClick}
						/>
					</div>
				}
				onOutsideClick={handleOutsideClick}
			/>
		</div>
	);
}
