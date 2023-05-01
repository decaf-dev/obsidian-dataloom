import Icon from "src/react/shared/Icon";
import Stack from "src/react/shared/Stack";
import { IconType } from "src/services/icon/types";
import Flex from "../Flex";
import Text from "../Text";

import "./styles.css";

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
