import Icon from "src/components/Icon";
import { IconType } from "src/services/icon/types";

import "./styles.css";

interface Props {
	icon: IconType;
	content: string;
	onClick: () => void;
}
export default function RowMenuItem({ icon, content, onClick }: Props) {
	//Add onMouseDown to prevent blur event being called in the FocusProvider
	//See: https://github.com/react-toolbox/react-toolbox/issues/1323#issuecomment-656778859
	return (
		<div onClick={() => onClick()} className="NLT__drag-menu-item">
			<Icon icon={icon} />
			<p className="NLT__p">{content}</p>
		</div>
	);
}
