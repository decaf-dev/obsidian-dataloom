import { IconType } from "src/services/icon/types";
import Button from "../Button";
import Icon from "../Icon";

import "./styles.css";

interface Props {
	onAddColumn: () => void;
}

export default function AddColumnButton({ onAddColumn }: Props) {
	return (
		<div className="NLT__add-column">
			<Button
				icon={<Icon type={IconType.ADD} />}
				ariaLabel="Add column"
				onClick={() => onAddColumn()}
			/>
		</div>
	);
}
