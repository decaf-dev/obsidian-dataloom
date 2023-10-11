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
	bottomBarOffset: number;
	onScrollToTopClick: () => void;
	onScrollToBottomClick: () => void;
	onUndoClick: () => void;
	onRedoClick: () => void;
	onRowAddClick: () => void;
}

export default function BottomBar({
	bottomBarOffset,
	onRowAddClick,
	onScrollToTopClick,
	onScrollToBottomClick,
	onUndoClick,
	onRedoClick,
}: Props) {
	const isMobile = isOnMobile();

	return (
		<div className="dataloom-bottom-bar">
			<div
				style={{
					top: numToPx(-bottomBarOffset),
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
							<NewRowButton onClick={onRowAddClick} />
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
