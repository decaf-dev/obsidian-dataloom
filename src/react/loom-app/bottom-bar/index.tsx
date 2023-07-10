import { css } from "@emotion/react";
import NewRowButton from "../new-row-button";
import Stack from "src/react/shared/stack";
import Button from "src/react/shared/button";
import React from "react";
import Flex from "src/react/shared/flex";
import { numToPx } from "src/shared/conversion";
import Padding from "src/react/shared/padding";
import { useMountState } from "../mount-provider";

interface Props {
	appId: string;
	onScrollToTopClick: () => void;
	onScrollToBottomClick: () => void;
	onNewRowClick: () => void;
}

export default function BottomBar({
	appId,
	onNewRowClick,
	onScrollToTopClick,
	onScrollToBottomClick,
}: Props) {
	const ref = React.useRef<HTMLDivElement>(null);
	const [spaceBetweenTableAndContainer, setSpaceBetweenTableAndContainer] =
		React.useState(0);

	React.useEffect(() => {
		let observer: ResizeObserver | null = null;

		if (!ref.current) return;

		const tableEl = document.querySelector(`[data-id="${appId}"] table`);
		if (!tableEl) return;

		const tableContainerEl = tableEl.parentElement;
		if (!tableContainerEl) return;

		observer = new ResizeObserver(() => {
			const containerRect = tableContainerEl.getBoundingClientRect();
			const tableRect = tableEl.getBoundingClientRect();

			let diff = containerRect.height - tableRect.height;
			if (diff < 0) diff = 0;
			setSpaceBetweenTableAndContainer(diff);
		});
		observer.observe(tableEl);

		return () => {
			if (tableEl) observer?.unobserve(tableEl);
		};
	}, [ref]);

	const { isMarkdownView } = useMountState();

	return (
		<div
			className="DataLoom__bottom-bar"
			css={css`
				position: relative;
				height: 60px;
			`}
		>
			<div
				ref={ref}
				css={css`
					position: absolute;
					top: -${numToPx(spaceBetweenTableAndContainer)};
					width: 100%;
				`}
			>
				<Padding
					px={isMarkdownView ? "unset" : "lg"}
					py="md"
					width="100%"
				>
					<Flex justify="space-between">
						<NewRowButton onClick={onNewRowClick} />
						<Stack isHorizontal spacing="sm">
							<Button onClick={onScrollToTopClick}>Top</Button>
							<Button onClick={onScrollToBottomClick}>
								Bottom
							</Button>
						</Stack>
					</Flex>
				</Padding>
			</div>
		</div>
	);
}
