import { css } from "@emotion/react";
import NewRowButton from "../new-row-button";
import Stack from "src/react/shared/stack";
import Button from "src/react/shared/button";

interface Props {
	onScrollToTopClick: () => void;
	onScrollToBottomClick: () => void;
	onNewRowClick: () => void;
}

export default function FooterBar({
	onNewRowClick,
	onScrollToTopClick,
	onScrollToBottomClick,
}: Props) {
	return (
		<div
			className="Dashboards__footer-bar"
			css={css`
				display: flex;
				justify-content: space-between;
				padding: var(--nlt-spacing--md) var(--nlt-spacing--3xl);
			`}
		>
			<NewRowButton onClick={onNewRowClick} />
			<Stack isHorizontal spacing="sm">
				<Button onClick={onScrollToTopClick}>Top</Button>
				<Button onClick={onScrollToBottomClick}>Bottom</Button>
			</Stack>
		</div>
	);
}
