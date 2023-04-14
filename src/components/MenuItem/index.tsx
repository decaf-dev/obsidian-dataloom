import Icon from "src/components/Icon";
import Stack from "src/components/Stack";
import { IconType } from "src/services/icon/types";
import Flex from "../Flex";
import Text from "../Text";
import Wrap from "src/components/Wrap";

import "./styles.css";

interface Props {
	iconType?: IconType;
	name: string;
	value?: string;
	isSelected?: boolean;
	onClick: any;
}

export default function MenuItem({
	iconType,
	name,
	value,
	onClick,
	isSelected = false,
}: Props) {
	let className = "NLT__menu-item NLT__selectable";
	if (isSelected) className += " NLT__selected";

	return (
		<div className={className} onClick={() => onClick()}>
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
