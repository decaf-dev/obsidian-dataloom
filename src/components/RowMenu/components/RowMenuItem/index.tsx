import Icon from "src/components/Icon";
import Stack from "src/components/Stack";
import { IconType } from "src/services/icon/types";

import "./styles.css";

interface Props {
	icon: IconType;
	content: string;
	onClick: () => void;
}
export default function RowMenuItem({ icon, content, onClick }: Props) {
	return (
		<div
			onClick={() => onClick()}
			className="NLT__drag-menu-item NLT__selectable"
		>
			<Stack>
				<Icon icon={icon} />
				<p className="NLT__p">{content}</p>
			</Stack>
		</div>
	);
}
