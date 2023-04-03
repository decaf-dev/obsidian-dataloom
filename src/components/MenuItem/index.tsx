import Icon from "src/components/Icon";
import Stack from "src/components/Stack";
import { IconType } from "src/services/icon/types";

import "./styles.css";

interface Props {
	icon?: IconType;
	content: string;
	onClick: any;
	isSelected?: boolean;
}
export default function MenuItem({
	icon,
	content,
	onClick,
	isSelected = false,
}: Props) {
	let className = "NLT__menu-item NLT__selectable";
	if (isSelected) className += " NLT__selected";

	return (
		<div className={className} onClick={() => onClick()}>
			<Stack>
				{icon !== undefined && <Icon icon={icon} />}
				<p className="NLT__p">{content}</p>
			</Stack>
		</div>
	);
}
