import { css } from "@emotion/react";
import { TFile } from "obsidian";
import Text from "src/react/shared/text";

interface Props {
	file: TFile | null;
	isFileNameUnique: boolean;
	onItemClick: (item: TFile | null, isFileNameUnique: boolean) => void;
}

export default function SuggestItem({
	file,
	isFileNameUnique,
	onItemClick,
}: Props) {
	const { name = "No match found", path } = file || {};
	return (
		<div
			tabIndex={0}
			css={css`
				padding: 4px 6px;
				margin: 2px 0;
				&:hover {
					background-color: var(--background-secondary-alt);
				}
			`}
			onClick={() => onItemClick(file, isFileNameUnique)}
		>
			<Text variant="semibold" value={name} />
			{path?.includes("/") && <Text value={path} />}
		</div>
	);
}
