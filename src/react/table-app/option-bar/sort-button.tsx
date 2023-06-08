import Button from "src/react/shared/button";
import { SortDir } from "src/shared/types/types";
import Stack from "src/react/shared/stack";
import Icon from "src/react/shared/icon";
import { css } from "@emotion/react";

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
		<div
			css={css`
				border-radius: 8px;
				padding: 2px 6px;
				user-select: none;
				color: var(--text-on-accent);
				border: 1px solid var(--background-modifier-border);
				background-color: var(--color-accent);
			`}
		>
			<Stack spacing="lg">
				<Stack spacing="sm">
					{sortDir === SortDir.ASC ? (
						<Icon lucideId="arrow-up" />
					) : (
						<Icon lucideId="arrow-down" />
					)}
					<span
						css={css`
							max-width: 150px;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						`}
					>
						{markdown}
					</span>
				</Stack>
				<Button
					isSmall
					shouldInvert
					icon={<Icon lucideId="x" color="var(--text-on-accent)" />}
					ariaLabel="Remove sort"
					onClick={onRemoveClick}
				/>
			</Stack>
		</div>
	);
}
