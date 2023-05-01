import Icon from "src/react/shared/icon";
import Stack from "src/react/shared/stack";
import Flex from "../flex";
import Text from "../text";

import "./styles.css";
import { IconType } from "src/shared/types";

interface Props {
	iconType?: IconType;
	ariaLabel?: string;
	name: string;
	value?: string;
	isSelected?: boolean;
	onClick: (e: React.MouseEvent) => void;
}

export default function MenuItem({
	iconType,
	ariaLabel,
	name,
	value,
	onClick,
	isSelected = false,
}: Props) {
	let className = "NLT__menu-item NLT__selectable";
	if (isSelected) className += " NLT__selected";

	return (
		<div className={className} aria-label={ariaLabel} onClick={onClick}>
			<Flex justify="space-between">
				<Stack>
					{iconType !== undefined && <Icon type={iconType} />}
					<Text value={name} />
				</Stack>
				{value !== undefined && <Text variant="faint" value={value} />}
			</Flex>
		</div>
	);
}
