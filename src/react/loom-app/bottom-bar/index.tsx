import React from "react";

import NewRowButton from "../new-row-button";
import Stack from "src/react/shared/stack";
import Button from "src/react/shared/button";
import Flex from "src/react/shared/flex";
import Padding from "src/react/shared/padding";
import Icon from "src/react/shared/icon";
import { numToPx } from "src/shared/conversion";
import { isOnMobile } from "src/shared/render-utils";

import "./styles.css";

interface Props {
	onScrollToTopClick: () => void;
	onScrollToBottomClick: () => void;
	onUndoClick: () => void;
	onRedoClick: () => void;
	onNewRowClick: () => void;
}

export default function BottomBar({
	onNewRowClick,
	onScrollToTopClick,
	onScrollToBottomClick,
	onUndoClick,
	onRedoClick,
}: Props) {
	const ref = React.useRef<HTMLDivElement>(null);
	const [spaceBetweenTableAndContainer, setSpaceBetweenTableAndContainer] =
		React.useState(0);

	React.useEffect(() => {
		let observer: ResizeObserver | null = null;

		if (!ref.current) return;

		const appEl = ref.current.closest(".dataloom-app");
		const tableEl = appEl?.querySelector(".dataloom-table");
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
		observer.observe(tableContainerEl);

		return () => {
			if (tableEl) observer?.unobserve(tableEl);
		};
	}, [ref]);

	const isMobile = isOnMobile();

	return (
		<div className="dataloom-bottom-bar">
			<div
				ref={ref}
				style={{
					top: numToPx(-spaceBetweenTableAndContainer),
				}}
			>
				<Padding pt="md" width="100%">
					<Flex justify="space-between">
						<Stack spacing="md" isHorizontal>
							{isMobile && (
								<Button
									ariaLabel="Undo"
									icon={<Icon lucideId="undo" />}
									onClick={onUndoClick}
								/>
							)}
							<NewRowButton onClick={onNewRowClick} />
						</Stack>
						<Stack isHorizontal spacing="sm">
							<Button
								ariaLabel="Scroll to top"
								icon={<Icon lucideId="chevron-up" />}
								onClick={onScrollToTopClick}
							/>
							<Button
								ariaLabel="Scroll to bottom"
								onClick={onScrollToBottomClick}
								icon={<Icon lucideId="chevron-down" />}
							/>
							{isMobile && (
								<Button
									ariaLabel="Redo"
									icon={<Icon lucideId="redo" />}
									onClick={onRedoClick}
								/>
							)}
						</Stack>
					</Flex>
				</Padding>
			</div>
		</div>
	);
}
