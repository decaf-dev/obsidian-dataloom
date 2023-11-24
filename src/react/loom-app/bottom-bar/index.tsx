import React from "react";

import _ from "lodash";

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
	onRowAddClick: () => void;
}

export default function BottomBar({
	onRowAddClick,
	onScrollToTopClick,
	onScrollToBottomClick,
	onUndoClick,
	onRedoClick,
}: Props) {
	const ref = React.useRef<HTMLDivElement | null>(null);
	const [bottomBarOffset, setBottomBarOffset] = React.useState(0);
	const isMobile = isOnMobile();

	React.useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const appEl = el.closest(".dataloom-app");
		if (!appEl) return;

		const tableEl = appEl.querySelector(
			".dataloom-table"
		) as HTMLElement | null;
		if (!tableEl) return;

		const tableContainerEl = tableEl.parentElement;
		if (!tableContainerEl) return;

		function updateBottomBar(
			tableEl: HTMLElement,
			tableContainerEl: HTMLElement
		) {
			const tableRect = tableEl.getBoundingClientRect();
			const tableContainerRect = tableContainerEl.getBoundingClientRect();

			let diff = tableContainerRect.height - tableRect.height;
			if (diff < 0) diff = 0;
			setBottomBarOffset(diff);
		}

		const THROTTLE_TIME_MILLIS = 50;
		const throttleUpdate = _.throttle(
			updateBottomBar,
			THROTTLE_TIME_MILLIS
		);

		const observer = new ResizeObserver(() => {
			throttleUpdate(tableEl, tableContainerEl);
		});

		observer.observe(tableEl);

		return () => {
			observer.disconnect();
		};
	}, []);

	let className = "dataloom-bottom-bar";
	if (isMobile) {
		className += " dataloom-bottom-bar--mobile";
	}

	return (
		<div ref={ref} className={className}>
			<div
				style={{
					top: numToPx(-bottomBarOffset),
				}}
			>
				<Padding pt="md" width="100%">
					<Stack spacing="sm">
						<Flex justify="space-between">
							<NewRowButton onClick={onRowAddClick} />
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
							</Stack>
						</Flex>
						{isMobile && (
							<Flex justify="space-between">
								<Button
									ariaLabel="Undo"
									size="lg"
									icon={<Icon lucideId="undo" />}
									onClick={onUndoClick}
								/>
								<Button
									ariaLabel="Redo"
									size="lg"
									icon={<Icon lucideId="redo" />}
									onClick={onRedoClick}
								/>
							</Flex>
						)}
					</Stack>
				</Padding>
			</div>
		</div>
	);
}
