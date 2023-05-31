import { css } from "@emotion/react";
import { TFile } from "obsidian";
import React from "react";
import Text from "src/react/shared/text";
import { eventSystem } from "src/shared/event-system/event-system";

interface Props {
	file: TFile | null;
	isHighlighted: boolean;
	isFileNameUnique: boolean;
	onItemClick: (item: TFile | null, isFileNameUnique: boolean) => void;
}

export default function SuggestItem({
	file,
	isHighlighted,
	isFileNameUnique,
	onItemClick,
}: Props) {
	const handleClick = React.useCallback(() => {
		onItemClick(file, isFileNameUnique);
	}, [file, isFileNameUnique, onItemClick]);

	React.useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Enter") handleClick();
		}

		if (isHighlighted)
			eventSystem.addEventListener("keydown", handleKeyDown, 1);

		return () => eventSystem.removeEventListener("keydown", handleKeyDown);
	}, [isHighlighted, handleClick]);

	let name = "No match found";
	if (file) {
		if (file.extension === "md") {
			//The basename does not include an extension
			name = file.basename;
		} else {
			//The name includes an extension
			name = file.name;
		}
	}

	let path: string | null = null;
	if (file) {
		if (file.parent && file.parent.path !== "/") {
			path = file.parent.path + "/";
		}
	}

	return (
		<div
			className="NLT__suggest-item"
			css={css`
				padding: 4px 6px;
				margin: 2px 0;
				background-color: ${isHighlighted
					? "var(--background-modifier-hover)"
					: "var(--background-primary)"};
				&:hover {
					background-color: var(--background-modifier-hover);
				}
			`}
			onClick={handleClick}
		>
			<Text variant="semibold" size="xs" value={name} />
			{path && <Text value={path} size="xs" />}
		</div>
	);
}
