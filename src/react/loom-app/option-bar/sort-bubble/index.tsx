import Button from "src/react/shared/button";
import Stack from "src/react/shared/stack";
import Icon from "src/react/shared/icon";

import { SortDir } from "src/shared/loom-state/types";

import "./styles.css";

interface SortBubbleProps {
	sortDir: SortDir;
	markdown: string;
	onRemoveClick: () => void;
}

export default function SortBubble({
	sortDir,
	markdown,
	onRemoveClick,
}: SortBubbleProps) {
	return (
		<div className="dataloom-sort-bubble">
			<Stack spacing="lg" isHorizontal>
				<Stack spacing="sm" isHorizontal>
					{sortDir === SortDir.ASC ? (
						<Icon lucideId="arrow-up" />
					) : (
						<Icon lucideId="arrow-down" />
					)}
					<span>{markdown}</span>
				</Stack>
				<Button
					isSmall
					invertFocusColor
					icon={<Icon lucideId="x" color="var(--text-on-accent)" />}
					ariaLabel="Remove sort"
					onClick={onRemoveClick}
				/>
			</Stack>
		</div>
	);
}
