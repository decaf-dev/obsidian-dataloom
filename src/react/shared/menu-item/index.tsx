import Icon from "src/react/shared/icon";
import Stack from "src/react/shared/stack";
import Flex from "../flex";
import Text from "../text";
import Padding from "../padding";

import "./styles.css";

interface Props {
	lucideId?: string;
	ariaLabel?: string;
	name: string;
	value?: string;
	isSelected?: boolean;
	onClick?: () => void;
}

export default function MenuItem({
	lucideId,
	ariaLabel,
	name,
	value,
	onClick,
	isSelected = false,
}: Props) {
	let className = "NLT__menu-item NLT__selectable NLT__focusable";
	if (isSelected) className += " NLT__selected";

	function handleClick() {
		if (!onClick) return;
		onClick();
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") {
			//Stop propagation so the the menu doesn't close when pressing enter
			e.stopPropagation();

			if (!onClick) return;
			onClick();
		}
	}

	return (
		<div
			tabIndex={0}
			className={className}
			aria-label={ariaLabel}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
		>
			<Flex justify="space-between">
				<Stack>
					{lucideId !== undefined && (
						<Padding pb="sm">
							<Icon lucideId={lucideId} />
						</Padding>
					)}
					<Text value={name} />
				</Stack>
				{value !== undefined && <Text variant="faint" value={value} />}
			</Flex>
		</div>
	);
}
